import { ResaleListingType } from './resale-listing.entity';

export class ClientDemandEntity {
  constructor(
    public readonly id: string,
    public readonly clientName: string,
    public readonly clientPhone: string,
    public readonly demandType: ResaleListingType,
    public readonly targetProjects: string[],
    public readonly minPrice: number,
    public readonly maxPrice: number,
    public readonly bedrooms: number,
    public readonly purpose: string,
    public readonly urgency: string,
    public readonly assignedAgent: string,
    public matchingScore: number = 0,
    public suggestedListingCode: string | null = null,
  ) {}
}
