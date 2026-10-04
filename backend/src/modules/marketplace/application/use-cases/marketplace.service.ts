import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  MarketplaceUseCase,
  CreateMarketplaceListingDto,
  RegisterAgencyPartnerDto,
} from '../ports/in/marketplace.use-case';
import { MARKETPLACE_REPOSITORY, MarketplaceRepositoryPort } from '../ports/out/marketplace-repository.port';
import { MarketplaceListingEntity, AgencyPartnerEntity } from '../../domain/marketplace.entity';

@Injectable()
export class MarketplaceService implements MarketplaceUseCase {
  constructor(
    @Inject(MARKETPLACE_REPOSITORY)
    private readonly repo: MarketplaceRepositoryPort,
  ) {}

  async getListings(category?: string, type?: string, verifiedOnly?: boolean): Promise<MarketplaceListingEntity[]> {
    return await this.repo.findListings(category, type, verifiedOnly);
  }

  async getListingById(id: string): Promise<MarketplaceListingEntity | null> {
    const item = await this.repo.findListingById(id);
    if (!item) throw new NotFoundException('Sản phẩm liên kết không tồn tại');
    return item;
  }

  async createListing(dto: CreateMarketplaceListingDto): Promise<MarketplaceListingEntity> {
    return await this.repo.createListing(dto);
  }

  async getAgencyPartners(): Promise<AgencyPartnerEntity[]> {
    return await this.repo.findAgencyPartners();
  }

  async registerPartner(dto: RegisterAgencyPartnerDto): Promise<AgencyPartnerEntity> {
    return await this.repo.createAgencyPartner(dto);
  }

  async requestCoBrokering(listingId: string, partnerName: string, clientName: string): Promise<{ success: boolean; message: string; contractCode: string }> {
    const listing = await this.getListingById(listingId);
    if (!listing) throw new NotFoundException('Tin đăng không tồn tại');

    const contractCode = `COBROKER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    await this.repo.updateListingCoBrokeringStatus(listingId, 'NEGOTIATING');

    return {
      success: true,
      message: `Đã gửi yêu cầu liên kết bán chéo (Co-brokering ${listing.commSplit}) tới đơn vị nắm nguồn ${listing.ownerAgency}`,
      contractCode,
    };
  }
}
