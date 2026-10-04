import { Module } from '@nestjs/common';
import { DocumentAiController } from './controllers/document-ai.controller';
import { DocumentAiService } from '../application/use-cases/document-ai.service';
import { DOCUMENT_AI_USE_CASE } from '../application/ports/in/document-ai.use-case';
import { DOCUMENT_AI_REPOSITORY_PORT } from '../application/ports/out/document-ai-repository.port';
import { PrismaDocumentAiRepositoryAdapter } from './adapters/prisma-document-ai-repository.adapter';

@Module({
  controllers: [DocumentAiController],
  providers: [
    {
      provide: DOCUMENT_AI_USE_CASE,
      useClass: DocumentAiService,
    },
    {
      provide: DOCUMENT_AI_REPOSITORY_PORT,
      useClass: PrismaDocumentAiRepositoryAdapter,
    },
  ],
  exports: [DOCUMENT_AI_USE_CASE],
})
export class DocumentAiModule {}
