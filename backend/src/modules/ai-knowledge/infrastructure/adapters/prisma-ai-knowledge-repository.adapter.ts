import { Injectable } from '@nestjs/common';
import { AiKnowledgeRepositoryPort } from '../../application/ports/out/ai-knowledge-repository.port';
import {
  KnowledgeDocumentEntity,
  KnowledgeCategory,
} from '../../domain/knowledge-document.entity';
import { PrismaService } from '../../../../database/prisma.service';

const INITIAL_KNOWLEDGE_DOCS = [
  new KnowledgeDocumentEntity(
    'doc-1',
    'Chính Sách Bán Hàng NovaWorld Phan Thiet 2026',
    'policy',
    '4.2 MB',
    'p1',
    'Quy định tiến độ thanh toán chuẩn 24 tháng, chiết khấu thanh toán sớm 12%, hỗ trợ lãi suất 0% trong 24 tháng.',
    'Dự án NovaWorld Phan Thiet áp dụng chính sách bán hàng linh hoạt với 3 phương án thanh toán: Chuẩn, Nhanh và Vay ngân hàng ưu đãi. Ngân hàng MBBank giải ngân song song.',
  ),
  new KnowledgeDocumentEntity(
    'doc-2',
    'Brochure Tổng Quan Aqua City Đồng Nai',
    'brochure',
    '18.5 MB',
    'p2',
    'Quy mô 1.000 ha, 32km đường sông bao bọc, các phân khu Phoenix South, The Suite, The Grand Villas.',
    'Đô thị sinh thái thông minh Aqua City tọa lạc tại phía Đông TP.HCM, kết nối cao tốc TP.HCM - Long Thành qua trục Hương Lộ 2 rộng 60m.',
  ),
  new KnowledgeDocumentEntity(
    'doc-3',
    'Luật Đất Đai 2024 & Quy Định Cấp Sổ Hồng',
    'law',
    '2.8 MB',
    null,
    'Các điểm mới của Luật Đất Đai sửa đổi liên quan đến bảng giá đất thị trường, điều kiện chuyển nhượng HĐMB căn hộ và bảo vệ quyền lợi người mua.',
    'Luật Đất Đai 2024 có hiệu lực bỏ khung giá đất, định giá đất theo nguyên tắc thị trường và đẩy nhanh tiến độ cấp giấy chứng nhận QSD đất.',
  ),
  new KnowledgeDocumentEntity(
    'doc-4',
    'Quy Trình Khóa Căn & Đặt Cọc SLA 15 Phút',
    'faq',
    '1.2 MB',
    null,
    'Hướng dẫn 4 bước: Khởi tạo phiếu booking, phê duyệt trực tuyến cấp Quản lý, Giám đốc và kế toán xác nhận qua VietQR IPN.',
    'Thời hạn giữ chỗ tối đa 15 phút. Nếu quá thời hạn mà chưa hoàn tất chuyển tiền cọc tối thiểu 50 triệu đồng, căn hộ sẽ tự động mở khóa về rổ hàng.',
  ),
  new KnowledgeDocumentEntity(
    'doc-5',
    'Hồ Sơ Quy Hoạch Chi Tiết 1/500 The Grand Manhattan',
    'planning',
    '12.4 MB',
    'p3',
    'Quyết định 4125/QĐ-UBND phê duyệt tổ hợp tháp đôi 39 tầng, mật độ 49.7%, hệ số sử dụng đất 8.5.',
    'Dự án The Grand Manhattan tại 17 Cô Bắc - Cô Giang, Quận 1, TP.HCM đã hoàn tất pháp lý xây dựng và đủ điều kiện huy động vốn.',
  ),
];

@Injectable()
export class PrismaAiKnowledgeRepositoryAdapter implements AiKnowledgeRepositoryPort {
  private inMemoryStore: KnowledgeDocumentEntity[] = [...INITIAL_KNOWLEDGE_DOCS];

  constructor(private readonly prisma: PrismaService) {}

  async getAll(category?: KnowledgeCategory): Promise<KnowledgeDocumentEntity[]> {
    if (this.prisma.isConnected) {
      try {
        const records = await this.prisma.knowledgeDocument.findMany({
          where: category ? { category } : undefined,
          orderBy: { createdAt: 'desc' },
        });
        if (records.length > 0) {
          return records.map(
            (r) =>
              new KnowledgeDocumentEntity(
                r.id,
                r.title,
                r.category as any,
                r.fileSize || '2.0 MB',
                r.projectId,
                r.contentSummary,
                r.contentRaw,
              ),
          );
        }
      } catch {
        // Fallback
      }
    }

    return category
      ? this.inMemoryStore.filter((d) => d.category === category)
      : this.inMemoryStore;
  }

  async findById(id: string): Promise<KnowledgeDocumentEntity | null> {
    if (this.prisma.isConnected) {
      try {
        const r = await this.prisma.knowledgeDocument.findUnique({ where: { id } });
        if (r) {
          return new KnowledgeDocumentEntity(
            r.id,
            r.title,
            r.category as any,
            r.fileSize || '2.0 MB',
            r.projectId,
            r.contentSummary,
            r.contentRaw,
          );
        }
      } catch {
        // Fallback
      }
    }
    return this.inMemoryStore.find((d) => d.id === id) || null;
  }

  async searchRelevant(query: string, limit: number = 3): Promise<KnowledgeDocumentEntity[]> {
    const all = await this.getAll();
    const scored = all.map((doc) => ({
      doc,
      score: doc.calculateRelevanceScore(query),
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.doc);
  }

  async save(doc: KnowledgeDocumentEntity): Promise<void> {
    if (this.prisma.isConnected) {
      try {
        await this.prisma.knowledgeDocument.upsert({
          where: { id: doc.id },
          create: {
            id: doc.id,
            title: doc.title,
            category: doc.category,
            fileSize: doc.fileSize,
            projectId: doc.projectId,
            contentSummary: doc.contentSummary,
            contentRaw: doc.contentRaw,
          },
          update: {
            title: doc.title,
            category: doc.category,
            contentSummary: doc.contentSummary,
            contentRaw: doc.contentRaw,
          },
        });
        return;
      } catch {
        // Fallback
      }
    }

    const idx = this.inMemoryStore.findIndex((d) => d.id === doc.id);
    if (idx >= 0) {
      this.inMemoryStore[idx] = doc;
    } else {
      this.inMemoryStore.unshift(doc);
    }
  }
}
