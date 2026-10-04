import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../../../database/prisma.service';
import { RedisService } from '../../../../config/redis.service';

export interface BookingSlaJobData {
  bookingId: string;
  unitId: string;
  code: string;
}

@Processor('booking-sla')
export class BookingSlaProcessor extends WorkerHost {
  private readonly logger = new Logger(BookingSlaProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {
    super();
  }

  async process(job: Job<BookingSlaJobData, any, string>): Promise<any> {
    const { bookingId, unitId, code } = job.data;
    this.logger.log(`⏳ Đang kiểm tra thời hạn SLA cho phiếu booking [${code}] (ID: ${bookingId})...`);

    const booking = await this.prisma.bookingTicket.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      this.logger.warn(`Không tìm thấy hồ sơ booking: ${bookingId}`);
      return;
    }

    // Nếu đã hoàn tất khóa căn hoặc đã bị từ chối/hủy trước đó thì bỏ qua
    if (booking.stage === 'DONE_LOCKED' || booking.stage === 'REJECTED') {
      this.logger.log(`Phiếu [${code}] đã đạt trạng thái [${booking.stage}], bỏ qua tự động hủy SLA.`);
      return;
    }

    // Kiểm tra xem thời gian thực tế đã vượt quá expiresAt chưa
    if (new Date() >= booking.expiresAt) {
      this.logger.warn(`🚨 Phiếu booking [${code}] đã quá hạn SLA 15 phút mà chưa xác nhận tiền! Đang tự động giải phóng căn hộ...`);

      // 1. Cập nhật trạng thái phiếu booking sang REJECTED
      const currentHistory = (booking.approvalHistory as any[]) || [];
      currentHistory.push({
        step: 'Hết Hạn SLA Tự Động',
        actor: 'Hệ Thống BullMQ Worker',
        action: 'rejected',
        timestamp: new Date().toISOString(),
        comment: 'Hệ thống tự động hủy giữ chỗ do quá hạn 15 phút chưa nhận được tiền đặt cọc',
      });

      await this.prisma.bookingTicket.update({
        where: { id: bookingId },
        data: {
          stage: 'REJECTED',
          approvalHistory: currentHistory,
        },
      });

      // 2. Trả căn hộ về trạng thái rổ hàng AVAILABLE (Trống)
      await this.prisma.inventoryItem.update({
        where: { id: unitId },
        data: {
          status: 'AVAILABLE',
          holdingAgentId: null,
          bookingExpiresAt: null,
        },
      });

      // 3. Đồng bộ sự kiện thời gian thực qua Redis Pub/Sub tới WebSocket Gateway
      await this.redisService.publish('channel:inventory:unit_status', {
        projectId: booking.projectId,
        unitId,
        status: 'AVAILABLE',
        agentId: null,
        bookingCode: null,
        expiresAt: null,
        message: `Phiếu [${code}] hết hạn 15p SLA. Căn hộ đã được tự động hoàn về rổ hàng mở bán!`,
      });

      this.logger.log(`✅ Đã giải phóng căn hộ [${unitId}] về trạng thái Trống và thông báo real-time thành công!`);
    } else {
      this.logger.log(`Phiếu [${code}] đã được gia hạn SLA, thời hạn mới: ${booking.expiresAt.toISOString()}`);
    }
  }
}
