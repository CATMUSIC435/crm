import { Injectable } from '@nestjs/common';
import { InventoryRepositoryPort } from '../../application/ports/out/inventory-repository.port';
import { InventoryItemEntity } from '../../domain/inventory-item.entity';
import { FilterInventoryDto } from '../../application/dtos/inventory.dto';
import { PrismaService } from '../../../../database/prisma.service';

const SEED_INVENTORY_DATA = [
  {
    id: 'i1',
    code: 'NVW-01.01',
    projectId: 'p1',
    tower: 'Khu Florida',
    floor: 1,
    type: 'Biệt thự biển đơn lập',
    price: 25000000000,
    area: 250,
    status: 'SOLD',
    bedrooms: 4,
    bathrooms: 4,
    direction: 'Đông Nam',
    view: 'Trực diện Biển',
    handoverStandard: 'Full nội thất',
    discountPolicy: 'Voucher VVIP 500Tr',
  },
  {
    id: 'i2',
    code: 'NVW-01.02',
    projectId: 'p1',
    tower: 'Khu Florida',
    floor: 1,
    type: 'Biệt thự biển song lập',
    price: 18500000000,
    area: 200,
    status: 'AVAILABLE',
    bedrooms: 3,
    bathrooms: 3,
    direction: 'Nam',
    view: 'View Biển & Hồ bơi',
    handoverStandard: 'Full nội thất',
    discountPolicy: 'Chiết khấu 3% thanh toán sớm',
  },
  {
    id: 'i3',
    code: 'NVW-02.01',
    projectId: 'p1',
    tower: 'Khu Florida',
    floor: 2,
    type: 'Shophouse biển',
    price: 16000000000,
    area: 120,
    status: 'BOOKING',
    bedrooms: 3,
    bathrooms: 4,
    direction: 'Đông Bắc',
    view: 'Mặt tiền Đại Lộ',
    handoverStandard: 'Hoàn thiện ngoài, thô trong',
  },
  {
    id: 'i4',
    code: 'AQC-05.12',
    projectId: 'p2',
    tower: 'Phân khu River Park',
    floor: 1,
    type: 'Nhà phố thương mại',
    price: 12500000000,
    area: 110,
    status: 'AVAILABLE',
    bedrooms: 4,
    bathrooms: 4,
    direction: 'Đông Nam',
    view: 'Mặt tiền phố đi bộ',
  },
  {
    id: 'i5',
    code: 'AQC-05.14',
    projectId: 'p2',
    tower: 'Phân khu River Park',
    floor: 1,
    type: 'Biệt thự song lập',
    price: 21000000000,
    area: 220,
    status: 'LOCKED',
    bedrooms: 4,
    bathrooms: 5,
    direction: 'Nam',
    view: 'Công viên trung tâm',
  },
  {
    id: 'i6',
    code: 'TGM-18.04',
    projectId: 'p3',
    tower: 'Tháp Manhattan',
    floor: 18,
    type: 'Căn hộ 3PN',
    price: 15000000000,
    area: 98,
    status: 'AVAILABLE',
    bedrooms: 3,
    bathrooms: 2,
    direction: 'Đông',
    view: 'Bến Bạch Đằng & Sông Sài Gòn',
  },
];

@Injectable()
export class PrismaInventoryRepositoryAdapter implements InventoryRepositoryPort {
  private inMemoryInventory: InventoryItemEntity[];

  constructor(private readonly prisma: PrismaService) {
    this.inMemoryInventory = SEED_INVENTORY_DATA.map(
      (r) =>
        new InventoryItemEntity(
          r.id,
          r.code,
          r.projectId,
          r.type,
          r.price,
          r.area,
          r.status as any,
          r.tower,
          r.floor,
          r.bedrooms,
          r.bathrooms,
          r.direction,
          r.view,
          r.handoverStandard,
          r.discountPolicy,
        ),
    );
  }

  async findAll(filters: FilterInventoryDto): Promise<InventoryItemEntity[]> {
    if (this.prisma.isConnected) {
      try {
        const where: any = {};
        if (filters.projectId) where.projectId = filters.projectId;
        if (filters.status) where.status = filters.status;
        if (filters.type) where.type = filters.type;
        if (filters.minPrice || filters.maxPrice) {
          where.price = {};
          if (filters.minPrice) where.price.gte = filters.minPrice;
          if (filters.maxPrice) where.price.lte = filters.maxPrice;
        }
        if (filters.search) {
          where.OR = [
            { code: { contains: filters.search, mode: 'insensitive' } },
            { type: { contains: filters.search, mode: 'insensitive' } },
            { tower: { contains: filters.search, mode: 'insensitive' } },
          ];
        }

        const records = await this.prisma.inventoryItem.findMany({
          where,
          orderBy: [{ tower: 'asc' }, { floor: 'asc' }, { code: 'asc' }],
        });

        if (records && records.length > 0) {
          return records.map(
            (r) =>
              new InventoryItemEntity(
                r.id,
                r.code,
                r.projectId,
                r.type,
                Number(r.price),
                r.area,
                r.status as any,
                r.tower || undefined,
                r.floor || undefined,
                r.bedrooms,
                r.bathrooms,
                r.direction || undefined,
                r.view || undefined,
                r.handoverStandard || undefined,
                r.discountPolicy || undefined,
                r.holdingAgentId || undefined,
                r.bookingExpiresAt || undefined,
              ),
          );
        }
      } catch {}
    }

    // In-Memory Fallback
    let items = [...this.inMemoryInventory];
    if (filters.projectId) items = items.filter((i) => i.projectId === filters.projectId);
    if (filters.status) items = items.filter((i) => i.status === filters.status);
    if (filters.type) items = items.filter((i) => i.type === filters.type);
    if (filters.minPrice) items = items.filter((i) => i.price >= filters.minPrice!);
    if (filters.maxPrice) items = items.filter((i) => i.price <= filters.maxPrice!);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.code.toLowerCase().includes(s) ||
          i.type.toLowerCase().includes(s) ||
          (i.tower && i.tower.toLowerCase().includes(s)),
      );
    }
    return items;
  }

  async findById(id: string): Promise<InventoryItemEntity | null> {
    if (this.prisma.isConnected) {
      try {
        const r = await this.prisma.inventoryItem.findUnique({ where: { id } });
        if (r) {
          return new InventoryItemEntity(
            r.id,
            r.code,
            r.projectId,
            r.type,
            Number(r.price),
            r.area,
            r.status as any,
            r.tower || undefined,
            r.floor || undefined,
            r.bedrooms,
            r.bathrooms,
            r.direction || undefined,
            r.view || undefined,
            r.handoverStandard || undefined,
            r.discountPolicy || undefined,
            r.holdingAgentId || undefined,
            r.bookingExpiresAt || undefined,
          );
        }
      } catch {}
    }

    const found = this.inMemoryInventory.find((i) => i.id === id || i.code === id);
    return found || null;
  }

  async findByCode(code: string): Promise<InventoryItemEntity | null> {
    if (this.prisma.isConnected) {
      try {
        const r = await this.prisma.inventoryItem.findUnique({ where: { code } });
        if (r) {
          return new InventoryItemEntity(
            r.id,
            r.code,
            r.projectId,
            r.type,
            Number(r.price),
            r.area,
            r.status as any,
            r.tower || undefined,
            r.floor || undefined,
            r.bedrooms,
            r.bathrooms,
            r.direction || undefined,
            r.view || undefined,
            r.handoverStandard || undefined,
            r.discountPolicy || undefined,
            r.holdingAgentId || undefined,
            r.bookingExpiresAt || undefined,
          );
        }
      } catch {}
    }

    const found = this.inMemoryInventory.find((i) => i.code === code);
    return found || null;
  }

  async save(entity: InventoryItemEntity): Promise<void> {
    if (this.prisma.isConnected) {
      try {
        await this.prisma.inventoryItem.upsert({
          where: { id: entity.id },
          create: {
            id: entity.id,
            code: entity.code,
            projectId: entity.projectId,
            type: entity.type,
            price: entity.price,
            area: entity.area,
            status: entity.status as any,
            tower: entity.tower,
            floor: entity.floor,
            bedrooms: entity.bedrooms,
            bathrooms: entity.bathrooms,
            direction: entity.direction,
            view: entity.view,
            handoverStandard: entity.handoverStandard,
            discountPolicy: entity.discountPolicy,
            holdingAgentId: entity.holdingAgentId,
            bookingExpiresAt: entity.bookingExpiresAt,
          },
          update: {
            status: entity.status as any,
            price: entity.price,
            holdingAgentId: entity.holdingAgentId,
            bookingExpiresAt: entity.bookingExpiresAt,
          },
        });
      } catch {}
    }

    const idx = this.inMemoryInventory.findIndex((i) => i.id === entity.id);
    if (idx >= 0) {
      this.inMemoryInventory[idx] = entity;
    } else {
      this.inMemoryInventory.push(entity);
    }
  }

  async batchUpdateStatus(ids: string[], status: string): Promise<number> {
    if (this.prisma.isConnected) {
      try {
        const res = await this.prisma.inventoryItem.updateMany({
          where: { id: { in: ids } },
          data: { status: status as any },
        });
        if (res.count > 0) return res.count;
      } catch {}
    }

    let count = 0;
    this.inMemoryInventory.forEach((item) => {
      if (ids.includes(item.id)) {
        item.status = status as any;
        count++;
      }
    });
    return count;
  }

  async getStats(projectId?: string) {
    if (this.prisma.isConnected) {
      try {
        const where = projectId ? { projectId } : {};
        const total = await this.prisma.inventoryItem.count({ where });
        if (total > 0) {
          const available = await this.prisma.inventoryItem.count({ where: { ...where, status: 'AVAILABLE' } });
          const booking = await this.prisma.inventoryItem.count({ where: { ...where, status: 'BOOKING' } });
          const sold = await this.prisma.inventoryItem.count({ where: { ...where, status: 'SOLD' } });
          const locked = await this.prisma.inventoryItem.count({ where: { ...where, status: 'LOCKED' } });
          const absorptionRate = total > 0 ? Number(((sold / total) * 100).toFixed(1)) : 0;
          return { total, available, booking, sold, locked, absorptionRate };
        }
      } catch {}
    }

    // In-memory calculation
    let items = [...this.inMemoryInventory];
    if (projectId) items = items.filter((i) => i.projectId === projectId);
    const total = items.length;
    const available = items.filter((i) => i.status === 'AVAILABLE').length;
    const booking = items.filter((i) => i.status === 'BOOKING').length;
    const sold = items.filter((i) => i.status === 'SOLD').length;
    const locked = items.filter((i) => i.status === 'LOCKED').length;
    const absorptionRate = total > 0 ? Number(((sold / total) * 100).toFixed(1)) : 0;
    return { total, available, booking, sold, locked, absorptionRate };
  }
}
