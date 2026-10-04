export class AuctionRoomEntity {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly unitId: string,
    public startingPrice: number,
    public currentBid: number,
    public reservePrice: number,
    public bidStep: number = 50_000_000,
    public status: 'UPCOMING' | 'LIVE' | 'ENDED' | 'CANCELLED' = 'UPCOMING',
    public winningBidderId?: string,
  ) {}

  public placeBid(bidderId: string, amount: number): boolean {
    if (this.status !== 'LIVE') {
      throw new Error('Phiên đấu giá hiện không trong thời gian mở đặt giá trực tuyến');
    }
    if (amount <= this.currentBid) {
      throw new Error(`Mức giá đặt (${amount}) phải lớn hơn mức giá hiện tại (${this.currentBid})`);
    }
    if ((amount - this.currentBid) < this.bidStep) {
      throw new Error(`Bước giá tối thiểu phải là ${(this.bidStep / 1e6).toLocaleString()} Triệu VNĐ`);
    }

    this.currentBid = amount;
    this.winningBidderId = bidderId;
    return true;
  }
}
