import { ChecklistItem } from './checklist-template';

export type HandoverStatus = 'cho_hen' | 'da_dat_lich' | 'dang_nghiem_thu' | 'da_ban_giao' | 'co_loi_can_sua';
export type DefectSeverity = 'Nhe' | 'Trung Binh' | 'Khan Cap';
export type DefectStatus = 'Dang Xu Ly' | 'Cho Nghiem Thu' | 'Da Khac Phuc';
export type PinkBookStage = 'tiep_nhan_ho_so' | 'nop_so_tnmt' | 'tham_dinh_thue' | 'da_in_phoi_so' | 'da_trao_so';

export interface SnaggingDefectEntity {
  id: string;
  ticketId: string;
  propertyCode: string;
  location: string;
  category: string;
  description: string;
  severity: DefectSeverity;
  contractor: string;
  status: DefectStatus;
  reportedDate: string;
  photoUrls?: string[];
  resolvedDate?: string;
}

export class HandoverTicketEntity {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly contractId: string | null,
    public readonly propertyCode: string,
    public readonly projectId: string | null,
    public readonly projectName: string,
    public readonly customerId: string | null,
    public readonly customerName: string,
    public readonly customerPhone: string | null,
    public readonly customerEmail: string | null,
    public readonly propertyType: string,
    public readonly area: number,
    public readonly scheduledDate: string,
    public readonly scheduledTime: string | null,
    public readonly assignedEngineer: string | null,
    public status: HandoverStatus,
    public electricMeterIndex: number | null,
    public waterMeterIndex: number | null,
    public keysHandedOverCount: number,
    public accessCardsCount: number,
    public signedDate: string | null,
    public signedByCustomer: boolean,
    public signedByStaff: boolean,
    public warrantyExpiryDate: string | null,
    public pinkBookStage: PinkBookStage,
    public pinkBookNumber: string | null,
    public defectsCount: number,
    public notes: string | null,
    public checklist: ChecklistItem[],
    public defects: SnaggingDefectEntity[] = [],
  ) {}

  public calculateDefectsCount(): number {
    return this.defects.filter(d => d.status !== 'Da Khac Phuc').length;
  }

  public signHandover(signedDate: string): void {
    this.signedByCustomer = true;
    this.signedByStaff = true;
    this.signedDate = signedDate;
    this.status = this.defects.some(d => d.status !== 'Da Khac Phuc') ? 'co_loi_can_sua' : 'da_ban_giao';
  }

  public updatePinkBookStage(stage: PinkBookStage, bookNumber?: string): void {
    this.pinkBookStage = stage;
    if (bookNumber) {
      this.pinkBookNumber = bookNumber;
    }
  }
}
