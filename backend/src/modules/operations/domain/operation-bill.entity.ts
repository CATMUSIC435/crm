export type BillStatus = 'cho_thanh_toan' | 'da_thanh_toan' | 'qua_han';

export class OperationBillEntity {
  constructor(
    public readonly id: string,
    public readonly billCode: string,
    public readonly month: string,
    public readonly propertyCode: string,
    public readonly projectName: string,
    public readonly residentName: string,
    public readonly residentPhone: string | null,
    public readonly managementFee: number,
    public readonly parkingFee: number,
    public readonly utilitiesFee: number,
    public readonly totalAmount: number,
    public status: BillStatus,
    public readonly dueDate: string,
    public paidDate: string | null = null,
    public paymentMethod: string | null = null,
  ) {}

  public markAsPaid(method: string = 'VietQR Pro 24/7', paidDate: string = new Date().toISOString().split('T')[0]): void {
    this.status = 'da_thanh_toan';
    this.paymentMethod = method;
    this.paidDate = paidDate;
  }
}
