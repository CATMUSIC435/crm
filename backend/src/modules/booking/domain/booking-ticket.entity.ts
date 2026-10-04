export type BookingStageType =
  | 'INIT_SALE'
  | 'MANAGER_APPROVED'
  | 'DIRECTOR_APPROVED'
  | 'ACCOUNTANT_CONFIRMED'
  | 'DONE_LOCKED'
  | 'REJECTED';

export interface ApprovalHistoryEntry {
  step: string;
  actor: string;
  action: 'created' | 'approved' | 'rejected' | 'extended';
  timestamp: string;
  comment?: string;
}

export class BookingTicketEntity {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly unitId: string,
    public readonly customerId: string,
    public readonly projectId: string,
    public readonly agentId: string,
    public readonly depositAmount: number,
    public readonly bookingType: string,
    public stage: BookingStageType,
    public priority: string,
    public expiresAt: Date,
    public paymentProofUrl?: string,
    public bankRef?: string,
    public approvalHistory: ApprovalHistoryEntry[] = [],
  ) {}

  public isExpired(): boolean {
    return new Date() > this.expiresAt && this.stage !== 'DONE_LOCKED';
  }

  public approveBy(actorRole: string, actorName: string, comment?: string): void {
    if (this.isExpired()) {
      throw new Error('Hồ sơ booking đã quá hạn SLA 15 phút, không thể phê duyệt');
    }

    let nextStage: BookingStageType = this.stage;
    let stepName = '';

    if (this.stage === 'INIT_SALE') {
      if (actorRole !== 'TEAM_LEADER' && actorRole !== 'DIRECTOR' && actorRole !== 'SUPER_ADMIN') {
        throw new Error('Chỉ Trưởng phòng kinh doanh mới có quyền duyệt bước 1');
      }
      nextStage = 'MANAGER_APPROVED';
      stepName = 'Trưởng Phòng Kinh Doanh Duyệt';
    } else if (this.stage === 'MANAGER_APPROVED') {
      if (actorRole !== 'DIRECTOR' && actorRole !== 'SUPER_ADMIN') {
        throw new Error('Chỉ Giám đốc khối kinh doanh mới có quyền duyệt bước 2');
      }
      nextStage = 'DIRECTOR_APPROVED';
      stepName = 'Giám Đốc Khối Duyệt';
    } else if (this.stage === 'DIRECTOR_APPROVED') {
      if (actorRole !== 'ACCOUNTANT' && actorRole !== 'SUPER_ADMIN') {
        throw new Error('Chỉ Kế toán đối soát tiền cọc mới có quyền xác nhận khóa căn');
      }
      nextStage = 'DONE_LOCKED';
      stepName = 'Kế Toán Xác Nhận Tiền & Khóa Căn';
    } else {
      throw new Error(`Không thể phê duyệt từ trạng thái hiện tại: ${this.stage}`);
    }

    this.stage = nextStage;
    this.approvalHistory.push({
      step: stepName,
      actor: actorName,
      action: 'approved',
      timestamp: new Date().toISOString(),
      comment,
    });
  }

  public reject(actorName: string, reason: string): void {
    this.stage = 'REJECTED';
    this.approvalHistory.push({
      step: 'Từ Chối Hồ Sơ',
      actor: actorName,
      action: 'rejected',
      timestamp: new Date().toISOString(),
      comment: reason,
    });
  }

  public extendSLA(minutes: number, actorName: string, reason?: string): void {
    this.expiresAt = new Date(this.expiresAt.getTime() + minutes * 60 * 1000);
    this.approvalHistory.push({
      step: `Gia Hạn Thêm ${minutes} Phút`,
      actor: actorName,
      action: 'extended',
      timestamp: new Date().toISOString(),
      comment: reason || 'Gia hạn theo yêu cầu bổ sung chứng từ',
    });
  }
}
