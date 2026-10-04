import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './config/redis.module';
import { AuthModule } from './modules/auth/infrastructure/auth.module';
import { ProjectModule } from './modules/projects/infrastructure/project.module';
import { InventoryModule } from './modules/inventory/infrastructure/inventory.module';
import { BookingModule } from './modules/booking/infrastructure/booking.module';
import { CustomerModule } from './modules/customers/infrastructure/customer.module';
import { ContractModule } from './modules/contracts/infrastructure/contract.module';
import { AuctionModule } from './modules/auction/infrastructure/auction.module';
import { PaymentModule } from './modules/payment/infrastructure/payment.module';
import { GisModule } from './modules/gis/infrastructure/gis.module';
import { PanoramaModule } from './modules/panorama/infrastructure/panorama.module';
import { DocumentAiModule } from './modules/document-ai/infrastructure/document-ai.module';
import { AiKnowledgeModule } from './modules/ai-knowledge/infrastructure/ai-knowledge.module';
import { HandoverModule } from './modules/handover/infrastructure/handover.module';
import { OperationsModule } from './modules/operations/infrastructure/operations.module';
import { ResaleModule } from './modules/resale/infrastructure/resale.module';
import { PortfolioModule } from './modules/portfolio/infrastructure/portfolio.module';
import { MarketingModule } from './modules/marketing/infrastructure/marketing.module';
import { LoyaltyModule } from './modules/loyalty/infrastructure/loyalty.module';
import { GamificationModule } from './modules/gamification/infrastructure/gamification.module';
import { MarketplaceModule } from './modules/marketplace/infrastructure/marketplace.module';
import { SurveyModule } from './modules/surveys/infrastructure/survey.module';
import { MortgageModule } from './modules/mortgage/infrastructure/mortgage.module';
import { BiModule } from './modules/bi/infrastructure/bi.module';
import { IntegrationModule } from './modules/integrations/infrastructure/integration.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    RedisModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD', '') || undefined,
          lazyConnect: true,
          maxRetriesPerRequest: null,
          retryStrategy: () => null,
          enableOfflineQueue: false,
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ProjectModule,
    InventoryModule,
    BookingModule,
    CustomerModule,
    ContractModule,
    AuctionModule,
    PaymentModule,
    GisModule,
    PanoramaModule,
    DocumentAiModule,
    AiKnowledgeModule,
    HandoverModule,
    OperationsModule,
    ResaleModule,
    PortfolioModule,
    MarketingModule,
    LoyaltyModule,
    GamificationModule,
    MarketplaceModule,
    SurveyModule,
    MortgageModule,
    BiModule,
    IntegrationModule,
    HealthModule,
  ],
})
export class AppModule {}

