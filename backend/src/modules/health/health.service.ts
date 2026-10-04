import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../config/redis.service';

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  version: string;
  checks: {
    database: {
      status: 'up' | 'down';
      latencyMs: number;
      databaseName: string;
    };
    redis: {
      status: 'up' | 'down' | 'disabled';
      latencyMs?: number;
    };
    memory: {
      heapUsedMb: number;
      heapTotalMb: number;
      rssMb: number;
    };
  };
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async checkOverall(): Promise<HealthCheckResponse> {
    const startDb = Date.now();
    let dbStatus: 'up' | 'down' = 'up';
    let dbLatency = 0;

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - startDb;
    } catch (err: any) {
      dbStatus = 'down';
      this.logger.error(`Database health check failed: ${err.message}`);
    }

    const startRedis = Date.now();
    let redisStatus: 'up' | 'down' | 'disabled' = 'disabled';
    let redisLatency = 0;

    const redisClient = this.redisService.getClient();
    if (redisClient) {
      try {
        await redisClient.ping();
        redisStatus = 'up';
        redisLatency = Date.now() - startRedis;
      } catch {
        redisStatus = 'down';
      }
    }

    const mem = process.memoryUsage();
    const overallStatus: 'ok' | 'degraded' | 'error' =
      dbStatus === 'up' && (redisStatus === 'up' || redisStatus === 'disabled')
        ? 'ok'
        : dbStatus === 'up'
        ? 'degraded'
        : 'error';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'production',
      version: '6.0.0',
      checks: {
        database: {
          status: dbStatus,
          latencyMs: dbLatency,
          databaseName: 'novacrm_db (PostgreSQL 16)',
        },
        redis: {
          status: redisStatus,
          latencyMs: redisStatus === 'up' ? redisLatency : undefined,
        },
        memory: {
          heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
          heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024),
          rssMb: Math.round(mem.rss / 1024 / 1024),
        },
      },
    };
  }

  checkLiveness(): { status: 'ok'; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  async checkReadiness(): Promise<{ status: 'ready' | 'not_ready'; dbReady: boolean; redisReady: boolean }> {
    let dbReady = false;
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbReady = true;
    } catch {
      dbReady = false;
    }

    let redisReady = false;
    const client = this.redisService.getClient();
    if (client) {
      try {
        await client.ping();
        redisReady = true;
      } catch {
        redisReady = false;
      }
    } else {
      redisReady = true; // Redis optional fallback in dev
    }

    return {
      status: dbReady ? 'ready' : 'not_ready',
      dbReady,
      redisReady,
    };
  }

  getMetrics() {
    const mem = process.memoryUsage();
    return {
      uptimeSeconds: process.uptime(),
      cpuUsage: process.cpuUsage(),
      memory: {
        heapUsed: mem.heapUsed,
        heapTotal: mem.heapTotal,
        rss: mem.rss,
        external: mem.external,
      },
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
    };
  }
}
