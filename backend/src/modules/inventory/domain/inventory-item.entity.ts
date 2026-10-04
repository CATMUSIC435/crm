export type UnitStatusType = 'AVAILABLE' | 'BOOKING' | 'SOLD' | 'LOCKED';

export class InventoryItemEntity {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly projectId: string,
    public readonly type: string,
    public readonly price: number,
    public readonly area: number,
    public status: UnitStatusType,
    public readonly tower?: string,
    public readonly floor?: number,
    public readonly bedrooms: number = 1,
    public readonly bathrooms: number = 1,
    public readonly direction?: string,
    public readonly view?: string,
    public readonly handoverStandard?: string,
    public readonly discountPolicy?: string,
    public holdingAgentId?: string,
    public bookingExpiresAt?: Date,
  ) {}

  public isAvailable(): boolean {
    return this.status === 'AVAILABLE';
  }

  public lockByAgent(agentId: string, minutes: number = 15): void {
    if (!this.isAvailable()) {
      throw new Error(`Căn hộ ${this.code} hiện không ở trạng thái sẵn sàng để khóa (Trạng thái: ${this.status})`);
    }
    this.status = 'BOOKING';
    this.holdingAgentId = agentId;
    this.bookingExpiresAt = new Date(Date.now() + minutes * 60 * 1000);
  }

  public unlock(): void {
    this.status = 'AVAILABLE';
    this.holdingAgentId = undefined;
    this.bookingExpiresAt = undefined;
  }

  public markAsSold(): void {
    this.status = 'SOLD';
    this.holdingAgentId = undefined;
    this.bookingExpiresAt = undefined;
  }
}
