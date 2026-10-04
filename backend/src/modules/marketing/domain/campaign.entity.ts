export interface MarketingCampaignEntity {
  id: string;
  code: string;
  name: string;
  platform: 'Facebook' | 'Google' | 'TikTok' | 'Zalo' | 'Email' | string;
  status: 'Active' | 'Paused' | 'Completed' | string;
  budget: number;
  spent: number;
  leads: number;
  clicks: number;
  conversions: number;
  startDate: string;
  endDate?: string | null;
  targetCPL?: number | null;
  routingRule: 'round_robin' | 'top_seller' | 'by_project' | string;
  assignedTeam?: string | null;
  projectId?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  cpl?: number;
  roi?: number;
  conversionRate?: number;
}
