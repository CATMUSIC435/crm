import { BiMetricEntity } from '../../../domain/bi-engine';

export const BI_REPOSITORY = Symbol('BI_REPOSITORY');

export interface BiRepositoryPort {
  findMetricByKey(key: string): Promise<BiMetricEntity | null>;
  upsertMetric(key: string, category: string, title: string, value: any): Promise<BiMetricEntity>;
  getInventoryAndRevenueStats(): Promise<{
    targetRevenue: number;
    actualRevenue: number;
    totalUnits: number;
    soldUnits: number;
    activeProjectsCount: number;
  }>;
}
