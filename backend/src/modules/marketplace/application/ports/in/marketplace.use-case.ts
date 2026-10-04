import { MarketplaceListingEntity, AgencyPartnerEntity } from '../../../domain/marketplace.entity';

export const MARKETPLACE_USE_CASE = Symbol('MARKETPLACE_USE_CASE');

export interface CreateMarketplaceListingDto {
  title: string;
  price: number;
  commSplit?: string;
  f2Commission?: string;
  f2CommissionRate?: number;
  type?: string;
  propertyCategory?: string;
  location: string;
  district: string;
  ownerAgency: string;
  ownerAvatar?: string;
  ownerPhone?: string;
  image?: string;
  exclusive?: boolean;
}

export interface RegisterAgencyPartnerDto {
  name: string;
  tier?: string;
  phone: string;
  email?: string;
  avatar?: string;
}

export interface MarketplaceUseCase {
  getListings(category?: string, type?: string, verifiedOnly?: boolean): Promise<MarketplaceListingEntity[]>;
  getListingById(id: string): Promise<MarketplaceListingEntity | null>;
  createListing(dto: CreateMarketplaceListingDto): Promise<MarketplaceListingEntity>;
  getAgencyPartners(): Promise<AgencyPartnerEntity[]>;
  registerPartner(dto: RegisterAgencyPartnerDto): Promise<AgencyPartnerEntity>;
  requestCoBrokering(listingId: string, partnerName: string, clientName: string): Promise<{ success: boolean; message: string; contractCode: string }>;
}
