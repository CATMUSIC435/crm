export const AUCTION_USE_CASE = Symbol('AUCTION_USE_CASE');

export interface AuctionUseCase {
  getRooms(): Promise<any[]>;
  getRoomDetail(id: string): Promise<any>;
  placeBid(auctionId: string, bidderId: string, bidderName: string, amount: number): Promise<any>;
  registerEscrow(
    auctionId: string,
    bidderId: string,
    bidderName: string,
    depositAmount: number,
  ): Promise<any>;
  getEscrows(auctionId?: string): Promise<any[]>;
}

