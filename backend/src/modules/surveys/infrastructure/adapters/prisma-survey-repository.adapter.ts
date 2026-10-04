import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { SurveyRepositoryPort } from '../../application/ports/out/survey-repository.port';
import { SurveyCampaignEntity, SurveyFeedbackEntity } from '../../domain/survey.entity';
import { CreateSurveyCampaignDto, SubmitSurveyFeedbackDto } from '../../application/ports/in/survey.use-case';

@Injectable()
export class PrismaSurveyRepositoryAdapter implements SurveyRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toCampaignEntity(item: any): SurveyCampaignEntity {
    return {
      id: item.id,
      code: item.code,
      name: item.name,
      trigger: item.trigger,
      responsesCount: item.responsesCount,
      conversion: item.conversion,
      status: item.status,
      channel: item.channel,
      targetAudience: item.targetAudience,
      rewardPoints: item.rewardPoints,
      csatScore: item.csatScore,
      npsScore: item.npsScore,
      formUrl: item.formUrl,
    };
  }

  private toFeedbackEntity(item: any): SurveyFeedbackEntity {
    return {
      id: item.id,
      campaignId: item.campaignId,
      customerName: item.customerName,
      customerPhone: item.customerPhone,
      propertyCode: item.propertyCode,
      projectName: item.projectName,
      rating: item.rating,
      category: item.category,
      sentiment: item.sentiment,
      comment: item.comment,
      resolutionStatus: item.resolutionStatus,
      assignedStaff: item.assignedStaff,
      createdAt: item.createdAt,
    };
  }

  async findCampaigns(): Promise<SurveyCampaignEntity[]> {
    const list = await this.prisma.surveyCampaign.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return list.map((c) => this.toCampaignEntity(c));
  }

  async createCampaign(dto: CreateSurveyCampaignDto): Promise<SurveyCampaignEntity> {
    const count = await this.prisma.surveyCampaign.count();
    const code = `SVY-${String(count + 1).padStart(3, '0')}`;

    const created = await this.prisma.surveyCampaign.create({
      data: {
        code,
        name: dto.name,
        trigger: dto.trigger,
        responsesCount: 0,
        conversion: '0%',
        status: 'active',
        channel: dto.channel || 'Zalo ZNS',
        targetAudience: dto.targetAudience || 'Khách hàng quan tâm dự án',
        rewardPoints: dto.rewardPoints || 200,
        csatScore: 5.0,
        npsScore: 80,
        formUrl: dto.formUrl,
      },
    });
    return this.toCampaignEntity(created);
  }

  async createFeedback(dto: SubmitSurveyFeedbackDto, sentiment: string): Promise<SurveyFeedbackEntity> {
    const created = await this.prisma.surveyFeedback.create({
      data: {
        campaignId: dto.campaignId,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        propertyCode: dto.propertyCode,
        projectName: dto.projectName,
        rating: dto.rating,
        category: dto.category,
        sentiment,
        comment: dto.comment,
        resolutionStatus: 'RESOLVED',
        assignedStaff: 'Bộ phận CSKH & Trải nghiệm cư dân',
      },
    });
    return this.toFeedbackEntity(created);
  }

  async incrementCampaignResponses(campaignId: string): Promise<void> {
    await this.prisma.surveyCampaign.update({
      where: { id: campaignId },
      data: { responsesCount: { increment: 1 } },
    });
  }

  async findFeedbacks(category?: string, sentiment?: string): Promise<SurveyFeedbackEntity[]> {
    const where: any = {};
    if (category && category !== 'Tất cả') where.category = category;
    if (sentiment && sentiment !== 'Tất cả') where.sentiment = sentiment;

    const list = await this.prisma.surveyFeedback.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return list.map((f) => this.toFeedbackEntity(f));
  }
}
