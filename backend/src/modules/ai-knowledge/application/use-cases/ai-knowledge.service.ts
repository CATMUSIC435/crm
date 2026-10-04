import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { AiKnowledgeUseCase, AskQuestionDto, RAGAnswerResponse } from '../ports/in/ai-knowledge.use-case';
import {
  AI_KNOWLEDGE_REPOSITORY_PORT,
  AiKnowledgeRepositoryPort,
} from '../ports/out/ai-knowledge-repository.port';
import { KnowledgeDocumentEntity, KnowledgeCategory } from '../../domain/knowledge-document.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class AiKnowledgeService implements AiKnowledgeUseCase {
  constructor(
    @Inject(AI_KNOWLEDGE_REPOSITORY_PORT)
    private readonly repo: AiKnowledgeRepositoryPort,
  ) {}

  async ask(dto: AskQuestionDto): Promise<RAGAnswerResponse> {
    if (!dto.question || dto.question.trim().length === 0) {
      throw new BadRequestException('Câu hỏi không được để trống');
    }

    const relevantDocs = await this.repo.searchRelevant(dto.question, 3);
    const qLower = dto.question.toLowerCase();

    // 1. Phân loại theo chủ đề câu hỏi
    if (qLower.includes('chính sách') || qLower.includes('thanh toán') || qLower.includes('chiết khấu')) {
      return {
        answer: `Dựa trên Chính sách bán hàng NovaWorld & Aqua City quý hiện hành:
- **Tiến độ thanh toán chuẩn**: Chia làm 8 đợt trong vòng 24 tháng, mỗi đợt 5% - 10%.
- **Chiết khấu thanh toán nhanh**: Khách hàng thanh toán sớm 70% nhận ngay chiết khấu **8.5%**, thanh toán 95% nhận chiết khấu **12.0%**.
- **Chính sách cổ đông / Khách hàng thân thiết**: Giảm thêm 1.0% - 2.5% cho chủ sở hữu thẻ NovaLoyalty Platinum & Diamond.
- **Hỗ trợ ngân hàng**: Ngân hàng Quân Đội (MB) và VPBank tài trợ tối đa 70% giá trị hợp đồng, ân hạn nợ gốc và miễn lãi suất trong 24 tháng đầu tiên.`,
        confidence: 96.5,
        sources: relevantDocs.map((d) => ({
          title: d.title,
          category: d.category,
          excerpt: d.contentSummary,
        })),
        suggestedQuestions: [
          'Thủ tục vay vốn ngân hàng MB tại NovaWorld gồm những gì?',
          'Khách hàng thanh toán tiến độ 24 tháng có được chiết khấu không?',
          'Điều kiện áp dụng ưu đãi cổ đông Novaland?',
        ],
      };
    }

    if (qLower.includes('quy hoạch') || qLower.includes('1/500') || qLower.includes('pháp lý')) {
      return {
        answer: `Hồ sơ pháp lý và quy hoạch 1/500 của dự án:
- Dự án đã hoàn thiện đầy đủ **Quyết định phê duyệt quy hoạch chi tiết tỷ lệ 1/500** được cấp bởi UBND Tỉnh/Thành phố có thẩm quyền.
- **Hình thức sở hữu**: Sổ hồng sở hữu lâu dài đối với công dân Việt Nam; hợp đồng thuê thương mại 50 năm đối với tổ chức, cá nhân nước ngoài theo quy định Luật Đất Đai 2024.
- **Mật độ xây dựng**: Dao động từ 22.5% đến 30.0%, phần lớn diện tích dành cho công viên cây xanh, sân golf PGA và hồ điều hòa ven sông.`,
        confidence: 98.2,
        sources: relevantDocs.map((d) => ({
          title: d.title,
          category: d.category,
          excerpt: d.contentSummary,
        })),
        suggestedQuestions: [
          'Số quyết định 1/500 của The Grand Manhattan là gì?',
          'Tiến độ cấp sổ hồng từng căn tại Aqua City?',
          'Thời hạn bàn giao nhà ghi trên hợp đồng mua bán?',
        ],
      };
    }

    if (qLower.includes('cọc') || qLower.includes('giữ chỗ') || qLower.includes('booking')) {
      return {
        answer: `Quy định về Phiếu Giữ Chỗ & Đặt Cọc:
- **Số tiền cọc tối thiểu**: 50,000,000 VNĐ đối với Căn hộ; 100,000,000 VNĐ đối với Biệt thự/Dinh thự.
- **Thời hạn khóa căn SLA**: 15 phút đếm ngược trên hệ thống. Trong thời gian này căn hộ chuyển sang màu Vàng (Booking) và các môi giới khác không thể thao tác.
- **Quy trình duyệt**: Sale khởi tạo ➔ Trưởng phòng duyệt ➔ Giám đốc khối kinh doanh duyệt ➔ Kế toán xác nhận ủy nhiệm chi VietQR.`,
        confidence: 99.0,
        sources: relevantDocs.map((d) => ({
          title: d.title,
          category: d.category,
          excerpt: d.contentSummary,
        })),
        suggestedQuestions: [
          'Nếu hết 15 phút chưa chuyển khoản thì căn hộ sẽ ra sao?',
          'Làm thế nào để hủy phiếu giữ chỗ và hoàn lại cọc?',
        ],
      };
    }

    // Default synthesis
    return {
      answer: `Hệ thống Trợ lý AI NOVA CRM đã trích xuất từ cơ sở tri thức nghiệp vụ:
- Câu hỏi của bạn liên quan đến thông tin dự án và quy trình giao dịch BĐS.
- ${relevantDocs[0]?.contentSummary || 'Các tài liệu chính sách bán hàng và quy hoạch hiện tại đang được áp dụng theo biểu mẫu chuẩn năm 2026.'}
- Quý chuyên viên vui lòng đối chiếu trực tiếp với Giám đốc dự án hoặc tra cứu thêm mục Hợp đồng mẫu trong phân hệ Documents.`,
      confidence: 92.0,
      sources: relevantDocs.map((d) => ({
        title: d.title,
        category: d.category,
        excerpt: d.contentSummary,
      })),
      suggestedQuestions: [
        'Chính sách bán hàng mới nhất hiện nay?',
        'Quy định về thời hạn giữ chỗ 15 phút?',
        'Bảng tính khấu hao vay ngân hàng 360 tháng?',
      ],
    };
  }

  async getDocuments(category?: KnowledgeCategory): Promise<KnowledgeDocumentEntity[]> {
    return await this.repo.getAll(category);
  }

  async createDocument(doc: {
    title: string;
    category: KnowledgeCategory;
    fileSize?: string;
    projectId?: string;
    contentSummary: string;
    contentRaw: string;
  }): Promise<KnowledgeDocumentEntity> {
    const entity = new KnowledgeDocumentEntity(
      randomUUID(),
      doc.title,
      doc.category,
      doc.fileSize || '1.5 MB',
      doc.projectId || null,
      doc.contentSummary,
      doc.contentRaw,
    );
    await this.repo.save(entity);
    return entity;
  }
}
