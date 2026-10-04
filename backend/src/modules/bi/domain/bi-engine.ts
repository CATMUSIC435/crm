export interface BiMetricEntity {
  id: string;
  metricKey: string;
  category: string;
  title: string;
  value: any;
  updatedAt: Date;
}

export interface ArimaForecastPoint {
  month: string; // "Tháng 8/2026"
  actualRevenue?: number;
  predictedRevenue: number;
  upperBound: number;
  lowerBound: number;
  confidence: number;
}

export interface HeatmapCell {
  dayOfWeek: string; // "Thứ 2" .. "Chủ Nhật"
  hourSlot: string; // "08:00 - 09:30", "09:30 - 11:30"...
  callsCount: number;
  connectedRate: number; // %
  bookingConversionRate: number; // %
  intensity: 'low' | 'medium' | 'high' | 'peak';
}

export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  dropOffRate: number;
  revenuePotential: number;
}
