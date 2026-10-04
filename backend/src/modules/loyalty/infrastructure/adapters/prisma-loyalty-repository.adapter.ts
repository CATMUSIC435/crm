import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { LoyaltyRepositoryPort } from '../../application/ports/out/loyalty-repository.port';
import { LoyaltyVoucherEntity, LoyaltyTransactionEntity } from '../../domain/voucher.entity';
import { CreateVoucherDto } from '../../application/ports/in/loyalty.use-case';

@Injectable()
export class PrismaLoyaltyRepositoryAdapter implements LoyaltyRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toVoucherEntity(item: any): LoyaltyVoucherEntity {
    return {
      id: item.id,
      code: item.code,
      title: item.title,
      points: item.points,
      iconName: item.iconName,
      color: item.color,
      category: item.category,
      description: item.description,
      expiryDate: item.expiryDate,
      stock: item.stock,
      terms: item.terms,
    };
  }

  private toTxEntity(item: any): LoyaltyTransactionEntity {
    return {
      id: item.id,
      customerId: item.customerId,
      customerName: item.customerName,
      customerPhone: item.customerPhone,
      type: item.type,
      points: item.points,
      balanceAfter: item.balanceAfter,
      description: item.description,
      voucherId: item.voucherId,
      referenceCode: item.referenceCode,
      createdAt: item.createdAt,
    };
  }

  async findVouchers(category?: string): Promise<LoyaltyVoucherEntity[]> {
    const where: any = {};
    if (category && category !== 'All') where.category = category;

    const list = await this.prisma.loyaltyVoucher.findMany({
      where,
      orderBy: { points: 'asc' },
    });
    return list.map((v) => this.toVoucherEntity(v));
  }

  async findVoucherById(id: string): Promise<LoyaltyVoucherEntity | null> {
    const item = await this.prisma.loyaltyVoucher.findUnique({ where: { id } });
    return item ? this.toVoucherEntity(item) : null;
  }

  async createVoucher(dto: CreateVoucherDto): Promise<LoyaltyVoucherEntity> {
    const count = await this.prisma.loyaltyVoucher.count();
    const code = `VCH-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const created = await this.prisma.loyaltyVoucher.create({
      data: {
        code,
        title: dto.title,
        points: dto.points,
        iconName: dto.iconName || 'Gift',
        color: dto.color || 'emerald',
        category: dto.category || 'resort',
        description: dto.description,
        expiryDate: dto.expiryDate || '31/12/2026',
        stock: dto.stock || 50,
        terms: dto.terms || 'Áp dụng cho khách hàng thành viên NovaClub',
      },
    });
    return this.toVoucherEntity(created);
  }

  async decrementVoucherStock(id: string): Promise<void> {
    await this.prisma.loyaltyVoucher.update({
      where: { id },
      data: { stock: { decrement: 1 } },
    });
  }

  async findTransactions(customerId?: string): Promise<LoyaltyTransactionEntity[]> {
    const where: any = {};
    if (customerId) where.customerId = customerId;

    const list = await this.prisma.loyaltyTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return list.map((t) => this.toTxEntity(t));
  }

  async createTransaction(data: {
    customerId?: string;
    customerName: string;
    customerPhone?: string;
    type: string;
    points: number;
    balanceAfter: number;
    description: string;
    voucherId?: string;
    referenceCode?: string;
  }): Promise<LoyaltyTransactionEntity> {
    const created = await this.prisma.loyaltyTransaction.create({
      data,
    });
    return this.toTxEntity(created);
  }

  async getCustomerPointsBalance(customerId: string): Promise<number> {
    const latestTx = await this.prisma.loyaltyTransaction.findFirst({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
    return latestTx ? latestTx.balanceAfter : 0;
  }
}
