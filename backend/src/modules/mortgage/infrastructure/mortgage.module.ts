import { Module } from '@nestjs/common';
import { MortgageController } from './controllers/mortgage.controller';
import { MortgageService } from '../application/use-cases/mortgage.service';
import { MORTGAGE_USE_CASE } from '../application/ports/in/mortgage.use-case';
import { MORTGAGE_REPOSITORY } from '../application/ports/out/mortgage-repository.port';
import { PrismaMortgageRepositoryAdapter } from './adapters/prisma-mortgage-repository.adapter';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MortgageController],
  providers: [
    {
      provide: MORTGAGE_USE_CASE,
      useClass: MortgageService,
    },
    {
      provide: MORTGAGE_REPOSITORY,
      useClass: PrismaMortgageRepositoryAdapter,
    },
  ],
  exports: [MORTGAGE_USE_CASE],
})
export class MortgageModule {}
