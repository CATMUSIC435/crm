import { Module } from '@nestjs/common';
import { LoyaltyController } from './controllers/loyalty.controller';
import { LoyaltyService } from '../application/use-cases/loyalty.service';
import { LOYALTY_USE_CASE } from '../application/ports/in/loyalty.use-case';
import { LOYALTY_REPOSITORY } from '../application/ports/out/loyalty-repository.port';
import { PrismaLoyaltyRepositoryAdapter } from './adapters/prisma-loyalty-repository.adapter';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LoyaltyController],
  providers: [
    {
      provide: LOYALTY_USE_CASE,
      useClass: LoyaltyService,
    },
    {
      provide: LOYALTY_REPOSITORY,
      useClass: PrismaLoyaltyRepositoryAdapter,
    },
  ],
  exports: [LOYALTY_USE_CASE],
})
export class LoyaltyModule {}
