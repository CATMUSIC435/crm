export interface IntegrationAppEntity {
  id: string;
  appCode: string;
  name: string;
  category: string;
  iconName: string;
  description: string;
  connected: boolean;
  lastSync?: string | null;
  requestCount24h: number;
  endpoint?: string | null;
  apiKeyMasked?: string | null;
  latencyMs: number;
  provider: string;
}

export interface WebhookConfigEntity {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  status: 'ACTIVE' | 'DISABLED' | string;
  failureCount: number;
  lastTriggeredAt?: Date | null;
}

export interface ApiKeyEntity {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  rateLimitPerMin: number;
  status: 'ACTIVE' | 'REVOKED' | string;
  lastUsedAt?: Date | null;
  expiresAt?: Date | null;
  createdAt: Date;
}

export interface ApiAuditLogEntity {
  id: string;
  path: string;
  method: string;
  statusCode: number;
  latencyMs: number;
  clientIp?: string | null;
  callerName?: string | null;
  payloadSummary?: string | null;
  createdAt: Date;
}
