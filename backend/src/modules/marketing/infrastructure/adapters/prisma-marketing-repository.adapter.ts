import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { MarketingRepositoryPort } from '../../application/ports/out/marketing-repository.port';
import { MarketingCampaignEntity } from '../../domain/campaign.entity';
import { CreateCampaignDto } from '../../application/ports/in/marketing.use-case';

@Injectable()
export class PrismaMarketingRepositoryAdapter implements MarketingRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(item: any): MarketingCampaignEntity {
    const budget = Number(item.budget);
    const spent = Number(item.spent);
    const leads = item.leads || 0;
    const clicks = item.clicks || 0;
    const conversions = item.conversions || 0;
    const cpl = leads > 0 ? Math.round(spent / leads) : 0;
    const conversionRate = clicks > 0 ? Number(((conversions / clicks) * 100).toFixed(2)) : 0;

    return {
      id: item.id,
      code: item.code,
      name: item.name,
      platform: item.platform,
      status: item.status,
      budget,
      spent,
      leads,
      clicks,
      conversions,
      startDate: item.startDate,
      endDate: item.endDate,
      targetCPL: item.targetCPL ? Number(item.targetCPL) : null,
      routingRule: item.routingRule,
      assignedTeam: item.assignedTeam,
      projectId: item.projectId,
      utmSource: item.utmSource,
      utmMedium: item.utmMedium,
      utmCampaign: item.utmCampaign,
      cpl,
      conversionRate,
    };
  }

  async findAll(status?: string, platform?: string): Promise<MarketingCampaignEntity[]> {
    const where: any = {};
    if (status && status !== 'All') where.status = status;
    if (platform && platform !== 'All') where.platform = platform;

    const list = await this.prisma.marketingCampaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return list.map((item) => this.toEntity(item));
  }

  async findById(id: string): Promise<MarketingCampaignEntity | null> {
    const item = await this.prisma.marketingCampaign.findUnique({
      where: { id },
    });
    return item ? this.toEntity(item) : null;
  }

  async create(dto: CreateCampaignDto): Promise<MarketingCampaignEntity> {
    const count = await this.prisma.marketingCampaign.count();
    const code = `CMP-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const created = await this.prisma.marketingCampaign.create({
      data: {
        code,
        name: dto.name,
        platform: dto.platform,
        status: 'Active',
        budget: dto.budget,
        spent: 0,
        leads: 0,
        clicks: 0,
        conversions: 0,
        startDate: dto.startDate,
        endDate: dto.endDate,
        targetCPL: dto.targetCPL,
        routingRule: dto.routingRule || 'round_robin',
        assignedTeam: dto.assignedTeam,
        projectId: dto.projectId,
        utmSource: dto.utmSource || dto.platform.toLowerCase(),
        utmMedium: dto.utmMedium || 'cpc',
        utmCampaign: dto.utmCampaign || code.toLowerCase(),
      },
    });
    return this.toEntity(created);
  }

  async updateStatus(id: string, status: string): Promise<MarketingCampaignEntity> {
    const updated = await this.prisma.marketingCampaign.update({
      where: { id },
      data: { status },
    });
    return this.toEntity(updated);
  }

  async incrementLeads(id: string, count: number): Promise<MarketingCampaignEntity> {
    const updated = await this.prisma.marketingCampaign.update({
      where: { id },
      data: {
        leads: { increment: count },
        conversions: { increment: Math.max(1, Math.floor(count * 0.15)) },
      },
    });
    return this.toEntity(updated);
  }
}
