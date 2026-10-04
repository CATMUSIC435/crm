import { Injectable } from '@nestjs/common';
import { DocumentAiRepositoryPort } from '../../application/ports/out/document-ai-repository.port';
import { OcrDocumentEntity } from '../../domain/ocr-document.entity';
import { PrismaService } from '../../../../database/prisma.service';

@Injectable()
export class PrismaDocumentAiRepositoryAdapter implements DocumentAiRepositoryPort {
  private inMemoryStore: OcrDocumentEntity[] = [];

  constructor(private readonly prisma: PrismaService) {}

  async save(record: OcrDocumentEntity): Promise<void> {
    if (this.prisma.isConnected) {
      try {
        await this.prisma.ocrRecord.upsert({
          where: { id: record.id },
          create: {
            id: record.id,
            docType: record.docType,
            title: record.title,
            categoryName: record.categoryName,
            imageUrl: record.imageUrl,
            extractedFields: record.fields as any,
            confidences: record.confidences as any,
            isValid: record.isValid,
            verifiedAt: record.verifiedAt,
            customerId: record.customerId,
          },
          update: {
            extractedFields: record.fields as any,
            confidences: record.confidences as any,
            isValid: record.isValid,
            verifiedAt: record.verifiedAt,
          },
        });
        return;
      } catch {
        // Fallback to in-memory
      }
    }

    const idx = this.inMemoryStore.findIndex((r) => r.id === record.id);
    if (idx >= 0) {
      this.inMemoryStore[idx] = record;
    } else {
      this.inMemoryStore.unshift(record);
    }
  }

  async findById(id: string): Promise<OcrDocumentEntity | null> {
    if (this.prisma.isConnected) {
      try {
        const raw = await this.prisma.ocrRecord.findUnique({ where: { id } });
        if (raw) {
          return new OcrDocumentEntity(
            raw.id,
            raw.docType as any,
            raw.title,
            raw.categoryName,
            raw.imageUrl || '',
            raw.extractedFields as any,
            raw.confidences as any,
            raw.isValid,
            raw.verifiedAt || undefined,
            raw.customerId || undefined,
          );
        }
      } catch {
        // Fallback
      }
    }

    return this.inMemoryStore.find((r) => r.id === id) || null;
  }

  async getAll(): Promise<OcrDocumentEntity[]> {
    if (this.prisma.isConnected) {
      try {
        const raw = await this.prisma.ocrRecord.findMany({
          orderBy: { createdAt: 'desc' },
        });
        if (raw.length > 0) {
          return raw.map(
            (r) =>
              new OcrDocumentEntity(
                r.id,
                r.docType as any,
                r.title,
                r.categoryName,
                r.imageUrl || '',
                r.extractedFields as any,
                r.confidences as any,
                r.isValid,
                r.verifiedAt || undefined,
                r.customerId || undefined,
              ),
          );
        }
      } catch {
        // Fallback
      }
    }

    return this.inMemoryStore;
  }
}
