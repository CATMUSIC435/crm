import { Module } from '@nestjs/common';
import { SurveyController } from './controllers/survey.controller';
import { SurveyService } from '../application/use-cases/survey.service';
import { SURVEY_USE_CASE } from '../application/ports/in/survey.use-case';
import { SURVEY_REPOSITORY } from '../application/ports/out/survey-repository.port';
import { PrismaSurveyRepositoryAdapter } from './adapters/prisma-survey-repository.adapter';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SurveyController],
  providers: [
    {
      provide: SURVEY_USE_CASE,
      useClass: SurveyService,
    },
    {
      provide: SURVEY_REPOSITORY,
      useClass: PrismaSurveyRepositoryAdapter,
    },
  ],
  exports: [SURVEY_USE_CASE],
})
export class SurveyModule {}
