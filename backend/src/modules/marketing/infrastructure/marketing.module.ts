import { Module } from '@nestjs/common';
import { MarketingController } from './controllers/marketing.controller';
import { MarketingService } from '../application/use-cases/marketing.service';
import { MARKETING_USE_CASE } from '../application/ports/in/marketing.use-case';
import { MARKETING_REPOSITORY } from '../application/ports/out/marketing-repository.port';
import { PrismaMarketingRepositoryAdapter } from './adapters/prisma-marketing-repository.adapter';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MarketingController],
  providers: [
    {
      provide: MARKETING_USE_CASE,
      useClass: MarketingService,
    },
    {
      provide: MARKETING_REPOSITORY,
      useClass: PrismaMarketingRepositoryAdapter,
    },
  ],
  exports: [MARKETING_USE_CASE],
})
export class MarketingModule {}
