import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis | null = null;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    const password = this.configService.get<string>('REDIS_PASSWORD', '');

    try {
      this.client = new Redis({
        host,
        port,
        password: password || undefined,
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        retryStrategy: () => null, // Không spam retry nếu offline
      });

      this.client.on('error', (err) => {
        // Suppress unhandled crash in dev mode
      });

      this.client.on('connect', () => {
        this.logger.log('✅ Đã kết nối Redis thành công!');
      });
    } catch (err: any) {
      this.logger.warn(`Redis không khả dụng: ${err.message}`);
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        await this.client.quit();
      } catch {
        // Ignored
      }
    }
  }

  getClient(): Redis | null {
    return this.client;
  }

  /**
   * Acquire a distributed lock with TTL
   */
  async acquireLock(key: string, ttlMs: number): Promise<boolean> {
    if (!this.client) return true; // Fallback if redis not connected
    try {
      const result = await this.client.set(key, 'LOCKED', 'PX', ttlMs, 'NX');
      return result === 'OK';
    } catch {
      return true; // Graceful degradation for dev mode
    }
  }

  /**
   * Release a distributed lock
   */
  async releaseLock(key: string): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.del(key);
    } catch {
      // Ignored
    }
  }

  /**
   * Publish an event to a Redis Pub/Sub channel
   */
  async publish(channel: string, message: any): Promise<void> {
    if (!this.client) return;
    try {
      const payload = typeof message === 'string' ? message : JSON.stringify(message);
      await this.client.publish(channel, payload);
    } catch {
      // Ignored if redis unavailable
    }
  }
}
