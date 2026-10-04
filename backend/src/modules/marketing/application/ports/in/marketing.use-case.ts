import { MarketingCampaignEntity } from '../../../domain/campaign.entity';

export const MARKETING_USE_CASE = Symbol('MARKETING_USE_CASE');

export interface CreateCampaignDto {
  name: string;
  platform: string;
  budget: number;
  startDate: string;
  endDate?: string;
  targetCPL?: number;
  routingRule?: string;
  assignedTeam?: string;
  projectId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface MarketingMetricsDto {
  totalBudget: number;
  totalSpent: number;
  totalLeads: number;
  totalClicks: number;
  totalConversions: number;
  averageCPL: number;
  averageConversionRate: number;
  platformDistribution: Record<string, { count: number; spent: number; leads: number }>;
}

export interface MarketingUseCase {
  getCampaigns(status?: string, platform?: string): Promise<MarketingCampaignEntity[]>;
  getCampaignById(id: string): Promise<MarketingCampaignEntity | null>;
  createCampaign(dto: CreateCampaignDto): Promise<MarketingCampaignEntity>;
  updateCampaignStatus(id: string, status: string): Promise<MarketingCampaignEntity>;
  recordLeadIngestion(id: string, leadCount?: number): Promise<MarketingCampaignEntity>;
  getMetrics(): Promise<MarketingMetricsDto>;
}
