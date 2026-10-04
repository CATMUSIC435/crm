import { Module } from '@nestjs/common';
import { MarketplaceController } from './controllers/marketplace.controller';
import { MarketplaceService } from '../application/use-cases/marketplace.service';
import { MARKETPLACE_USE_CASE } from '../application/ports/in/marketplace.use-case';
import { MARKETPLACE_REPOSITORY } from '../application/ports/out/marketplace-repository.port';
import { PrismaMarketplaceRepositoryAdapter } from './adapters/prisma-marketplace-repository.adapter';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MarketplaceController],
  providers: [
    {
      provide: MARKETPLACE_USE_CASE,
      useClass: MarketplaceService,
    },
    {
      provide: MARKETPLACE_REPOSITORY,
      useClass: PrismaMarketplaceRepositoryAdapter,
    },
  ],
  exports: [MARKETPLACE_USE_CASE],
})
export class MarketplaceModule {}
