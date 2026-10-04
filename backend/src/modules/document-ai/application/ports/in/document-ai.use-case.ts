import { OcrDocumentEntity, DocumentType } from '../../../domain/ocr-document.entity';

export const DOCUMENT_AI_USE_CASE = Symbol('DOCUMENT_AI_USE_CASE');

export interface ScanDocumentDto {
  docType: DocumentType;
  sampleId?: string;
  imageUrl?: string;
  rawBase64?: string;
  customFields?: Record<string, string>;
}

export interface DocumentAiUseCase {
  scanDocument(dto: ScanDocumentDto): Promise<OcrDocumentEntity>;
  getHistory(): Promise<OcrDocumentEntity[]>;
  verifyKyc(id: string): Promise<{ success: boolean; record: OcrDocumentEntity }>;
}
