import { MarketplaceListingEntity, AgencyPartnerEntity } from '../../../domain/marketplace.entity';
import { CreateMarketplaceListingDto, RegisterAgencyPartnerDto } from '../in/marketplace.use-case';

export const MARKETPLACE_REPOSITORY = Symbol('MARKETPLACE_REPOSITORY');

export interface MarketplaceRepositoryPort {
  findListings(category?: string, type?: string, verifiedOnly?: boolean): Promise<MarketplaceListingEntity[]>;
  findListingById(id: string): Promise<MarketplaceListingEntity | null>;
  createListing(dto: CreateMarketplaceListingDto): Promise<MarketplaceListingEntity>;
  updateListingCoBrokeringStatus(id: string, status: string): Promise<void>;
  findAgencyPartners(): Promise<AgencyPartnerEntity[]>;
  createAgencyPartner(dto: RegisterAgencyPartnerDto): Promise<AgencyPartnerEntity>;
}
