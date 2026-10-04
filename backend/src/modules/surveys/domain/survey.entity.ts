export interface SurveyCampaignEntity {
  id: string;
  code: string;
  name: string;
  trigger: string;
  responsesCount: number;
  conversion: string;
  status: 'active' | 'paused' | string;
  channel: string;
  targetAudience: string;
  rewardPoints: number;
  csatScore: number;
  npsScore: number;
  formUrl?: string | null;
}

export interface SurveyFeedbackEntity {
  id: string;
  campaignId?: string | null;
  customerName: string;
  customerPhone?: string | null;
  propertyCode?: string | null;
  projectName?: string | null;
  rating: number;
  category: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | string;
  comment: string;
  resolutionStatus: string;
  assignedStaff?: string | null;
  createdAt: Date;
}
