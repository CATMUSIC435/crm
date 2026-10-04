import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { MarketplaceRepositoryPort } from '../../application/ports/out/marketplace-repository.port';
import { MarketplaceListingEntity, AgencyPartnerEntity } from '../../domain/marketplace.entity';
import { CreateMarketplaceListingDto, RegisterAgencyPartnerDto } from '../../application/ports/in/marketplace.use-case';

@Injectable()
export class PrismaMarketplaceRepositoryAdapter implements MarketplaceRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private formatPrice(val: number): string {
    if (val >= 1000000000) {
      return `${(val / 1000000000).toFixed(1).replace('.0', '')} Tỷ`;
    }
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(0)} Tr/tháng`;
    }
    return `${val.toLocaleString('vi-VN')} đ`;
  }

  private toListingEntity(item: any): MarketplaceListingEntity {
    const priceNum = Number(item.price);
    return {
      id: item.id,
      code: item.code,
      title: item.title,
      price: priceNum,
      priceFormatted: item.priceFormatted || this.formatPrice(priceNum),
      commSplit: item.commSplit,
      f2Commission: item.f2Commission,
      f2CommissionRate: item.f2CommissionRate,
      type: item.type,
      propertyCategory: item.propertyCategory,
      location: item.location,
      district: item.district,
      ownerAgency: item.ownerAgency,
      ownerAvatar: item.ownerAvatar,
      ownerPhone: item.ownerPhone,
      image: item.image,
      verified: item.verified,
      exclusive: item.exclusive,
      coBrokeringStatus: item.coBrokeringStatus,
    };
  }

  private toPartnerEntity(item: any): AgencyPartnerEntity {
    return {
      id: item.id,
      name: item.name,
      code: item.code,
      tier: item.tier,
      phone: item.phone,
      email: item.email,
      activeListingsCount: item.activeListingsCount,
      successfulDealsCount: item.successfulDealsCount,
      totalCommissionShared: Number(item.totalCommissionShared),
      rating: item.rating,
      verified: item.verified,
      avatar: item.avatar,
      joinedDate: item.joinedDate,
    };
  }

  async findListings(category?: string, type?: string, verifiedOnly?: boolean): Promise<MarketplaceListingEntity[]> {
    const where: any = {};
    if (category && category !== 'Tất cả') where.propertyCategory = category;
    if (type && type !== 'Tất cả') where.type = type;
    if (verifiedOnly) where.verified = true;

    const list = await this.prisma.marketplaceListing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return list.map((l) => this.toListingEntity(l));
  }

  async findListingById(id: string): Promise<MarketplaceListingEntity | null> {
    const item = await this.prisma.marketplaceListing.findUnique({ where: { id } });
    return item ? this.toListingEntity(item) : null;
  }

  async createListing(dto: CreateMarketplaceListingDto): Promise<MarketplaceListingEntity> {
    const count = await this.prisma.marketplaceListing.count();
    const code = `MKT-${String(count + 1).padStart(4, '0')}`;
    const priceFormatted = this.formatPrice(dto.price);

    const created = await this.prisma.marketplaceListing.create({
      data: {
        code,
        title: dto.title,
        price: dto.price,
        priceFormatted,
        commSplit: dto.commSplit || '50/50',
        f2Commission: dto.f2Commission || '1.5%',
        f2CommissionRate: dto.f2CommissionRate || 1.5,
        type: dto.type || 'Bán',
        propertyCategory: dto.propertyCategory || 'Căn hộ',
        location: dto.location,
        district: dto.district,
        ownerAgency: dto.ownerAgency,
        ownerAvatar: dto.ownerAvatar,
        ownerPhone: dto.ownerPhone,
        image: dto.image,
        verified: true,
        exclusive: dto.exclusive || false,
        coBrokeringStatus: 'OPEN',
      },
    });
    return this.toListingEntity(created);
  }

  async updateListingCoBrokeringStatus(id: string, status: string): Promise<void> {
    await this.prisma.marketplaceListing.update({
      where: { id },
      data: { coBrokeringStatus: status },
    });
  }

  async findAgencyPartners(): Promise<AgencyPartnerEntity[]> {
    const list = await this.prisma.agencyPartner.findMany({
      orderBy: { rating: 'desc' },
    });
    return list.map((p) => this.toPartnerEntity(p));
  }

  async createAgencyPartner(dto: RegisterAgencyPartnerDto): Promise<AgencyPartnerEntity> {
    const count = await this.prisma.agencyPartner.count();
    const code = `AGY-${String(count + 1).padStart(3, '0')}`;

    const created = await this.prisma.agencyPartner.create({
      data: {
        code,
        name: dto.name,
        tier: dto.tier || 'F1',
        phone: dto.phone,
        email: dto.email,
        activeListingsCount: 0,
        successfulDealsCount: 0,
        totalCommissionShared: 0,
        rating: 5.0,
        verified: true,
        avatar: dto.avatar,
        joinedDate: new Date().toLocaleDateString('vi-VN'),
      },
    });
    return this.toPartnerEntity(created);
  }
}
