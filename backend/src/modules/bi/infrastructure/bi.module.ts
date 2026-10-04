import { Module } from '@nestjs/common';
import { BiController } from './controllers/bi.controller';
import { BiService } from '../application/use-cases/bi.service';
import { BI_USE_CASE } from '../application/ports/in/bi.use-case';
import { BI_REPOSITORY } from '../application/ports/out/bi-repository.port';
import { PrismaBiRepositoryAdapter } from './adapters/prisma-bi-repository.adapter';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BiController],
  providers: [
    {
      provide: BI_USE_CASE,
      useClass: BiService,
    },
    {
      provide: BI_REPOSITORY,
      useClass: PrismaBiRepositoryAdapter,
    },
  ],
  exports: [BI_USE_CASE],
})
export class BiModule {}
