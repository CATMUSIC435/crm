import { Module } from '@nestjs/common';
import { PORTFOLIO_USE_CASE } from '../application/ports/in/portfolio.use-case';
import { PORTFOLIO_REPOSITORY } from '../application/ports/out/portfolio-repository.port';
import { PortfolioService } from '../application/use-cases/portfolio.service';
import { PrismaPortfolioRepositoryAdapter } from './adapters/prisma-portfolio-repository.adapter';
import { PortfolioController } from './controllers/portfolio.controller';

@Module({
  controllers: [PortfolioController],
  providers: [
    {
      provide: PORTFOLIO_USE_CASE,
      useClass: PortfolioService,
    },
    {
      provide: PORTFOLIO_REPOSITORY,
      useClass: PrismaPortfolioRepositoryAdapter,
    },
  ],
  exports: [PORTFOLIO_USE_CASE, PORTFOLIO_REPOSITORY],
})
export class PortfolioModule {}
