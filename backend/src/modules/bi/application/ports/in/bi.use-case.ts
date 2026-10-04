import { ArimaForecastPoint, HeatmapCell, FunnelStage } from '../../../domain/bi-engine';

export const BI_USE_CASE = Symbol('BI_USE_CASE');

export interface MacroCorporateMetrics {
  totalGDV: number;
  totalRevenueCollected: number;
  collectionProgressPercent: number;
  projectedNextQuarterCashflow: number;
  absorptionRatePercent: number;
  grossMarginPercent: number;
  totalActiveProjects: number;
  totalUnitsSold: number;
  totalUnitsInventory: number;
}

export interface BiUseCase {
  getMacroMetrics(): Promise<MacroCorporateMetrics>;
  getArimaForecast(monthsCount?: number): Promise<ArimaForecastPoint[]>;
  getTelesaleHeatmap(): Promise<HeatmapCell[]>;
  getConversionFunnel(projectId?: string): Promise<FunnelStage[]>;
}
