import * as crypto from 'crypto';

export class ContractEntity {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly type: string,
    public readonly customerId: string,
    public readonly unitId: string,
    public readonly projectId: string,
    public readonly creatorId: string,
    public readonly value: number,
    public paidAmount: number = 0,
    public paymentProgress: number = 0,
    public status: 'DRAFT' | 'PENDING_SIGNATURE' | 'SIGNED_ACTIVE' | 'COMPLETED' | 'CANCELLED' = 'PENDING_SIGNATURE',
    public signatureHash?: string,
    public signedAt?: Date,
    public paymentSchedule: any[] = [],
  ) {}

  public recordPayment(amount: number): void {
    this.paidAmount += amount;
    this.paymentProgress = Math.min(100, Number(((this.paidAmount / this.value) * 100).toFixed(1)));
    if (this.paymentProgress >= 100) {
      this.status = 'COMPLETED';
    }
  }

  public signDigital(signerName: string, ipAddress: string): string {
    const rawData = `${this.code}|${this.value}|${signerName}|${ipAddress}|${Date.now()}`;
    this.signatureHash = crypto.createHash('sha256').update(rawData).digest('hex');
    this.signedAt = new Date();
    this.status = 'SIGNED_ACTIVE';
    return this.signatureHash;
  }
}
