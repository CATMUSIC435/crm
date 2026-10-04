import { KnowledgeDocumentEntity, KnowledgeCategory } from '../../../domain/knowledge-document.entity';

export const AI_KNOWLEDGE_USE_CASE = Symbol('AI_KNOWLEDGE_USE_CASE');

export interface AskQuestionDto {
  question: string;
  projectId?: string;
}

export interface RAGAnswerResponse {
  answer: string;
  confidence: number;
  sources: Array<{
    title: string;
    category: string;
    excerpt: string;
  }>;
  suggestedQuestions: string[];
}

export interface AiKnowledgeUseCase {
  ask(dto: AskQuestionDto): Promise<RAGAnswerResponse>;
  getDocuments(category?: KnowledgeCategory): Promise<KnowledgeDocumentEntity[]>;
  createDocument(doc: {
    title: string;
    category: KnowledgeCategory;
    fileSize?: string;
    projectId?: string;
    contentSummary: string;
    contentRaw: string;
  }): Promise<KnowledgeDocumentEntity>;
}
