import { Module } from '@nestjs/common';
import { AiKnowledgeController } from './controllers/ai-knowledge.controller';
import { AiKnowledgeService } from '../application/use-cases/ai-knowledge.service';
import { AI_KNOWLEDGE_USE_CASE } from '../application/ports/in/ai-knowledge.use-case';
import { AI_KNOWLEDGE_REPOSITORY_PORT } from '../application/ports/out/ai-knowledge-repository.port';
import { PrismaAiKnowledgeRepositoryAdapter } from './adapters/prisma-ai-knowledge-repository.adapter';

@Module({
  controllers: [AiKnowledgeController],
  providers: [
    {
      provide: AI_KNOWLEDGE_USE_CASE,
      useClass: AiKnowledgeService,
    },
    {
      provide: AI_KNOWLEDGE_REPOSITORY_PORT,
      useClass: PrismaAiKnowledgeRepositoryAdapter,
    },
  ],
  exports: [AI_KNOWLEDGE_USE_CASE],
})
export class AiKnowledgeModule {}
