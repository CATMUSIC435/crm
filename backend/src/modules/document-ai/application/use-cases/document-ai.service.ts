import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { DocumentAiUseCase, ScanDocumentDto } from '../ports/in/document-ai.use-case';
import {
  DOCUMENT_AI_REPOSITORY_PORT,
  DocumentAiRepositoryPort,
} from '../ports/out/document-ai-repository.port';
import { OcrDocumentEntity } from '../../domain/ocr-document.entity';
import { randomUUID } from 'crypto';

const PRESET_SAMPLES: Record<string, any> = {
  sample1: {
    title: 'CCCD Gắn Chip - Nguyễn Văn Tuấn (VVIP)',
    docType: 'cccd',
    categoryName: 'Căn Cước Công Dân Gắn Chip (12 số)',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80',
    fields: {
      fullName: 'NGUYỄN VĂN TUẤN',
      idNumber: '079085012345',
      dob: '15/01/1985',
      gender: 'Nam',
      nationality: 'Việt Nam',
      origin: 'Hoài Nhơn, Bình Định',
      address: 'Số 215 Điện Biên Phủ, Phường Đa Kao, Quận 1, TP.HCM',
      issueDate: '12/04/2021',
      issuePlace: 'Cục Cảnh sát QLHC về TTXH',
      expireDate: '15/01/2045',
    },
    confidences: {
      fullName: '99.8%',
      idNumber: '99.9%',
      dob: '99.5%',
      gender: '99.7%',
      address: '98.9%',
      issueDate: '99.4%',
    },
  },
  sample2: {
    title: 'CCCD Gắn Chip - Trần Thị Bích Ngọc (VIP)',
    docType: 'cccd',
    categoryName: 'Căn Cước Công Dân Gắn Chip (12 số)',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    fields: {
      fullName: 'TRẦN THỊ BÍCH NGỌC',
      idNumber: '079192009876',
      dob: '20/05/1992',
      gender: 'Nữ',
      nationality: 'Việt Nam',
      origin: 'TP. Biên Hòa, Đồng Nai',
      address: 'Biệt Thự Shophouse Aqua Marina, Long Hưng, Biên Hòa, Đồng Nai',
      issueDate: '05/08/2022',
      issuePlace: 'Cục Cảnh sát QLHC về TTXH',
      expireDate: '20/05/2032',
    },
    confidences: {
      fullName: '99.7%',
      idNumber: '99.8%',
      dob: '99.6%',
      gender: '99.9%',
      address: '99.1%',
      issueDate: '99.5%',
    },
  },
  sample3: {
    title: 'Giấy Chứng Nhận QSD Đất - NovaWorld NVW-01.01',
    docType: 'redbook',
    categoryName: 'Sổ Hồng / Giấy Chứng Nhận QSD Đất',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    fields: {
      certificateNumber: 'CS 882910',
      plotNumber: '108',
      mapSheetNumber: '25',
      area: '250.0 m²',
      landUsePurpose: 'Đất ở tại đô thị (Sở hữu lâu dài)',
      landUseTerm: 'Lâu dài',
      ownerName: 'NGUYỄN VĂN TUẤN & NGUYỄN THỊ MAI',
      address: 'Phân khu Florida 1, NovaWorld Phan Thiet, Xã Tiến Thành, Bình Thuận',
    },
    confidences: {
      certificateNumber: '99.6%',
      plotNumber: '99.8%',
      area: '99.4%',
      landUsePurpose: '99.1%',
      ownerName: '99.7%',
      address: '98.8%',
    },
  },
};

@Injectable()
export class DocumentAiService implements DocumentAiUseCase {
  constructor(
    @Inject(DOCUMENT_AI_REPOSITORY_PORT)
    private readonly repo: DocumentAiRepositoryPort,
  ) {}

  async scanDocument(dto: ScanDocumentDto): Promise<OcrDocumentEntity> {
    const preset = dto.sampleId ? PRESET_SAMPLES[dto.sampleId] : null;

    const title =
      preset?.title ||
      (dto.docType === 'cccd'
        ? 'CCCD Gắn Chip Tải Lên Mới'
        : 'Sổ Hồng QSD Đất Tải Lên Mới');
    const categoryName =
      preset?.categoryName ||
      (dto.docType === 'cccd'
        ? 'Căn Cước Công Dân Gắn Chip (12 số)'
        : 'Sổ Hồng / Giấy Chứng Nhận QSD Đất');
    const imageUrl =
      dto.imageUrl || preset?.imageUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80';

    const fields = dto.customFields || preset?.fields || {
      fullName: 'LÊ HOÀNG ANH',
      idNumber: '079090011223',
      dob: '10/10/1990',
      gender: 'Nam',
      address: '72 Lê Thánh Tôn, Bến Nghé, Quận 1, TP.HCM',
    };

    const confidences = preset?.confidences || {
      fullName: '99.5%',
      idNumber: '99.8%',
      dob: '99.2%',
      gender: '99.6%',
      address: '98.7%',
    };

    const record = new OcrDocumentEntity(
      randomUUID(),
      dto.docType,
      title,
      categoryName,
      imageUrl,
      fields,
      confidences,
      true,
      new Date(),
    );

    await this.repo.save(record);
    return record;
  }

  async getHistory(): Promise<OcrDocumentEntity[]> {
    return await this.repo.getAll();
  }

  async verifyKyc(id: string): Promise<{ success: boolean; record: OcrDocumentEntity }> {
    const record = await this.repo.findById(id);
    if (!record) {
      throw new NotFoundException(`Không tìm thấy hồ sơ OCR: ${id}`);
    }

    try {
      record.verify();
      await this.repo.save(record);
      return { success: true, record };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
