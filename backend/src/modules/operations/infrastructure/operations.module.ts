import { Module } from '@nestjs/common';
import { OPERATIONS_USE_CASE } from '../application/ports/in/operations.use-case';
import { OPERATIONS_REPOSITORY } from '../application/ports/out/operations-repository.port';
import { OperationsService } from '../application/use-cases/operations.service';
import { PrismaOperationsRepositoryAdapter } from './adapters/prisma-operations-repository.adapter';
import { OperationsController } from './controllers/operations.controller';

@Module({
  controllers: [OperationsController],
  providers: [
    {
      provide: OPERATIONS_USE_CASE,
      useClass: OperationsService,
    },
    {
      provide: OPERATIONS_REPOSITORY,
      useClass: PrismaOperationsRepositoryAdapter,
    },
  ],
  exports: [OPERATIONS_USE_CASE, OPERATIONS_REPOSITORY],
})
export class OperationsModule {}
