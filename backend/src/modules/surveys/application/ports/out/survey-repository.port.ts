import { SurveyCampaignEntity, SurveyFeedbackEntity } from '../../../domain/survey.entity';
import { CreateSurveyCampaignDto, SubmitSurveyFeedbackDto } from '../in/survey.use-case';

export const SURVEY_REPOSITORY = Symbol('SURVEY_REPOSITORY');

export interface SurveyRepositoryPort {
  findCampaigns(): Promise<SurveyCampaignEntity[]>;
  createCampaign(dto: CreateSurveyCampaignDto): Promise<SurveyCampaignEntity>;
  createFeedback(dto: SubmitSurveyFeedbackDto, sentiment: string): Promise<SurveyFeedbackEntity>;
  incrementCampaignResponses(campaignId: string): Promise<void>;
  findFeedbacks(category?: string, sentiment?: string): Promise<SurveyFeedbackEntity[]>;
}
