import { Module } from '@nestjs/common';
import { RESALE_USE_CASE } from '../application/ports/in/resale.use-case';
import { RESALE_REPOSITORY } from '../application/ports/out/resale-repository.port';
import { ResaleService } from '../application/use-cases/resale.service';
import { PrismaResaleRepositoryAdapter } from './adapters/prisma-resale-repository.adapter';
import { ResaleController } from './controllers/resale.controller';

@Module({
  controllers: [ResaleController],
  providers: [
    {
      provide: RESALE_USE_CASE,
      useClass: ResaleService,
    },
    {
      provide: RESALE_REPOSITORY,
      useClass: PrismaResaleRepositoryAdapter,
    },
  ],
  exports: [RESALE_USE_CASE, RESALE_REPOSITORY],
})
export class ResaleModule {}
