import { Injectable, Logger } from '@nestjs/common';
import { PaymentUseCase } from '../ports/in/payment.use-case';
import { VietQrIpnDto } from '../dtos/vietqr-ipn.dto';
import { PaymentTransactionEntity } from '../../domain/payment.entity';
import { PrismaService } from '../../../../database/prisma.service';
import { RedisService } from '../../../../config/redis.service';

const SEED_TRANSACTIONS: any[] = [
  {
    id: 'tx-1',
    transactionRef: 'VQR-20261003-9988',
    bookingCode: 'BK-1003',
    contractCode: null,
    amount: 100000000,
    bankName: 'MBBANK',
    accountNumber: '0901888999',
    transferContent: 'THANH TOAN COC THE GRAND MANHATTAN BK-1003',
    gateway: 'VIETQR_NAPAS247',
    status: 'RECONCILED',
    createdAt: new Date('2026-10-03T06:00:00.000Z'),
  },
  {
    id: 'tx-2',
    transactionRef: 'VQR-20261002-7711',
    bookingCode: null,
    contractCode: 'HD-8802',
    amount: 820000000,
    bankName: 'TECHCOMBANK',
    accountNumber: '190333444555',
    transferContent: 'DONG TIEN DOT 1 HD-8802 AQUA CITY',
    gateway: 'VIETQR_NAPAS247',
    status: 'RECONCILED',
    createdAt: new Date('2026-10-02T10:30:00.000Z'),
  },
];

@Injectable()
export class PaymentService implements PaymentUseCase {
  private readonly logger = new Logger(PaymentService.name);
  private inMemoryTransactions: any[] = [...SEED_TRANSACTIONS];

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async processVietQrIpn(dto: VietQrIpnDto) {
    this.logger.log(`📥 Nhận thông báo IPN VietQR biến động số dư: ${dto.amount.toLocaleString()} VNĐ - Nội dung: "${dto.content}"`);

    // 1. Khởi tạo Domain Entity và bóc tách cú pháp chuyển khoản
    const tx = new PaymentTransactionEntity(
      `tx-${Date.now()}`,
      dto.transactionId,
      dto.amount,
      dto.content,
      'VIETQR_NAPAS247',
      'SUCCESS',
      dto.bankCode,
      dto.accountNumber,
    );

    let reconciliationTarget = 'KHONG_XAC_DINH';

    if (this.prisma.isConnected) {
      try {
        // 2. Tự động đối soát và gạch cọc Booking trong Database
        if (tx.isBookingPayment() && tx.bookingCode) {
          const booking = await this.prisma.bookingTicket.findUnique({
            where: { code: tx.bookingCode },
          });

          if (booking) {
            reconciliationTarget = `BOOKING:${booking.code}`;
            this.logger.log(`🎯 Khớp lệnh thành công phiếu Booking [${booking.code}]! Đang chuyển trạng thái sang Đã Khóa Căn...`);

            const history = (booking.approvalHistory as any[]) || [];
            history.push({
              step: 'Gạch Cọc Tự Động VietQR NAPAS 247',
              actor: 'Cổng Thanh Toán IPN',
              action: 'approved',
              timestamp: new Date().toISOString(),
              comment: `Hệ thống tự động gạch nợ thành công số tiền ${dto.amount.toLocaleString()} VNĐ (Mã GD: ${dto.transactionId})`,
            });

            await this.prisma.bookingTicket.update({
              where: { id: booking.id },
              data: {
                stage: 'DONE_LOCKED',
                bankRef: dto.transactionId,
                approvalHistory: history,
              },
            });

            await this.prisma.inventoryItem.update({
              where: { id: booking.unitId },
              data: {
                status: 'BOOKING',
                holdingAgentId: booking.agentId,
              },
            });

            await this.redisService.publish('channel:inventory:unit_status', {
              projectId: booking.projectId,
              unitId: booking.unitId,
              status: 'BOOKING',
              agentId: booking.agentId,
              bookingCode: booking.code,
              message: `Khớp lệnh VietQR thành công phiếu [${booking.code}]. Căn hộ đã chính thức Đã Khóa Căn!`,
            });

            tx.status = 'RECONCILED';
          }
        }

        // 3. Tự động đối soát thanh toán đợt Hợp Đồng Mua Bán trong Database
        if (tx.isContractPayment() && tx.contractCode) {
          const contract = await this.prisma.contract.findUnique({
            where: { code: tx.contractCode },
          });

          if (contract) {
            reconciliationTarget = `CONTRACT:${contract.code}`;
            this.logger.log(`🎯 Khớp lệnh thành công hợp đồng [${contract.code}]! Đang ghi nhận tiền thanh toán đợt...`);

            const currentPaid = Number(contract.paidAmount) + dto.amount;
            const progress = Math.min(100, Number(((currentPaid / Number(contract.value)) * 100).toFixed(1)));

            await this.prisma.contract.update({
              where: { id: contract.id },
              data: {
                paidAmount: currentPaid,
                paymentProgress: progress,
                status: progress >= 100 ? 'COMPLETED' : contract.status,
              },
            });

            await this.prisma.customer.update({
              where: { id: contract.customerId },
              data: {
                totalRevenue: { increment: dto.amount },
              },
            });

            tx.status = 'RECONCILED';
          }
        }

        // 4. Lưu vết giao dịch vào bảng PaymentTransaction
        const savedTx = await this.prisma.paymentTransaction.upsert({
          where: { transactionRef: dto.transactionId },
          create: {
            transactionRef: dto.transactionId,
            bookingCode: tx.bookingCode,
            contractCode: tx.contractCode,
            amount: dto.amount,
            bankName: dto.bankCode || 'NAPAS',
            accountNumber: dto.accountNumber,
            transferContent: dto.content,
            gateway: 'VIETQR_NAPAS247',
            status: tx.status as any,
            rawPayload: dto as any,
          },
          update: {
            status: tx.status as any,
          },
        });

        return {
          success: true,
          message: `Đã xử lý thông báo IPN VietQR thành công (${reconciliationTarget})`,
          data: savedTx,
        };
      } catch (err: any) {
        this.logger.warn(`Lỗi ghi DB IPN: ${err.message}, chuyển sang fallback bộ nhớ`);
      }
    }

    // In-Memory Fallback
    if (tx.isBookingPayment() && tx.bookingCode) {
      reconciliationTarget = `BOOKING:${tx.bookingCode}`;
      tx.status = 'RECONCILED';

      await this.redisService.publish('channel:inventory:unit_status', {
        projectId: 'p1',
        unitId: 'i1',
        status: 'BOOKING',
        bookingCode: tx.bookingCode,
        message: `Khớp lệnh VietQR thành công phiếu [${tx.bookingCode}]. Căn hộ đã chuyển trạng thái Đã Khóa Căn!`,
      });
    } else if (tx.isContractPayment() && tx.contractCode) {
      reconciliationTarget = `CONTRACT:${tx.contractCode}`;
      tx.status = 'RECONCILED';
    } else {
      reconciliationTarget = 'KHAC';
      tx.status = 'RECONCILED';
    }

    const memoryTx = {
      id: tx.id,
      transactionRef: dto.transactionId,
      bookingCode: tx.bookingCode,
      contractCode: tx.contractCode,
      amount: dto.amount,
      bankName: dto.bankCode || 'NAPAS',
      accountNumber: dto.accountNumber,
      transferContent: dto.content,
      gateway: 'VIETQR_NAPAS247',
      status: tx.status,
      createdAt: new Date(),
    };

    this.inMemoryTransactions.unshift(memoryTx);

    return {
      success: true,
      message: `Đã xử lý thông báo IPN VietQR thành công (${reconciliationTarget})`,
      data: memoryTx,
    };
  }

  async getTransactions(limit: number = 50) {
    if (this.prisma.isConnected) {
      try {
        const res = await this.prisma.paymentTransaction.findMany({
          take: limit,
          orderBy: { createdAt: 'desc' },
        });
        if (res && res.length > 0) return res;
      } catch {}
    }

    return this.inMemoryTransactions.slice(0, limit);
  }
}
