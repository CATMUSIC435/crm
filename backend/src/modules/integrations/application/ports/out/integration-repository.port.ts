import {
  IntegrationAppEntity,
  WebhookConfigEntity,
  ApiKeyEntity,
  ApiAuditLogEntity,
} from '../../../domain/integration.entity';
import { CreateWebhookDto, CreateApiKeyDto } from '../in/integration.use-case';

export const INTEGRATION_REPOSITORY = Symbol('INTEGRATION_REPOSITORY');

export interface IntegrationRepositoryPort {
  findApps(category?: string): Promise<IntegrationAppEntity[]>;
  updateAppConnected(appCode: string, connected: boolean): Promise<IntegrationAppEntity>;
  findWebhooks(): Promise<WebhookConfigEntity[]>;
  findWebhookById(id: string): Promise<WebhookConfigEntity | null>;
  createWebhook(dto: CreateWebhookDto): Promise<WebhookConfigEntity>;
  updateWebhookTrigger(id: string, lastTriggered: Date): Promise<void>;
  findApiKeys(): Promise<ApiKeyEntity[]>;
  createApiKey(dto: CreateApiKeyDto, keyPrefix: string, hashedSecret: string): Promise<ApiKeyEntity>;
  revokeApiKey(id: string): Promise<void>;
  findAuditLogs(): Promise<ApiAuditLogEntity[]>;
}
