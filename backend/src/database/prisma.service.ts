import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public isConnected: boolean = false;

  async onModuleInit() {
    try {
      await this.$connect();
      this.isConnected = true;
      this.logger.log('✅ Đã kết nối cơ sở dữ liệu PostgreSQL thành công!');
    } catch (err: any) {
      this.isConnected = false;
      this.logger.warn(
        `⚠️ CSDL PostgreSQL tại localhost:5432 chưa sẵn sàng (${err.message}). Máy chủ Backend vẫn khởi động và kích hoạt tầng Fallback In-Memory tức thì. Vui lòng bật Docker/PostgreSQL khi cần thao tác dữ liệu thực.`,
      );
    }
  }

  async onModuleDestroy() {
    try {
      this.isConnected = false;
      await this.$disconnect();
    } catch {
      // Ignored
    }
  }
}
