import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { LoyaltyUseCase, CreateVoucherDto, RedeemVoucherDto, AwardPointsDto, LoyaltyMemberProfileDto } from '../ports/in/loyalty.use-case';
import { LOYALTY_REPOSITORY, LoyaltyRepositoryPort } from '../ports/out/loyalty-repository.port';
import { LoyaltyVoucherEntity, LoyaltyTransactionEntity } from '../../domain/voucher.entity';
import { PrismaService } from '../../../../database/prisma.service';

@Injectable()
export class LoyaltyService implements LoyaltyUseCase {
  constructor(
    @Inject(LOYALTY_REPOSITORY)
    private readonly repo: LoyaltyRepositoryPort,
    private readonly prisma: PrismaService,
  ) {}

  async getVouchers(category?: string): Promise<LoyaltyVoucherEntity[]> {
    return await this.repo.findVouchers(category);
  }

  async createVoucher(dto: CreateVoucherDto): Promise<LoyaltyVoucherEntity> {
    return await this.repo.createVoucher(dto);
  }

  async redeemVoucher(dto: RedeemVoucherDto): Promise<{ success: boolean; transaction: LoyaltyTransactionEntity; voucher: LoyaltyVoucherEntity }> {
    const voucher = await this.repo.findVoucherById(dto.voucherId);
    if (!voucher) throw new NotFoundException('Voucher không tồn tại');
    if (voucher.stock <= 0) throw new BadRequestException('Voucher này đã hết lượt đổi thưởng');

    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });
    if (!customer) throw new NotFoundException('Khách hàng không tồn tại');

    const currentBalance = await this.repo.getCustomerPointsBalance(dto.customerId);
    if (currentBalance < voucher.points) {
      throw new BadRequestException(`Số dư điểm NovaPoints không đủ. Cần ${voucher.points} điểm, hiện có ${currentBalance} điểm.`);
    }

    const balanceAfter = currentBalance - voucher.points;
    const tx = await this.repo.createTransaction({
      customerId: customer.id,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      type: 'REDEEM',
      points: -voucher.points,
      balanceAfter,
      description: `Đổi voucher đặc quyền: ${voucher.title}`,
      voucherId: voucher.id,
      referenceCode: voucher.code,
    });

    await this.repo.decrementVoucherStock(voucher.id);

    return {
      success: true,
      transaction: tx,
      voucher,
    };
  }

  async getTransactions(customerId?: string): Promise<LoyaltyTransactionEntity[]> {
    return await this.repo.findTransactions(customerId);
  }

  async awardPoints(dto: AwardPointsDto): Promise<LoyaltyTransactionEntity> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });
    if (!customer) throw new NotFoundException('Khách hàng không tồn tại');

    const currentBalance = await this.repo.getCustomerPointsBalance(dto.customerId);
    const balanceAfter = currentBalance + dto.points;

    return await this.repo.createTransaction({
      customerId: customer.id,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      type: 'EARN',
      points: dto.points,
      balanceAfter,
      description: dto.description,
      referenceCode: dto.referenceCode,
    });
  }

  async getMemberProfile(customerId: string): Promise<LoyaltyMemberProfileDto> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) throw new NotFoundException('Khách hàng không tồn tại');

    const pointsBalance = await this.repo.getCustomerPointsBalance(customerId);
    const txs = await this.repo.findTransactions(customerId);
    const totalPointsEarned = txs
      .filter((t) => t.type === 'EARN')
      .reduce((sum, t) => sum + t.points, 0);

    const redeemedCount = txs.filter((t) => t.type === 'REDEEM').length;

    let tier: 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' = 'SILVER';
    if (totalPointsEarned >= 50000) tier = 'DIAMOND';
    else if (totalPointsEarned >= 20000) tier = 'PLATINUM';
    else if (totalPointsEarned >= 8000) tier = 'GOLD';

    return {
      customerId: customer.id,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      tier,
      pointsBalance,
      totalPointsEarned,
      vouchersCount: redeemedCount,
    };
  }
}
