import { PortfolioAssetEntity, MilestoneItem } from '../../../domain/portfolio-asset.entity';
import { FinancialMetrics } from '../../../domain/financial-engine';

export const PORTFOLIO_USE_CASE = 'PORTFOLIO_USE_CASE';

export interface CreatePortfolioAssetDto {
  code: string;
  title: string;
  projectName: string;
  projectId?: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  propertyType: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  direction?: string;
  view?: string;
  buyPrice: number;
  currentValuation: number;
  purchaseDate: string;
  handoverDate: string;
  constructionProgress?: number;
  constructionStatus: string;
  rentalStatus: string;
  monthlyRent: number;
  tenantName?: string;
  leaseEndDate?: string;
  annualNetRental?: number;
  contractCode: string;
  legalStatus: string;
  image?: string;
  aiRecommendation?: string;
  aiScore?: number;
  milestones?: MilestoneItem[];
}

export interface PortfolioSummaryMetrics {
  totalAssetsCount: number;
  totalInitialInvestment: number;
  totalCurrentPortfolioValue: number;
  totalUnrealizedCapitalGain: number;
  totalAnnualRentalCashflow: number;
  averageIrr: number;
  averageCagr: number;
  averageRentalYield: number;
}

export interface ExitSimulationResult {
  holdingYears: number;
  projectedAnnualGrowthRate: number;
  projectedValuation: number;
  accumulatedRentalIncome: number;
  totalProjectedExitValue: number;
  totalNetRoi: number;
  projectedIrr: number;
}

export interface PortfolioUseCase {
  getAssets(customerId?: string): Promise<PortfolioAssetEntity[]>;
  getAssetById(id: string): Promise<PortfolioAssetEntity>;
  createAsset(dto: CreatePortfolioAssetDto): Promise<PortfolioAssetEntity>;
  updateValuation(id: string, newValuation: number): Promise<PortfolioAssetEntity>;
  getSummaryMetrics(customerId?: string): Promise<PortfolioSummaryMetrics>;
  simulateExitScenario(assetId: string, additionalYears: number, annualGrowthRatePercent?: number): Promise<ExitSimulationResult>;
  deleteAsset(id: string): Promise<boolean>;
}
