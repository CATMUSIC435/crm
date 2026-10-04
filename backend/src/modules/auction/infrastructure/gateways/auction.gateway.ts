import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { AUCTION_USE_CASE, AuctionUseCase } from '../../application/ports/in/auction.use-case';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/ws/auction',
})
export class AuctionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AuctionGateway.name);

  constructor(
    @Inject(AUCTION_USE_CASE)
    private readonly auctionUseCase: AuctionUseCase,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client kết nối phòng đấu giá: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ngắt kết nối: ${client.id}`);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    client.join(data.roomId);
    this.logger.log(`Client ${client.id} đã vào phòng ${data.roomId}`);
    return { event: 'room_joined', roomId: data.roomId };
  }

  @SubscribeMessage('place_bid')
  async handlePlaceBid(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { auctionId: string; bidderId: string; bidderName: string; amount: number },
  ) {
    try {
      const newBid = await this.auctionUseCase.placeBid(
        data.auctionId,
        data.bidderId,
        data.bidderName,
        data.amount,
      );

      // Broadcast sự kiện gõ búa đặt giá mới cho toàn bộ người trong phòng
      this.server.to(data.auctionId).emit('bid_placed', {
        auctionId: data.auctionId,
        currentBid: data.amount,
        newBid,
        timestamp: new Date().toISOString(),
      });

      return { success: true, bid: newBid };
    } catch (err: any) {
      client.emit('bid_error', { message: err.message });
      return { success: false, message: err.message };
    }
  }
}
