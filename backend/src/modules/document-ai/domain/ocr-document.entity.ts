export type DocumentType = 'cccd' | 'redbook' | 'passport';

export interface CccdFields {
  fullName: string;
  idNumber: string;
  dob: string;
  gender: string;
  nationality: string;
  origin: string;
  address: string;
  issueDate: string;
  issuePlace: string;
  expireDate?: string;
}

export interface RedBookFields {
  certificateNumber: string; // Số phát hành sổ hồng
  plotNumber: string;        // Thửa đất số
  mapSheetNumber: string;    // Tờ bản đồ số
  area: string;              // Diện tích m2
  landUsePurpose: string;    // Mục đích sử dụng: Đất ở tại đô thị
  landUseTerm: string;       // Thời hạn sử dụng: Lâu dài
  ownerName: string;
  address: string;
}

export class OcrDocumentEntity {
  constructor(
    public readonly id: string,
    public readonly docType: DocumentType,
    public readonly title: string,
    public readonly categoryName: string,
    public readonly imageUrl: string,
    public readonly fields: Record<string, string>,
    public readonly confidences: Record<string, string>,
    public isValid: boolean,
    public verifiedAt?: Date,
    public customerId?: string,
  ) {}

  /**
   * Kiểm tra tính hợp lệ của số CCCD 12 số theo quy chuẩn Bộ Công An
   */
  public static validateCccdNumber(idNumber: string): { valid: boolean; reason?: string } {
    const clean = idNumber.replace(/\s+/g, '');
    if (!/^\d{12}$/.test(clean)) {
      return { valid: false, reason: 'Số CCCD phải bao gồm chính xác 12 chữ số' };
    }

    const provinceCode = clean.substring(0, 3);
    const genderCentury = parseInt(clean.substring(3, 4), 10);
    const birthYear = parseInt(clean.substring(4, 6), 10);

    // Kiểm tra mã thế kỷ và giới tính (0-9)
    if (isNaN(genderCentury) || genderCentury < 0 || genderCentury > 9) {
      return { valid: false, reason: 'Chữ số thứ 4 quy định thế kỷ & giới tính không hợp lệ' };
    }

    return { valid: true };
  }

  public verify(): void {
    if (this.docType === 'cccd' && this.fields['idNumber']) {
      const check = OcrDocumentEntity.validateCccdNumber(this.fields['idNumber']);
      if (!check.valid) {
        throw new Error(check.reason);
      }
    }
    this.isValid = true;
    this.verifiedAt = new Date();
  }
}
