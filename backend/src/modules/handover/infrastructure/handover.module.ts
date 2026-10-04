import { Module } from '@nestjs/common';
import { HANDOVER_USE_CASE } from '../application/ports/in/handover.use-case';
import { HANDOVER_REPOSITORY } from '../application/ports/out/handover-repository.port';
import { HandoverService } from '../application/use-cases/handover.service';
import { PrismaHandoverRepositoryAdapter } from './adapters/prisma-handover-repository.adapter';
import { HandoverController } from './controllers/handover.controller';

@Module({
  controllers: [HandoverController],
  providers: [
    {
      provide: HANDOVER_USE_CASE,
      useClass: HandoverService,
    },
    {
      provide: HANDOVER_REPOSITORY,
      useClass: PrismaHandoverRepositoryAdapter,
    },
  ],
  exports: [HANDOVER_USE_CASE, HANDOVER_REPOSITORY],
})
export class HandoverModule {}
