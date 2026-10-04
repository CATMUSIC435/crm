import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { BiRepositoryPort } from '../../application/ports/out/bi-repository.port';
import { BiMetricEntity } from '../../domain/bi-engine';

@Injectable()
export class PrismaBiRepositoryAdapter implements BiRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findMetricByKey(key: string): Promise<BiMetricEntity | null> {
    const item = await this.prisma.biMetric.findUnique({
      where: { metricKey: key },
    });
    if (!item) return null;
    return {
      id: item.id,
      metricKey: item.metricKey,
      category: item.category,
      title: item.title,
      value: item.value,
      updatedAt: item.updatedAt,
    };
  }

  async upsertMetric(key: string, category: string, title: string, value: any): Promise<BiMetricEntity> {
    const item = await this.prisma.biMetric.upsert({
      where: { metricKey: key },
      update: { category, title, value },
      create: { metricKey: key, category, title, value },
    });
    return {
      id: item.id,
      metricKey: item.metricKey,
      category: item.category,
      title: item.title,
      value: item.value,
      updatedAt: item.updatedAt,
    };
  }

  async getInventoryAndRevenueStats(): Promise<{
    targetRevenue: number;
    actualRevenue: number;
    totalUnits: number;
    soldUnits: number;
    activeProjectsCount: number;
  }> {
    const projects = await this.prisma.project.findMany();
    const inventory = await this.prisma.inventoryItem.findMany();

    const targetRevenue = projects.reduce((acc, p) => acc + Number(p.targetRevenue), 0);
    const actualRevenue = projects.reduce((acc, p) => acc + Number(p.actualRevenue), 0);
    const totalUnits = inventory.length;
    const soldUnits = inventory.filter((i) => i.status === 'SOLD').length;

    return {
      targetRevenue,
      actualRevenue,
      totalUnits,
      soldUnits,
      activeProjectsCount: projects.length,
    };
  }
}
