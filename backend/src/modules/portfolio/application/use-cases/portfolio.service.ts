import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  PortfolioUseCase,
  CreatePortfolioAssetDto,
  PortfolioSummaryMetrics,
  ExitSimulationResult,
} from '../ports/in/portfolio.use-case';
import { PORTFOLIO_REPOSITORY, PortfolioRepositoryPort } from '../ports/out/portfolio-repository.port';
import { PortfolioAssetEntity } from '../../domain/portfolio-asset.entity';
import { FinancialEngine } from '../../domain/financial-engine';

@Injectable()
export class PortfolioService implements PortfolioUseCase {
  constructor(
    @Inject(PORTFOLIO_REPOSITORY)
    private readonly repo: PortfolioRepositoryPort,
  ) {}

  async getAssets(customerId?: string): Promise<PortfolioAssetEntity[]> {
    return await this.repo.findAll(customerId);
  }

  async getAssetById(id: string): Promise<PortfolioAssetEntity> {
    const asset = await this.repo.findById(id);
    if (!asset) {
      throw new NotFoundException(`Không tìm thấy tài sản danh mục ID: ${id}`);
    }
    return asset;
  }

  async createAsset(dto: CreatePortfolioAssetDto): Promise<PortfolioAssetEntity> {
    const buyPrice = Number(dto.buyPrice);
    const valuation = Number(dto.currentValuation);
    const annualNet = dto.annualNetRental !== undefined ? Number(dto.annualNetRental) : Number(dto.monthlyRent) * 12 * 0.9;
    
    // Holding years
    const buyYear = new Date(dto.purchaseDate).getFullYear() || 2023;
    const currentYear = new Date().getFullYear();
    const years = Math.max(currentYear - buyYear, 1);

    const metrics = FinancialEngine.calculateAllMetrics(buyPrice, valuation, annualNet, years);

    const asset = new PortfolioAssetEntity(
      '',
      dto.code,
      dto.title,
      dto.projectName,
      dto.projectId || null,
      dto.customerId,
      dto.customerName,
      dto.customerPhone || null,
      dto.propertyType,
      Number(dto.area),
      Number(dto.bedrooms),
      Number(dto.bathrooms),
      dto.direction || null,
      dto.view || null,
      buyPrice,
      valuation,
      dto.purchaseDate,
      dto.handoverDate,
      dto.constructionProgress !== undefined ? Number(dto.constructionProgress) : 100,
      dto.constructionStatus,
      dto.rentalStatus,
      Number(dto.monthlyRent),
      dto.tenantName || null,
      dto.leaseEndDate || null,
      annualNet,
      dto.contractCode,
      dto.legalStatus,
      dto.image || null,
      dto.aiRecommendation || 'Tiếp tục giữ tích sản',
      dto.aiScore || 85,
      metrics.irr,
      metrics.cagr,
      metrics.rentalYield,
      dto.milestones || [],
    );

    return await this.repo.save(asset);
  }

  async updateValuation(id: string, newValuation: number): Promise<PortfolioAssetEntity> {
    const asset = await this.getAssetById(id);
    const valuation = Number(newValuation);
    const metrics = FinancialEngine.calculateAllMetrics(asset.buyPrice, valuation, asset.annualNetRental, asset.holdingYears);

    return await this.repo.updateValuation(id, valuation, metrics.irr, metrics.cagr, metrics.rentalYield);
  }

  async getSummaryMetrics(customerId?: string): Promise<PortfolioSummaryMetrics> {
    const assets = await this.repo.findAll(customerId);
    if (assets.length === 0) {
      return {
        totalAssetsCount: 0,
        totalInitialInvestment: 0,
        totalCurrentPortfolioValue: 0,
        totalUnrealizedCapitalGain: 0,
        totalAnnualRentalCashflow: 0,
        averageIrr: 0,
        averageCagr: 0,
        averageRentalYield: 0,
      };
    }

    let totalInitial = 0;
    let totalValuation = 0;
    let totalAnnualRental = 0;
    let sumIrr = 0;
    let sumCagr = 0;
    let sumYield = 0;

    for (const a of assets) {
      totalInitial += a.buyPrice;
      totalValuation += a.currentValuation;
      totalAnnualRental += a.annualNetRental;
      sumIrr += a.irr || 0;
      sumCagr += a.cagr || 0;
      sumYield += a.rentalYield || 0;
    }

    const count = assets.length;
    return {
      totalAssetsCount: count,
      totalInitialInvestment: totalInitial,
      totalCurrentPortfolioValue: totalValuation,
      totalUnrealizedCapitalGain: totalValuation - totalInitial,
      totalAnnualRentalCashflow: totalAnnualRental,
      averageIrr: Number((sumIrr / count).toFixed(2)),
      averageCagr: Number((sumCagr / count).toFixed(2)),
      averageRentalYield: Number((sumYield / count).toFixed(2)),
    };
  }

  async simulateExitScenario(
    assetId: string,
    additionalYears: number = 3,
    annualGrowthRatePercent: number = 9.5,
  ): Promise<ExitSimulationResult> {
    const asset = await this.getAssetById(assetId);
    const growthFraction = annualGrowthRatePercent / 100;
    
    // Future valuation compounded
    const projectedValuation = Math.round(asset.currentValuation * Math.pow(1 + growthFraction, additionalYears));
    const accumulatedRentalIncome = Math.round(asset.annualNetRental * additionalYears);
    const totalProjectedExitValue = projectedValuation + accumulatedRentalIncome;
    const totalNetRoi = Number((((totalProjectedExitValue - asset.buyPrice) / asset.buyPrice) * 100).toFixed(2));

    const totalYears = asset.holdingYears + additionalYears;
    const projectedIrr = FinancialEngine.calculateIrr(
      asset.buyPrice,
      projectedValuation,
      asset.annualNetRental,
      totalYears,
    );

    return {
      holdingYears: additionalYears,
      projectedAnnualGrowthRate: annualGrowthRatePercent,
      projectedValuation,
      accumulatedRentalIncome,
      totalProjectedExitValue,
      totalNetRoi,
      projectedIrr,
    };
  }

  async deleteAsset(id: string): Promise<boolean> {
    return await this.repo.delete(id);
  }
}
