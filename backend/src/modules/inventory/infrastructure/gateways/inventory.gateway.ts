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
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { RedisService } from '../../../../config/redis.service';
import Redis from 'ioredis';

export interface UnitStatusEventPayload {
  projectId: string;
  unitId: string;
  unitCode?: string;
  status: string; // 'AVAILABLE' | 'HOLDING' | 'BOOKING' | 'SOLD' | 'LOCKED'
  agentId?: string | null;
  bookingCode?: string | null;
  expiresAt?: string | null;
  message?: string;
}

@Injectable()
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/ws/inventory',
})
export class InventoryGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(InventoryGateway.name);
  private subRedis: Redis | null = null;
  private readonly CHANNEL_NAME = 'channel:inventory:unit_status';

  constructor(private readonly redisService: RedisService) {}

  async onModuleInit() {
    // Khởi tạo Redis Subscriber để đồng bộ real-time đa tiến trình (multi-instance/BullMQ)
    try {
      const client = this.redisService.getClient();
      if (client) {
        this.subRedis = client.duplicate({
          lazyConnect: true,
          retryStrategy: () => null,
          maxRetriesPerRequest: 1,
        });
        this.subRedis.on('error', () => {
          // Graceful handling when Redis is offline
        });
        await this.subRedis.subscribe(this.CHANNEL_NAME);
        this.subRedis.on('message', (channel, message) => {
          if (channel === this.CHANNEL_NAME) {
            try {
              const payload: UnitStatusEventPayload = JSON.parse(message);
              this.emitToClients(payload);
            } catch (err: any) {
              this.logger.error(`Lỗi phân giải gói tin Redis PubSub: ${err.message}`);
            }
          }
        });
        this.logger.log(`📡 Đã kết nối Redis Pub/Sub kênh [${this.CHANNEL_NAME}] cho bảng hàng trực tuyến`);
      }
    } catch (err: any) {
      this.logger.warn(`Redis PubSub đang ở chế độ offline: ${err.message}`);
    }
  }

  async onModuleDestroy() {
    if (this.subRedis) {
      await this.subRedis.quit();
    }
  }

  handleConnection(client: Socket) {
    this.logger.log(`Agent đã kết nối bảng hàng thời gian thực: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Agent ngắt kết nối bảng hàng: ${client.id}`);
  }

  @SubscribeMessage('join_project')
  handleJoinProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string },
  ) {
    const room = `project_${data.projectId}`;
    client.join(room);
    this.logger.log(`Agent [${client.id}] đã tham gia theo dõi mặt bằng dự án: ${room}`);
    return { event: 'project_joined', room };
  }

  @SubscribeMessage('leave_project')
  handleLeaveProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string },
  ) {
    const room = `project_${data.projectId}`;
    client.leave(room);
    this.logger.log(`Agent [${client.id}] đã rời khỏi mặt bằng dự án: ${room}`);
    return { event: 'project_left', room };
  }

  /**
   * Phát sự kiện cập nhật trạng thái căn hộ tới các clients đang xem
   */
  async broadcastUnitStatus(payload: UnitStatusEventPayload) {
    // 1. Phát trực tiếp nội bộ qua Socket.IO nếu có server
    this.emitToClients(payload);

    // 2. Publish lên Redis để các server instance khác (nếu có) cũng phát
    try {
      const client = this.redisService.getClient();
      if (client) {
        await client.publish(this.CHANNEL_NAME, JSON.stringify(payload));
      }
    } catch {
      // Ignored in dev
    }
  }

  private emitToClients(payload: UnitStatusEventPayload) {
    if (!this.server) return;
    const room = `project_${payload.projectId}`;
    const eventData = {
      ...payload,
      timestamp: new Date().toISOString(),
    };

    // Bắn tới room dự án cụ thể
    this.server.to(room).emit('unit_status_changed', eventData);

    // Bắn broad-spectrum tới tất cả connection trên namespace
    this.server.emit('unit_matrix_updated', eventData);

    this.logger.log(`⚡ Đã phát sự kiện đổi trạng thái căn [${payload.unitId}] -> [${payload.status}] tới room ${room}`);
  }
}
