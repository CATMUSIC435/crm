import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AuctionUseCase } from '../ports/in/auction.use-case';
import { AuctionRoomEntity } from '../../domain/auction.entity';
import { PrismaService } from '../../../../database/prisma.service';

const MOCK_ROOMS = [
  {
    id: 'AUC-101',
    code: 'NVW-01.01',
    title: 'Biệt Thự Biển Đơn Lập VIP Tổng Thống',
    projectName: 'NovaWorld Phan Thiet',
    projectId: 'p1',
    type: 'Biệt thự biển đơn lập',
    area: 250,
    bedrooms: 4,
    bathrooms: 4,
    direction: 'Đông Nam',
    view: 'Trực diện Biển Bikini Beach',
    imageUrl:
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    startingPrice: 25000000000,
    currentBid: 27800000000,
    reservePrice: 28500000000,
    bidStep: 100000000,
    escrowDeposit: 500000000,
    status: 'LIVE',
    startTime: new Date(Date.now() - 3600000).toISOString(),
    endTime: new Date(Date.now() + 7200000).toISOString(),
    winningBidderId: 'BID-9901',
    hostName: 'Đấu Giá Viên: ThS. Luật Sư Lê Quang Hải',
    _count: { bids: 18 },
  },
  {
    id: 'AUC-102',
    code: 'TGM-PH.01',
    title: 'Sky Penthouse Duplex Triệu Đô Lõi Quận 1',
    projectName: 'The Grand Manhattan',
    projectId: 'p3',
    type: 'Penthouse Duplex',
    area: 320,
    bedrooms: 4,
    bathrooms: 5,
    direction: 'Nam',
    view: 'Toàn cảnh Sông Sài Gòn & Bến Nhà Rồng',
    imageUrl:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    startingPrice: 45000000000,
    currentBid: 48600000000,
    reservePrice: 50000000000,
    bidStep: 200000000,
    escrowDeposit: 1000000000,
    status: 'LIVE',
    startTime: new Date(Date.now() - 1800000).toISOString(),
    endTime: new Date(Date.now() + 5400000).toISOString(),
    winningBidderId: 'BID-8812',
    hostName: 'Đấu Giá Viên: Trần Quốc Bảo (Sở Tư Pháp)',
    _count: { bids: 12 },
  },
];

@Injectable()
export class AuctionService implements AuctionUseCase {
  private inMemoryEscrows: any[] = [];

  constructor(private readonly prisma: PrismaService) {}

  async getRooms() {
    if (!this.prisma.isConnected) {
      return MOCK_ROOMS;
    }

    try {
      const rooms = await this.prisma.auctionRoom.findMany({
        include: {
          unit: { include: { project: true } },
          _count: { select: { bids: true } },
        },
        orderBy: { startTime: 'desc' },
      });

      if (rooms.length === 0) {
        return MOCK_ROOMS;
      }

      return rooms.map((r) => ({
        id: r.id,
        code: r.code,
        title: r.unit?.code ? `Căn hộ ${r.unit.code} - ${r.unit.type}` : `Phiên đấu giá ${r.code}`,
        projectName: r.unit?.project?.name || 'NovaWorld',
        projectId: r.unit?.projectId || 'p1',
        startingPrice: Number(r.startingPrice),
        currentBid: Number(r.currentBid),
        reservePrice: Number(r.reservePrice),
        bidStep: Number(r.bidStep),
        escrowDeposit: Number(r.escrowDeposit),
        status: r.status,
        startTime: r.startTime,
        endTime: r.endTime,
        winningBidderId: r.winningBidderId,
        _count: r._count,
      }));
    } catch {
      return MOCK_ROOMS;
    }
  }

  async getRoomDetail(id: string) {
    if (!this.prisma.isConnected) {
      const found = MOCK_ROOMS.find((r) => r.id === id || r.code === id);
      if (!found) throw new NotFoundException(`Không tìm thấy phòng đấu giá: ${id}`);
      return found;
    }

    try {
      const room = await this.prisma.auctionRoom.findFirst({
        where: { OR: [{ id }, { code: id }] },
        include: {
          unit: { include: { project: true } },
          bids: { orderBy: { timestamp: 'desc' }, take: 50 },
        },
      });

      if (!room) {
        const found = MOCK_ROOMS.find((r) => r.id === id || r.code === id);
        if (found) return found;
        throw new NotFoundException(`Không tìm thấy phòng đấu giá: ${id}`);
      }

      return {
        ...room,
        startingPrice: Number(room.startingPrice),
        currentBid: Number(room.currentBid),
        reservePrice: Number(room.reservePrice),
        bidStep: Number(room.bidStep),
        escrowDeposit: Number(room.escrowDeposit),
        bids: room.bids.map((b) => ({
          ...b,
          amount: Number(b.amount),
        })),
      };
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;
      const found = MOCK_ROOMS.find((r) => r.id === id || r.code === id);
      if (found) return found;
      throw new NotFoundException(`Không tìm thấy phòng đấu giá: ${id}`);
    }
  }

  async placeBid(auctionId: string, bidderId: string, bidderName: string, amount: number) {
    if (!this.prisma.isConnected) {
      return {
        id: `bid-${Date.now()}`,
        auctionId,
        bidderId,
        bidderNameMasked: bidderName,
        amount,
        isWinningBid: true,
        timestamp: new Date(),
      };
    }

    const raw = await this.prisma.auctionRoom.findFirst({
      where: { OR: [{ id: auctionId }, { code: auctionId }] },
    });
    if (!raw) {
      throw new NotFoundException(`Không tìm thấy phiên đấu giá: ${auctionId}`);
    }

    const domain = new AuctionRoomEntity(
      raw.id,
      raw.code,
      raw.unitId,
      Number(raw.startingPrice),
      Number(raw.currentBid),
      Number(raw.reservePrice),
      Number(raw.bidStep),
      raw.status as any,
    );

    try {
      domain.placeBid(bidderId, amount);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }

    // 1. Reset các lượt thắng trước đó
    await this.prisma.auctionBid.updateMany({
      where: { auctionId: raw.id },
      data: { isWinningBid: false },
    });

    // 2. Tạo bid mới
    const newBid = await this.prisma.auctionBid.create({
      data: {
        auctionId: raw.id,
        bidderId,
        bidderNameMasked: bidderName,
        amount,
        isWinningBid: true,
      },
    });

    // 3. Cập nhật currentBid phòng
    await this.prisma.auctionRoom.update({
      where: { id: raw.id },
      data: {
        currentBid: amount,
        winningBidderId: bidderId,
      },
    });

    return {
      ...newBid,
      amount: Number(newBid.amount),
    };
  }

  async registerEscrow(
    auctionId: string,
    bidderId: string,
    bidderName: string,
    depositAmount: number,
  ) {
    const room = await this.getRoomDetail(auctionId);
    const requiredDeposit = Number(room.escrowDeposit || 500000000);

    if (depositAmount < requiredDeposit) {
      throw new BadRequestException(
        `Số tiền ký quỹ không đủ. Yêu cầu tối thiểu: ${requiredDeposit.toLocaleString('vi-VN')} VNĐ`,
      );
    }

    const transactionRef = `ESCROW-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (this.prisma.isConnected) {
      try {
        const escrow = await this.prisma.escrowDeposit.create({
          data: {
            auctionId: room.id,
            bidderId,
            bidderName,
            depositAmount,
            status: 'HELD',
            transactionRef,
          },
        });
        return {
          ...escrow,
          depositAmount: Number(escrow.depositAmount),
        };
      } catch {
        // Fallback in-memory
      }
    }

    const fallbackEscrow = {
      id: `escrow-${Date.now()}`,
      auctionId: room.id,
      bidderId,
      bidderName,
      depositAmount,
      status: 'HELD',
      transactionRef,
      createdAt: new Date(),
    };
    this.inMemoryEscrows.push(fallbackEscrow);
    return fallbackEscrow;
  }

  async getEscrows(auctionId?: string) {
    if (this.prisma.isConnected) {
      try {
        const records = await this.prisma.escrowDeposit.findMany({
          where: auctionId ? { auctionId } : undefined,
          orderBy: { createdAt: 'desc' },
        });
        return records.map((r) => ({
          ...r,
          depositAmount: Number(r.depositAmount),
        }));
      } catch {
        // Fallback
      }
    }
    return auctionId
      ? this.inMemoryEscrows.filter((e) => e.auctionId === auctionId)
      : this.inMemoryEscrows;
  }
}
