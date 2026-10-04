export interface MilestoneItem {
  id: string;
  name: string;
  dueDate: string;
  amount: number;
  percentage: number;
  isPaid: boolean;
  paidDate?: string;
  vatAmount?: number;
}

export class PortfolioAssetEntity {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly title: string,
    public readonly projectName: string,
    public readonly projectId: string | null,
    public readonly customerId: string,
    public readonly customerName: string,
    public readonly customerPhone: string | null,
    public readonly propertyType: string,
    public readonly area: number,
    public readonly bedrooms: number,
    public readonly bathrooms: number,
    public readonly direction: string | null,
    public readonly view: string | null,
    public buyPrice: number,
    public currentValuation: number,
    public readonly purchaseDate: string,
    public readonly handoverDate: string,
    public constructionProgress: number,
    public constructionStatus: string,
    public rentalStatus: string,
    public monthlyRent: number,
    public tenantName: string | null,
    public leaseEndDate: string | null,
    public annualNetRental: number,
    public readonly contractCode: string,
    public readonly legalStatus: string,
    public readonly image: string | null,
    public aiRecommendation: string | null,
    public aiScore: number = 85,
    public irr: number | null = null,
    public cagr: number | null = null,
    public rentalYield: number | null = null,
    public milestones: MilestoneItem[] = [],
  ) {}

  public get holdingYears(): number {
    const buyYear = new Date(this.purchaseDate).getFullYear() || 2023;
    const currentYear = new Date().getFullYear();
    return Math.max(currentYear - buyYear, 1);
  }

  public get capitalGain(): number {
    return this.currentValuation - this.buyPrice;
  }

  public get totalReturnPercent(): number {
    if (this.buyPrice <= 0) return 0;
    const totalEarnings = this.capitalGain + (this.annualNetRental * this.holdingYears);
    return (totalEarnings / this.buyPrice) * 100;
  }
}
