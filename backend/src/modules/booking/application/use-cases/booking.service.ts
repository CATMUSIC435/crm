import { Injectable, Inject, NotFoundException, ConflictException, BadRequestException, Optional } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BookingUseCase } from '../ports/in/booking.use-case';
import { BOOKING_REPOSITORY_PORT, BookingRepositoryPort } from '../ports/out/booking-repository.port';
import { CreateBookingDto, ApproveBookingDto, RejectBookingDto, ExtendSlaDto } from '../dtos/booking.dto';
import { BookingTicketEntity } from '../../domain/booking-ticket.entity';
import { RedisService } from '../../../../config/redis.service';
import { randomUUID } from 'crypto';

@Injectable()
export class BookingService implements BookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY_PORT)
    private readonly bookingRepo: BookingRepositoryPort,
    private readonly redisService: RedisService,
    @Optional()
    @InjectQueue('booking-sla')
    private readonly bookingSlaQueue?: Queue,
  ) {}

  async createBooking(dto: CreateBookingDto, agentId: string) {
    const lockKey = `lock:unit:${dto.unitId}`;

    // 1. Chống race condition: Chiếm Redis Distributed Lock trong 5 giây
    const acquired = await this.redisService.acquireLock(lockKey, 5000);
    if (!acquired) {
      throw new ConflictException('Căn hộ đang được xử lý đặt chỗ bởi môi giới khác, vui lòng thử lại sau giây lát');
    }

    try {
      // 2. Kiểm tra căn hộ đã có ai giữ chỗ còn hạn chưa
      const existing = await this.bookingRepo.findByUnitId(dto.unitId);
      if (existing && !existing.isExpired() && existing.stage !== 'REJECTED') {
        throw new ConflictException('Căn hộ này hiện đang có giao dịch giữ chỗ còn hiệu lực');
      }

      // 3. Khởi tạo Domain Entity
      const id = randomUUID();
      const code = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

      const booking = new BookingTicketEntity(
        id,
        code,
        dto.unitId,
        dto.customerId,
        dto.projectId,
        agentId,
        dto.depositAmount,
        dto.bookingType,
        'INIT_SALE',
        dto.priority || 'normal',
        expiresAt,
        dto.paymentProofUrl,
        undefined,
        [
          {
            step: 'Khởi Tạo Phiếu (Môi Giới)',
            actor: 'Chuyên viên Sale',
            action: 'created',
            timestamp: new Date().toISOString(),
            comment: dto.notes,
          },
        ],
      );

      // 4. Lưu qua Outbound Port
      await this.bookingRepo.save(booking);

      // 5. Đăng ký tác vụ đếm ngược 15 phút vào hàng đợi BullMQ
      if (this.bookingSlaQueue) {
        try {
          await this.bookingSlaQueue.add(
            'check-booking-expiry',
            { bookingId: booking.id, unitId: booking.unitId, code: booking.code },
            { delay: 15 * 60 * 1000 },
          );
        } catch {
          // Graceful fallback if Redis queue is disabled
        }
      }

      // 6. Phát sự kiện đồng bộ bảng hàng thời gian thực qua Redis Pub/Sub
      await this.redisService.publish('channel:inventory:unit_status', {
        projectId: booking.projectId,
        unitId: booking.unitId,
        status: 'BOOKING',
        agentId: booking.agentId,
        bookingCode: booking.code,
        expiresAt: booking.expiresAt.toISOString(),
        message: `Phiếu [${booking.code}] vừa đặt chỗ căn hộ, thời hạn giữ chỗ 15 phút.`,
      });

      return {
        id: booking.id,
        code: booking.code,
        expiresAt: booking.expiresAt,
        stage: booking.stage,
        message: 'Khởi tạo hồ sơ booking và khóa căn 15 phút thành công',
      };
    } finally {
      // Giải phóng lock
      await this.redisService.releaseLock(lockKey);
    }
  }

  async getBookings(projectId?: string, stage?: string) {
    return await this.bookingRepo.findAll(projectId, stage);
  }

  async getBookingDetail(id: string) {
    const booking = await this.bookingRepo.findById(id);
    if (!booking) {
      throw new NotFoundException(`Không tìm thấy hồ sơ booking: ${id}`);
    }
    return booking;
  }

  async approveBooking(id: string, dto: ApproveBookingDto, actorRole: string, actorName: string) {
    const booking = await this.bookingRepo.findById(id);
    if (!booking) {
      throw new NotFoundException(`Không tìm thấy hồ sơ booking: ${id}`);
    }

    try {
      booking.approveBy(actorRole, actorName, dto.comment);
      await this.bookingRepo.save(booking);

      // Nếu đã chốt tiền xong ở bước Kế toán (DONE_LOCKED)
      if (booking.stage === 'DONE_LOCKED') {
        await this.redisService.publish('channel:inventory:unit_status', {
          projectId: booking.projectId,
          unitId: booking.unitId,
          status: 'BOOKING',
          agentId: booking.agentId,
          bookingCode: booking.code,
          message: `Phiếu [${booking.code}] đã được Kế toán xác nhận và khóa căn thành công!`,
        });
      }

      return {
        id: booking.id,
        stage: booking.stage,
        message: `Phê duyệt thành công bước: ${booking.stage}`,
      };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  async rejectBooking(id: string, dto: RejectBookingDto, actorName: string) {
    const booking = await this.bookingRepo.findById(id);
    if (!booking) {
      throw new NotFoundException(`Không tìm thấy hồ sơ booking: ${id}`);
    }

    booking.reject(actorName, dto.reason);
    await this.bookingRepo.save(booking);

    // Phát sự kiện giải phóng căn hộ về rổ hàng trống
    await this.redisService.publish('channel:inventory:unit_status', {
      projectId: booking.projectId,
      unitId: booking.unitId,
      status: 'AVAILABLE',
      agentId: null,
      bookingCode: null,
      expiresAt: null,
      message: `Phiếu [${booking.code}] đã bị từ chối (${dto.reason}). Căn hộ đã mở lại cho toàn hệ thống!`,
    });

    return {
      id: booking.id,
      stage: booking.stage,
      message: 'Đã từ chối hồ sơ booking và trả căn hộ về trạng thái rổ hàng trống',
    };
  }

  async extendSLA(id: string, dto: ExtendSlaDto, actorName: string) {
    const booking = await this.bookingRepo.findById(id);
    if (!booking) {
      throw new NotFoundException(`Không tìm thấy hồ sơ booking: ${id}`);
    }

    booking.extendSLA(dto.minutes, actorName, dto.reason);
    await this.bookingRepo.save(booking);

    // Cập nhật lại thời gian hết hạn mới trên bảng hàng
    await this.redisService.publish('channel:inventory:unit_status', {
      projectId: booking.projectId,
      unitId: booking.unitId,
      status: 'BOOKING',
      agentId: booking.agentId,
      bookingCode: booking.code,
      expiresAt: booking.expiresAt.toISOString(),
      message: `Phiếu [${booking.code}] đã được phê duyệt gia hạn thêm ${dto.minutes} phút.`,
    });

    return {
      id: booking.id,
      expiresAt: booking.expiresAt,
      message: `Đã gia hạn thêm ${dto.minutes} phút thành công`,
    };
  }
}
