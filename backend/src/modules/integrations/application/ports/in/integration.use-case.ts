import {
  IntegrationAppEntity,
  WebhookConfigEntity,
  ApiKeyEntity,
  ApiAuditLogEntity,
} from '../../../domain/integration.entity';

export const INTEGRATION_USE_CASE = Symbol('INTEGRATION_USE_CASE');

export interface CreateWebhookDto {
  name: string;
  url: string;
  events: string[];
}

export interface CreateApiKeyDto {
  name: string;
  permissions: string[];
  rateLimitPerMin?: number;
}

export interface SmartCAVerifyDto {
  contractCode: string;
  documentHash: string;
  certificateSerial?: string;
}

export interface IntegrationUseCase {
  getApps(category?: string): Promise<IntegrationAppEntity[]>;
  toggleApp(appCode: string, connected: boolean): Promise<IntegrationAppEntity>;
  getWebhooks(): Promise<WebhookConfigEntity[]>;
  createWebhook(dto: CreateWebhookDto): Promise<WebhookConfigEntity>;
  triggerWebhookTest(id: string): Promise<{ success: boolean; latencyMs: number; statusCode: number; responseBody: string }>;
  getApiKeys(): Promise<ApiKeyEntity[]>;
  createApiKey(dto: CreateApiKeyDto): Promise<{ apiKey: ApiKeyEntity; rawSecretKey: string }>;
  revokeApiKey(id: string): Promise<{ success: boolean }>;
  getAuditLogs(): Promise<ApiAuditLogEntity[]>;
  verifySmartCASignature(dto: SmartCAVerifyDto): Promise<{ isValid: boolean; signedAt: string; signerInfo: string; timestampAuthority: string }>;
}
