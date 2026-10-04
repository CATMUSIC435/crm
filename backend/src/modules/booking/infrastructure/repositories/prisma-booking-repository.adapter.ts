import { Injectable } from '@nestjs/common';
import { BookingRepositoryPort } from '../../application/ports/out/booking-repository.port';
import { BookingTicketEntity } from '../../domain/booking-ticket.entity';
import { PrismaService } from '../../../../database/prisma.service';

const SEED_BOOKING_DATA: any[] = [
  {
    id: 'b1',
    code: 'BK-1001',
    unitId: 'i1',
    unitCode: 'NVW-01.01',
    unitPrice: 15500000000,
    unitType: 'Biệt thự biển đơn lập',
    unitTower: 'Khu Florida 1',
    customerId: 'c1',
    customerName: 'Nguyễn Văn Tuấn',
    customerPhone: '0901234567',
    customerRank: 'DIAMOND_VVIP',
    projectId: 'p1',
    projectName: 'NovaWorld Phan Thiet',
    agentId: 'usr-agent-004',
    agentName: 'Phạm Thị Thảo (Agent)',
    depositAmount: 100000000,
    bookingType: 'Giữ chỗ có hoàn lại',
    stage: 'INIT_SALE',
    priority: 'high',
    expiresAt: new Date(Date.now() + 14 * 60 * 1000),
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500',
    approvalHistory: [
      {
        step: 'Khởi Tạo Phiếu (Môi Giới)',
        actor: 'Phạm Thị Thảo (Agent)',
        action: 'created',
        timestamp: new Date().toISOString(),
        comment: 'Khách VIP chốt cọc sau khi xem sa bàn 360',
      },
    ],
  },
  {
    id: 'b2',
    code: 'BK-1002',
    unitId: 'i3',
    unitCode: 'AQC-05.12',
    unitPrice: 8200000000,
    unitType: 'Nhà phố liền kề',
    unitTower: 'The Suite',
    customerId: 'c2',
    customerName: 'Trần Thị Mai',
    customerPhone: '0912345678',
    customerRank: 'PLATINUM',
    projectId: 'p2',
    projectName: 'Aqua City',
    agentId: 'usr-agent-004',
    agentName: 'Phạm Thị Thảo (Agent)',
    depositAmount: 50000000,
    bookingType: 'Giữ chỗ không hoàn lại',
    stage: 'MANAGER_APPROVED',
    priority: 'normal',
    expiresAt: new Date(Date.now() + 25 * 60 * 1000),
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500',
    approvalHistory: [
      {
        step: 'Khởi Tạo Phiếu (Môi Giới)',
        actor: 'Phạm Thị Thảo (Agent)',
        action: 'created',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        comment: 'Khách chuyển khoản cọc VietQR',
      },
      {
        step: 'Trưởng Phòng Kinh Doanh Duyệt',
        actor: 'Nguyễn Văn Trưởng Phòng',
        action: 'approved',
        timestamp: new Date().toISOString(),
        comment: 'Đủ điều kiện hồ sơ khách hàng Platinum',
      },
    ],
  },
  {
    id: 'b3',
    code: 'BK-1003',
    unitId: 'i4',
    unitCode: 'TGM-18.04',
    unitPrice: 12000000000,
    unitType: 'Căn hộ hạng sang',
    unitTower: 'Tháp Sapphire',
    customerId: 'c3',
    customerName: 'Lê Hoàng Nam',
    customerPhone: '0988777666',
    customerRank: 'GOLD',
    projectId: 'p3',
    projectName: 'The Grand Manhattan',
    agentId: 'usr-agent-004',
    agentName: 'Phạm Thị Thảo (Agent)',
    depositAmount: 100000000,
    bookingType: 'Giữ chỗ có hoàn lại',
    stage: 'DONE_LOCKED',
    priority: 'vip',
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500',
    bankRef: 'VQR-20261003-9988',
    approvalHistory: [
      {
        step: 'Khởi Tạo Phiếu (Môi Giới)',
        actor: 'Phạm Thị Thảo (Agent)',
        action: 'created',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        step: 'Kế Toán Xác Nhận Tiền',
        actor: 'Hoàng Thị Kế Toán',
        action: 'approved',
        timestamp: new Date().toISOString(),
        comment: 'Đã nhận đủ 100tr vào tài khoản VPBank CĐT',
      },
    ],
  },
];

@Injectable()
export class PrismaBookingRepositoryAdapter implements BookingRepositoryPort {
  private inMemoryBookings: any[] = [...SEED_BOOKING_DATA];

  constructor(private readonly prisma: PrismaService) {}

  async save(booking: BookingTicketEntity): Promise<void> {
    if (this.prisma.isConnected) {
      try {
        await this.prisma.bookingTicket.upsert({
          where: { id: booking.id },
          create: {
            id: booking.id,
            code: booking.code,
            unitId: booking.unitId,
            customerId: booking.customerId,
            projectId: booking.projectId,
            agentId: booking.agentId,
            depositAmount: booking.depositAmount,
            bookingType: booking.bookingType,
            stage: booking.stage as any,
            priority: booking.priority,
            expiresAt: booking.expiresAt,
            paymentProofUrl: booking.paymentProofUrl,
            bankRef: booking.bankRef,
            approvalHistory: booking.approvalHistory as any,
          },
          update: {
            stage: booking.stage as any,
            expiresAt: booking.expiresAt,
            approvalHistory: booking.approvalHistory as any,
          },
        });

        // Cập nhật trạng thái căn hộ trong rổ hàng tương ứng
        const unitStatus = booking.stage === 'REJECTED' ? 'AVAILABLE' : 'BOOKING';
        await this.updateUnitStatus(booking.unitId, unitStatus, booking.expiresAt);
        return;
      } catch {}
    }

    // In-Memory Fallback
    const existingIndex = this.inMemoryBookings.findIndex((b) => b.id === booking.id || b.code === booking.code);
    const itemData = {
      id: booking.id,
      code: booking.code,
      unitId: booking.unitId,
      customerId: booking.customerId,
      projectId: booking.projectId,
      agentId: booking.agentId,
      depositAmount: booking.depositAmount,
      bookingType: booking.bookingType,
      stage: booking.stage,
      priority: booking.priority,
      expiresAt: booking.expiresAt,
      paymentProofUrl: booking.paymentProofUrl,
      bankRef: booking.bankRef,
      approvalHistory: booking.approvalHistory,
      unit: { code: booking.unitId, price: booking.depositAmount * 10, type: 'Căn hộ tiêu chuẩn', tower: 'Tháp A' },
      customer: { fullName: 'Khách Hàng Nhà Đầu Tư', phone: '0901234567', rank: 'PLATINUM' },
      project: { name: 'Dự án NovaCRM' },
      agent: { fullName: 'Chuyên Viên Sale', phone: '0901888999' },
    };

    if (existingIndex >= 0) {
      this.inMemoryBookings[existingIndex] = { ...this.inMemoryBookings[existingIndex], ...itemData };
    } else {
      this.inMemoryBookings.unshift(itemData);
    }
  }

  async findById(id: string): Promise<BookingTicketEntity | null> {
    if (this.prisma.isConnected) {
      try {
        const r = await this.prisma.bookingTicket.findUnique({
          where: { id },
          include: { unit: true, customer: true, project: true, agent: true },
        });
        if (r) {
          return new BookingTicketEntity(
            r.id,
            r.code,
            r.unitId,
            r.customerId,
            r.projectId,
            r.agentId,
            Number(r.depositAmount),
            r.bookingType,
            r.stage as any,
            r.priority,
            r.expiresAt,
            r.paymentProofUrl || undefined,
            r.bankRef || undefined,
            (r.approvalHistory as any) || [],
          );
        }
      } catch {}
    }

    const found = this.inMemoryBookings.find((b) => b.id === id || b.code === id);
    if (!found) return null;

    return new BookingTicketEntity(
      found.id,
      found.code,
      found.unitId,
      found.customerId,
      found.projectId,
      found.agentId,
      Number(found.depositAmount),
      found.bookingType,
      found.stage as any,
      found.priority,
      new Date(found.expiresAt),
      found.paymentProofUrl,
      found.bankRef,
      found.approvalHistory || [],
    );
  }

  async findByUnitId(unitId: string): Promise<BookingTicketEntity | null> {
    if (this.prisma.isConnected) {
      try {
        const r = await this.prisma.bookingTicket.findFirst({
          where: { unitId },
          orderBy: { createdAt: 'desc' },
        });
        if (r) {
          return new BookingTicketEntity(
            r.id,
            r.code,
            r.unitId,
            r.customerId,
            r.projectId,
            r.agentId,
            Number(r.depositAmount),
            r.bookingType,
            r.stage as any,
            r.priority,
            r.expiresAt,
            r.paymentProofUrl || undefined,
            r.bankRef || undefined,
            (r.approvalHistory as any) || [],
          );
        }
      } catch {}
    }

    const found = this.inMemoryBookings.find((b) => b.unitId === unitId);
    if (!found) return null;

    return new BookingTicketEntity(
      found.id,
      found.code,
      found.unitId,
      found.customerId,
      found.projectId,
      found.agentId,
      Number(found.depositAmount),
      found.bookingType,
      found.stage as any,
      found.priority,
      new Date(found.expiresAt),
      found.paymentProofUrl,
      found.bankRef,
      found.approvalHistory || [],
    );
  }

  async findAll(projectId?: string, stage?: string): Promise<any[]> {
    if (this.prisma.isConnected) {
      try {
        const where: any = {};
        if (projectId) where.projectId = projectId;
        if (stage) where.stage = stage;

        const res = await this.prisma.bookingTicket.findMany({
          where,
          include: {
            unit: { select: { code: true, price: true, type: true, tower: true } },
            customer: { select: { fullName: true, phone: true, rank: true } },
            project: { select: { name: true } },
            agent: { select: { fullName: true, phone: true } },
          },
          orderBy: { createdAt: 'desc' },
        });
        if (res && res.length > 0) return res;
      } catch {}
    }

    // In-memory filter
    let list = [...this.inMemoryBookings];
    if (projectId) list = list.filter((b) => b.projectId === projectId);
    if (stage) list = list.filter((b) => b.stage === stage);

    return list.map((b) => ({
      id: b.id,
      code: b.code,
      unitId: b.unitId,
      customerId: b.customerId,
      projectId: b.projectId,
      agentId: b.agentId,
      depositAmount: b.depositAmount,
      bookingType: b.bookingType,
      stage: b.stage,
      priority: b.priority,
      expiresAt: b.expiresAt,
      paymentProofUrl: b.paymentProofUrl,
      bankRef: b.bankRef,
      approvalHistory: b.approvalHistory,
      unit: b.unit || { code: b.unitCode || b.unitId, price: b.unitPrice || 10000000000, type: b.unitType || 'Căn hộ', tower: b.unitTower || 'Tháp 1' },
      customer: b.customer || { fullName: b.customerName || 'Khách Hàng', phone: b.customerPhone || '0901888999', rank: b.customerRank || 'GOLD' },
      project: b.project || { name: b.projectName || 'Đại Dự Án NovaCRM' },
      agent: b.agent || { fullName: b.agentName || 'Chuyên Viên Môi Giới', phone: '0901888999' },
    }));
  }

  async updateUnitStatus(unitId: string, status: string, expiresAt?: Date): Promise<void> {
    if (this.prisma.isConnected) {
      try {
        await this.prisma.inventoryItem.update({
          where: { id: unitId },
          data: {
            status: status as any,
            bookingExpiresAt: status === 'BOOKING' ? expiresAt : null,
          },
        });
      } catch {}
    }
  }
}
