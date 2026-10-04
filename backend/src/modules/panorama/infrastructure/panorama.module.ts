import { Module } from '@nestjs/common';
import { PanoramaController } from './controllers/panorama.controller';
import { PanoramaService } from '../application/use-cases/panorama.service';
import { PANORAMA_USE_CASE } from '../application/ports/in/panorama.use-case';
import { PANORAMA_REPOSITORY_PORT } from '../application/ports/out/panorama-repository.port';
import { PrismaPanoramaRepositoryAdapter } from './adapters/prisma-panorama-repository.adapter';

@Module({
  controllers: [PanoramaController],
  providers: [
    {
      provide: PANORAMA_USE_CASE,
      useClass: PanoramaService,
    },
    {
      provide: PANORAMA_REPOSITORY_PORT,
      useClass: PrismaPanoramaRepositoryAdapter,
    },
  ],
  exports: [PANORAMA_USE_CASE],
})
export class PanoramaModule {}
