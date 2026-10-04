import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { PortfolioRepositoryPort } from '../../application/ports/out/portfolio-repository.port';
import { PortfolioAssetEntity, MilestoneItem } from '../../domain/portfolio-asset.entity';

@Injectable()
export class PrismaPortfolioRepositoryAdapter implements PortfolioRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(p: any): PortfolioAssetEntity {
    return new PortfolioAssetEntity(
      p.id,
      p.code,
      p.title,
      p.projectName,
      p.projectId,
      p.customerId,
      p.customerName,
      p.customerPhone,
      p.propertyType,
      Number(p.area),
      p.bedrooms,
      p.bathrooms,
      p.direction,
      p.view,
      Number(p.buyPrice),
      Number(p.currentValuation),
      p.purchaseDate,
      p.handoverDate,
      p.constructionProgress,
      p.constructionStatus,
      p.rentalStatus,
      Number(p.monthlyRent),
      p.tenantName,
      p.leaseEndDate,
      Number(p.annualNetRental),
      p.contractCode,
      p.legalStatus,
      p.image,
      p.aiRecommendation,
      p.aiScore,
      p.irr ? Number(p.irr) : null,
      p.cagr ? Number(p.cagr) : null,
      p.rentalYield ? Number(p.rentalYield) : null,
      Array.isArray(p.milestones) ? (p.milestones as MilestoneItem[]) : [],
    );
  }

  async findAll(customerId?: string): Promise<PortfolioAssetEntity[]> {
    const where = customerId && customerId !== 'all' ? { customerId } : {};
    const records = await this.prisma.portfolioAsset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return records.map(r => this.mapToEntity(r));
  }

  async findById(id: string): Promise<PortfolioAssetEntity | null> {
    const r = await this.prisma.portfolioAsset.findUnique({ where: { id } });
    return r ? this.mapToEntity(r) : null;
  }

  async findByCode(code: string): Promise<PortfolioAssetEntity | null> {
    const r = await this.prisma.portfolioAsset.findUnique({ where: { code } });
    return r ? this.mapToEntity(r) : null;
  }

  async save(asset: PortfolioAssetEntity): Promise<PortfolioAssetEntity> {
    const r = await this.prisma.portfolioAsset.create({
      data: {
        code: asset.code,
        title: asset.title,
        projectName: asset.projectName,
        projectId: asset.projectId,
        customerId: asset.customerId,
        customerName: asset.customerName,
        customerPhone: asset.customerPhone,
        propertyType: asset.propertyType,
        area: asset.area,
        bedrooms: asset.bedrooms,
        bathrooms: asset.bathrooms,
        direction: asset.direction,
        view: asset.view,
        buyPrice: asset.buyPrice,
        currentValuation: asset.currentValuation,
        purchaseDate: asset.purchaseDate,
        handoverDate: asset.handoverDate,
        constructionProgress: asset.constructionProgress,
        constructionStatus: asset.constructionStatus,
        rentalStatus: asset.rentalStatus,
        monthlyRent: asset.monthlyRent,
        tenantName: asset.tenantName,
        leaseEndDate: asset.leaseEndDate,
        annualNetRental: asset.annualNetRental,
        contractCode: asset.contractCode,
        legalStatus: asset.legalStatus,
        image: asset.image,
        aiRecommendation: asset.aiRecommendation,
        aiScore: asset.aiScore,
        irr: asset.irr,
        cagr: asset.cagr,
        rentalYield: asset.rentalYield,
        milestones: asset.milestones as any,
      },
    });
    return this.mapToEntity(r);
  }

  async updateValuation(
    id: string,
    valuation: number,
    irr?: number,
    cagr?: number,
    rentalYield?: number,
  ): Promise<PortfolioAssetEntity> {
    const r = await this.prisma.portfolioAsset.update({
      where: { id },
      data: {
        currentValuation: valuation,
        irr: irr !== undefined ? irr : undefined,
        cagr: cagr !== undefined ? cagr : undefined,
        rentalYield: rentalYield !== undefined ? rentalYield : undefined,
      },
    });
    return this.mapToEntity(r);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.portfolioAsset.delete({ where: { id } });
    return true;
  }
}
