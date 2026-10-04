import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { MarketingUseCase, CreateCampaignDto, MarketingMetricsDto } from '../ports/in/marketing.use-case';
import { MARKETING_REPOSITORY, MarketingRepositoryPort } from '../ports/out/marketing-repository.port';
import { MarketingCampaignEntity } from '../../domain/campaign.entity';

@Injectable()
export class MarketingService implements MarketingUseCase {
  constructor(
    @Inject(MARKETING_REPOSITORY)
    private readonly repo: MarketingRepositoryPort,
  ) {}

  async getCampaigns(status?: string, platform?: string): Promise<MarketingCampaignEntity[]> {
    return await this.repo.findAll(status, platform);
  }

  async getCampaignById(id: string): Promise<MarketingCampaignEntity | null> {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundException(`Chiến dịch tiếp thị ${id} không tồn tại`);
    return item;
  }

  async createCampaign(dto: CreateCampaignDto): Promise<MarketingCampaignEntity> {
    return await this.repo.create(dto);
  }

  async updateCampaignStatus(id: string, status: string): Promise<MarketingCampaignEntity> {
    return await this.repo.updateStatus(id, status);
  }

  async recordLeadIngestion(id: string, leadCount: number = 1): Promise<MarketingCampaignEntity> {
    return await this.repo.incrementLeads(id, leadCount);
  }

  async getMetrics(): Promise<MarketingMetricsDto> {
    const campaigns = await this.repo.findAll();
    let totalBudget = 0;
    let totalSpent = 0;
    let totalLeads = 0;
    let totalClicks = 0;
    let totalConversions = 0;
    const platformDistribution: Record<string, { count: number; spent: number; leads: number }> = {};

    for (const c of campaigns) {
      totalBudget += c.budget;
      totalSpent += c.spent;
      totalLeads += c.leads;
      totalClicks += c.clicks;
      totalConversions += c.conversions;

      const p = c.platform || 'Other';
      if (!platformDistribution[p]) {
        platformDistribution[p] = { count: 0, spent: 0, leads: 0 };
      }
      platformDistribution[p].count += 1;
      platformDistribution[p].spent += c.spent;
      platformDistribution[p].leads += c.leads;
    }

    const averageCPL = totalLeads > 0 ? Math.round(totalSpent / totalLeads) : 0;
    const averageConversionRate = totalClicks > 0 ? Number(((totalConversions / totalClicks) * 100).toFixed(2)) : 0;

    return {
      totalBudget,
      totalSpent,
      totalLeads,
      totalClicks,
      totalConversions,
      averageCPL,
      averageConversionRate,
      platformDistribution,
    };
  }
}
