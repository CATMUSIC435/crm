import { ResaleListingEntity, ResaleListingType, ResaleListingStatus } from '../../../domain/resale-listing.entity';
import { ClientDemandEntity } from '../../../domain/client-demand.entity';
import { MatchResult } from '../../../domain/matchmaking-engine';

export const RESALE_USE_CASE = 'RESALE_USE_CASE';

export interface CreateResaleListingDto {
  listingCode: string;
  type: ResaleListingType;
  projectName: string;
  propertyCode: string;
  propertyType: string;
  ownerName: string;
  ownerPhone: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  direction?: string;
  askingPrice: number;
  targetNetPrice?: number;
  commissionRate?: number;
  legalStatus?: string;
  furnishedStatus?: string;
  keyStatus?: string;
  exclusiveContract?: boolean;
  exclusiveEndDate?: string;
  imageUrl?: string;
  coBrokerSplitRatio?: number;
}

export interface CreateClientDemandDto {
  clientName: string;
  clientPhone: string;
  demandType: ResaleListingType;
  targetProjects: string[];
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  purpose: string;
  urgency: string;
  assignedAgent: string;
}

export interface CloseDealDto {
  listingId: string;
  dealType: ResaleListingType;
  finalPrice: number;
  depositAmount: number;
  sellerName: string;
  buyerName: string;
  buyerPhone: string;
  commissionAgent: number;
  commissionCompany: number;
}

export interface ResaleUseCase {
  getListings(type?: string, status?: string): Promise<ResaleListingEntity[]>;
  getListingById(id: string): Promise<ResaleListingEntity>;
  createListing(dto: CreateResaleListingDto): Promise<ResaleListingEntity>;
  updateListingStatus(id: string, status: ResaleListingStatus): Promise<ResaleListingEntity>;

  getDemands(): Promise<ClientDemandEntity[]>;
  createDemand(dto: CreateClientDemandDto): Promise<ClientDemandEntity>;
  matchDemandAi(demandId: string): Promise<MatchResult[]>;
  calculateCoBroker(listingId: string, customAmount?: number): Promise<{ listingSide: number; sellingSide: number; total: number; ratio: string }>;
  closeDeal(dto: CloseDealDto): Promise<any>;
}
