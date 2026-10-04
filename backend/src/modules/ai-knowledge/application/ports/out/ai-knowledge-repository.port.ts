import { KnowledgeDocumentEntity, KnowledgeCategory } from '../../../domain/knowledge-document.entity';

export const AI_KNOWLEDGE_REPOSITORY_PORT = Symbol('AI_KNOWLEDGE_REPOSITORY_PORT');

export interface AiKnowledgeRepositoryPort {
  getAll(category?: KnowledgeCategory): Promise<KnowledgeDocumentEntity[]>;
  findById(id: string): Promise<KnowledgeDocumentEntity | null>;
  searchRelevant(query: string, limit?: number): Promise<KnowledgeDocumentEntity[]>;
  save(doc: KnowledgeDocumentEntity): Promise<void>;
}
