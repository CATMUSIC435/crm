import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { IntegrationRepositoryPort } from '../../application/ports/out/integration-repository.port';
import {
  IntegrationAppEntity,
  WebhookConfigEntity,
  ApiKeyEntity,
  ApiAuditLogEntity,
} from '../../domain/integration.entity';
import { CreateWebhookDto, CreateApiKeyDto } from '../../application/ports/in/integration.use-case';

@Injectable()
export class PrismaIntegrationRepositoryAdapter implements IntegrationRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toAppEntity(item: any): IntegrationAppEntity {
    return {
      id: item.id,
      appCode: item.appCode,
      name: item.name,
      category: item.category,
      iconName: item.iconName,
      description: item.description,
      connected: item.connected,
      lastSync: item.lastSync,
      requestCount24h: item.requestCount24h,
      endpoint: item.endpoint,
      apiKeyMasked: item.apiKeyMasked,
      latencyMs: item.latencyMs,
      provider: item.provider,
    };
  }

  private toWebhookEntity(item: any): WebhookConfigEntity {
    return {
      id: item.id,
      name: item.name,
      url: item.url,
      events: item.events as string[],
      secret: item.secret,
      status: item.status,
      failureCount: item.failureCount,
      lastTriggeredAt: item.lastTriggeredAt,
    };
  }

  private toApiKeyEntity(item: any): ApiKeyEntity {
    return {
      id: item.id,
      name: item.name,
      keyPrefix: item.keyPrefix,
      permissions: item.permissions as string[],
      rateLimitPerMin: item.rateLimitPerMin,
      status: item.status,
      lastUsedAt: item.lastUsedAt,
      expiresAt: item.expiresAt,
      createdAt: item.createdAt,
    };
  }

  async findApps(category?: string): Promise<IntegrationAppEntity[]> {
    const where: any = {};
    if (category && category !== 'all') where.category = category;

    const list = await this.prisma.integrationApp.findMany({
      where,
      orderBy: { requestCount24h: 'desc' },
    });
    return list.map((a) => this.toAppEntity(a));
  }

  async updateAppConnected(appCode: string, connected: boolean): Promise<IntegrationAppEntity> {
    const updated = await this.prisma.integrationApp.update({
      where: { appCode },
      data: { connected, lastSync: new Date().toLocaleTimeString('vi-VN') },
    });
    return this.toAppEntity(updated);
  }

  async findWebhooks(): Promise<WebhookConfigEntity[]> {
    const list = await this.prisma.webhookConfig.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return list.map((w) => this.toWebhookEntity(w));
  }

  async findWebhookById(id: string): Promise<WebhookConfigEntity | null> {
    const item = await this.prisma.webhookConfig.findUnique({ where: { id } });
    return item ? this.toWebhookEntity(item) : null;
  }

  async createWebhook(dto: CreateWebhookDto): Promise<WebhookConfigEntity> {
    const secret = `whsec_${Math.random().toString(36).substring(2, 15)}`;
    const created = await this.prisma.webhookConfig.create({
      data: {
        name: dto.name,
        url: dto.url,
        events: dto.events,
        secret,
        status: 'ACTIVE',
      },
    });
    return this.toWebhookEntity(created);
  }

  async updateWebhookTrigger(id: string, lastTriggered: Date): Promise<void> {
    await this.prisma.webhookConfig.update({
      where: { id },
      data: { lastTriggeredAt: lastTriggered },
    });
  }

  async findApiKeys(): Promise<ApiKeyEntity[]> {
    const list = await this.prisma.apiKey.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return list.map((k) => this.toApiKeyEntity(k));
  }

  async createApiKey(dto: CreateApiKeyDto, keyPrefix: string, hashedSecret: string): Promise<ApiKeyEntity> {
    const created = await this.prisma.apiKey.create({
      data: {
        name: dto.name,
        keyPrefix,
        hashedSecret,
        permissions: dto.permissions,
        rateLimitPerMin: dto.rateLimitPerMin || 600,
        status: 'ACTIVE',
      },
    });
    return this.toApiKeyEntity(created);
  }

  async revokeApiKey(id: string): Promise<void> {
    await this.prisma.apiKey.update({
      where: { id },
      data: { status: 'REVOKED' },
    });
  }

  async findAuditLogs(): Promise<ApiAuditLogEntity[]> {
    const list = await this.prisma.apiAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return list.map((l) => ({
      id: l.id,
      path: l.path,
      method: l.method,
      statusCode: l.statusCode,
      latencyMs: l.latencyMs,
      clientIp: l.clientIp,
      callerName: l.callerName,
      payloadSummary: l.payloadSummary,
      createdAt: l.createdAt,
    }));
  }
}
