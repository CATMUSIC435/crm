export type FitoutStatus = 'cho_duyet' | 'dang_thi_cong' | 'cho_nghiem_thu' | 'da_hoan_thanh';

export class FitoutPermitEntity {
  constructor(
    public readonly id: string,
    public readonly propertyCode: string,
    public readonly residentName: string,
    public readonly contractorName: string,
    public readonly contractorPhone: string | null,
    public readonly workersCount: number,
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly depositAmount: number,
    public status: FitoutStatus,
    public depositRefunded: boolean,
    public notes: string | null = null,
  ) {}

  public updateStatus(status: FitoutStatus): void {
    this.status = status;
    if (status === 'da_hoan_thanh') {
      this.depositRefunded = true;
    }
  }

  public refundDeposit(): void {
    this.depositRefunded = true;
  }
}
