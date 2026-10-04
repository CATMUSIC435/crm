import { PortfolioAssetEntity } from '../../../domain/portfolio-asset.entity';

export const PORTFOLIO_REPOSITORY = 'PORTFOLIO_REPOSITORY';

export interface PortfolioRepositoryPort {
  findAll(customerId?: string): Promise<PortfolioAssetEntity[]>;
  findById(id: string): Promise<PortfolioAssetEntity | null>;
  findByCode(code: string): Promise<PortfolioAssetEntity | null>;
  save(asset: PortfolioAssetEntity): Promise<PortfolioAssetEntity>;
  updateValuation(id: string, valuation: number, irr?: number, cagr?: number, rentalYield?: number): Promise<PortfolioAssetEntity>;
  delete(id: string): Promise<boolean>;
}
