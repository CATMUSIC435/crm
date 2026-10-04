import { Module } from '@nestjs/common';
import { IntegrationController } from './controllers/integration.controller';
import { IntegrationService } from '../application/use-cases/integration.service';
import { INTEGRATION_USE_CASE } from '../application/ports/in/integration.use-case';
import { INTEGRATION_REPOSITORY } from '../application/ports/out/integration-repository.port';
import { PrismaIntegrationRepositoryAdapter } from './adapters/prisma-integration-repository.adapter';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [IntegrationController],
  providers: [
    {
      provide: INTEGRATION_USE_CASE,
      useClass: IntegrationService,
    },
    {
      provide: INTEGRATION_REPOSITORY,
      useClass: PrismaIntegrationRepositoryAdapter,
    },
  ],
  exports: [INTEGRATION_USE_CASE],
})
export class IntegrationModule {}
