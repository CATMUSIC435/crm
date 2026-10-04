import { SurveyCampaignEntity, SurveyFeedbackEntity } from '../../../domain/survey.entity';

export const SURVEY_USE_CASE = Symbol('SURVEY_USE_CASE');

export interface CreateSurveyCampaignDto {
  name: string;
  trigger: string;
  channel?: string;
  targetAudience?: string;
  rewardPoints?: number;
  formUrl?: string;
}

export interface SubmitSurveyFeedbackDto {
  campaignId?: string;
  customerName: string;
  customerPhone?: string;
  propertyCode?: string;
  projectName?: string;
  rating: number;
  category: string;
  comment: string;
}

export interface SurveyMetricsDto {
  averageCSAT: number;
  averageNPS: number;
  totalResponses: number;
  positiveRatio: number;
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
  categoryRatings: Record<string, number>;
}

export interface SurveyUseCase {
  getCampaigns(): Promise<SurveyCampaignEntity[]>;
  createCampaign(dto: CreateSurveyCampaignDto): Promise<SurveyCampaignEntity>;
  submitFeedback(dto: SubmitSurveyFeedbackDto): Promise<SurveyFeedbackEntity>;
  getFeedbacks(category?: string, sentiment?: string): Promise<SurveyFeedbackEntity[]>;
  getMetrics(): Promise<SurveyMetricsDto>;
}
