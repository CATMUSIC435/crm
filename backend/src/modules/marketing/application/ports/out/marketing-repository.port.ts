import { MarketingCampaignEntity } from '../../../domain/campaign.entity';
import { CreateCampaignDto } from '../in/marketing.use-case';

export const MARKETING_REPOSITORY = Symbol('MARKETING_REPOSITORY');

export interface MarketingRepositoryPort {
  findAll(status?: string, platform?: string): Promise<MarketingCampaignEntity[]>;
  findById(id: string): Promise<MarketingCampaignEntity | null>;
  create(dto: CreateCampaignDto): Promise<MarketingCampaignEntity>;
  updateStatus(id: string, status: string): Promise<MarketingCampaignEntity>;
  incrementLeads(id: string, count: number): Promise<MarketingCampaignEntity>;
}
