import { Module } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from '../application/use-cases/project.service';
import { PROJECT_USE_CASE } from '../application/ports/in/project.use-case';

@Module({
  controllers: [ProjectController],
  providers: [
    {
      provide: PROJECT_USE_CASE,
      useClass: ProjectService,
    },
  ],
  exports: [PROJECT_USE_CASE],
})
export class ProjectModule {}
