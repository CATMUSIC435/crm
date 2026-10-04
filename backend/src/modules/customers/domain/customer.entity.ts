export type CustomerRankType = 'DIAMOND_VVIP' | 'PLATINUM_VIP' | 'POTENTIAL' | 'NEW';

export class CustomerEntity {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly fullName: string,
    public readonly phone: string,
    public readonly email?: string,
    public readonly idCardNumber?: string,
    public rank: CustomerRankType = 'NEW',
    public totalRevenue: number = 0,
    public aiHealthScore: number = 50,
    public readonly assignedToId: string = '',
    public status: string = 'Đang tư vấn',
  ) {}

  public addRevenue(amount: number): void {
    this.totalRevenue += amount;
    if (this.totalRevenue >= 20_000_000_000) {
      this.rank = 'DIAMOND_VVIP';
    } else if (this.totalRevenue >= 5_000_000_000) {
      this.rank = 'PLATINUM_VIP';
    } else if (this.totalRevenue > 0) {
      this.rank = 'POTENTIAL';
    }
  }
}
