export type ResaleListingType = 'resale' | 'rental';
export type ResaleListingStatus = 'active' | 'under_offer' | 'closed' | 'expired';

export class ResaleListingEntity {
  constructor(
    public readonly id: string,
    public readonly listingCode: string,
    public readonly type: ResaleListingType,
    public readonly projectName: string,
    public readonly propertyCode: string,
    public readonly propertyType: string,
    public readonly ownerName: string,
    public readonly ownerPhone: string,
    public readonly area: number,
    public readonly bedrooms: number,
    public readonly bathrooms: number,
    public readonly direction: string | null,
    public askingPrice: number,
    public targetNetPrice: number | null,
    public commissionRate: number,
    public commissionAmount: number,
    public legalStatus: string | null,
    public furnishedStatus: string | null,
    public keyStatus: string | null,
    public status: ResaleListingStatus,
    public exclusiveContract: boolean,
    public exclusiveEndDate: string | null,
    public viewCount: number,
    public showingCount: number,
    public matchedLeadsCount: number,
    public imageUrl: string | null,
    public coBrokerSplitRatio: number = 50.0,
  ) {}

  public calculateCoBrokerSplit(totalCommission?: number): { listingSide: number; sellingSide: number } {
    const comm = totalCommission !== undefined ? totalCommission : this.commissionAmount;
    const splitFraction = this.coBrokerSplitRatio / 100.0;
    const sellingSide = Math.round(comm * splitFraction);
    const listingSide = comm - sellingSide;
    return { listingSide, sellingSide };
  }

  public markAsClosed(): void {
    this.status = 'closed';
  }
}
