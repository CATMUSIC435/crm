import { Module } from '@nestjs/common';
import { GisController } from './controllers/gis.controller';
import { GisService } from '../application/use-cases/gis.service';
import { GIS_USE_CASE } from '../application/ports/in/gis.use-case';
import { GIS_REPOSITORY_PORT } from '../application/ports/out/gis-repository.port';
import { PrismaGisRepositoryAdapter } from './adapters/prisma-gis-repository.adapter';

@Module({
  controllers: [GisController],
  providers: [
    {
      provide: GIS_USE_CASE,
      useClass: GisService,
    },
    {
      provide: GIS_REPOSITORY_PORT,
      useClass: PrismaGisRepositoryAdapter,
    },
  ],
  exports: [GIS_USE_CASE],
})
export class GisModule {}
