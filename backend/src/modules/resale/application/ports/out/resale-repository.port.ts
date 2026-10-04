import { ResaleListingEntity, ResaleListingStatus } from '../../../domain/resale-listing.entity';
import { ClientDemandEntity } from '../../../domain/client-demand.entity';

export const RESALE_REPOSITORY = 'RESALE_REPOSITORY';

export interface ResaleRepositoryPort {
  // Listings
  findAllListings(type?: string, status?: string): Promise<ResaleListingEntity[]>;
  findListingById(id: string): Promise<ResaleListingEntity | null>;
  findListingByCode(code: string): Promise<ResaleListingEntity | null>;
  saveListing(listing: ResaleListingEntity): Promise<ResaleListingEntity>;
  updateListingStatus(id: string, status: ResaleListingStatus): Promise<ResaleListingEntity>;

  // Demands
  findAllDemands(): Promise<ClientDemandEntity[]>;
  findDemandById(id: string): Promise<ClientDemandEntity | null>;
  saveDemand(demand: ClientDemandEntity): Promise<ClientDemandEntity>;
  updateDemandMatch(id: string, score: number, suggestedListingCode?: string): Promise<ClientDemandEntity>;
}
