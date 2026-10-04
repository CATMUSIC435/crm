import { OcrDocumentEntity } from '../../../domain/ocr-document.entity';

export const DOCUMENT_AI_REPOSITORY_PORT = Symbol('DOCUMENT_AI_REPOSITORY_PORT');

export interface DocumentAiRepositoryPort {
  save(record: OcrDocumentEntity): Promise<void>;
  findById(id: string): Promise<OcrDocumentEntity | null>;
  getAll(): Promise<OcrDocumentEntity[]>;
}
