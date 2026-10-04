import { Module } from '@nestjs/common';
import { GamificationController } from './controllers/gamification.controller';
import { GamificationService } from '../application/use-cases/gamification.service';
import { GAMIFICATION_USE_CASE } from '../application/ports/in/gamification.use-case';
import { GAMIFICATION_REPOSITORY } from '../application/ports/out/gamification-repository.port';
import { PrismaGamificationRepositoryAdapter } from './adapters/prisma-gamification-repository.adapter';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [GamificationController],
  providers: [
    {
      provide: GAMIFICATION_USE_CASE,
      useClass: GamificationService,
    },
    {
      provide: GAMIFICATION_REPOSITORY,
      useClass: PrismaGamificationRepositoryAdapter,
    },
  ],
  exports: [GAMIFICATION_USE_CASE],
})
export class GamificationModule {}
