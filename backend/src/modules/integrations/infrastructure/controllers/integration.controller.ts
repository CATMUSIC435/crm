import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import {
  INTEGRATION_USE_CASE,
  IntegrationUseCase,
  CreateWebhookDto,
  CreateApiKeyDto,
  SmartCAVerifyDto,
} from '../../application/ports/in/integration.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';

@ApiTags('Giai đoạn 5: Tích hợp API, Webhook ERP & Chữ ký số SmartCA (Integrations & SmartCA)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/integrations')
export class IntegrationController {
  constructor(
    @Inject(INTEGRATION_USE_CASE)
    private readonly useCase: IntegrationUseCase,
  ) {}

  @Get('apps')
  @ApiOperation({ summary: 'Danh mục các ứng dụng ngoại vi kết nối (ERP, Zalo ZNS, VietQR, SmartCA, Stringee VoIP)' })
  @ApiQuery({ name: 'category', required: false })
  async getApps(@Query('category') category?: string) {
    return await this.useCase.getApps(category);
  }

  @Patch('apps/:appCode/toggle')
  @ApiOperation({ summary: 'Bật/Tắt trạng thái kết nối ứng dụng' })
  async toggleApp(@Param('appCode') appCode: string, @Body('connected') connected: boolean) {
    return await this.useCase.toggleApp(appCode, connected);
  }

  @Get('webhooks')
  @ApiOperation({ summary: 'Danh sách Webhooks đồng bộ dữ liệu vào hệ thống ERP (MISA/SAP)' })
  async getWebhooks() {
    return await this.useCase.getWebhooks();
  }

  @Post('webhooks')
  @ApiOperation({ summary: 'Đăng ký Webhook mới để nhận sự kiện đặt cọc & ký hợp đồng' })
  async createWebhook(@Body() dto: CreateWebhookDto) {
    return await this.useCase.createWebhook(dto);
  }

  @Post('webhooks/:id/test')
  @ApiOperation({ summary: 'Kiểm thử gửi Ping Webhook tới endpoint ERP' })
  async triggerWebhookTest(@Param('id') id: string) {
    return await this.useCase.triggerWebhookTest(id);
  }

  @Get('api-keys')
  @ApiOperation({ summary: 'Danh sách API Keys mở rộng cho đối tác F1 & ngân hàng liên kết' })
  async getApiKeys() {
    return await this.useCase.getApiKeys();
  }

  @Post('api-keys')
  @ApiOperation({ summary: 'Khởi tạo API Key mới với phân quyền chi tiết' })
  async createApiKey(@Body() dto: CreateApiKeyDto) {
    return await this.useCase.createApiKey(dto);
  }

  @Patch('api-keys/:id/revoke')
  @ApiOperation({ summary: 'Thu hồi vô hiệu hóa API Key' })
  async revokeApiKey(@Param('id') id: string) {
    return await this.useCase.revokeApiKey(id);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Nhật ký kiểm toán giao thức API & độ trễ mạng (Latency Tracking)' })
  async getAuditLogs() {
    return await this.useCase.getAuditLogs();
  }

  @Post('smartca/verify')
  @ApiOperation({ summary: 'Xác thực chữ ký số SmartCA (VNPT/Viettel) cho Hợp đồng mua bán A4' })
  async verifySmartCA(@Body() dto: SmartCAVerifyDto) {
    return await this.useCase.verifySmartCASignature(dto);
  }
}
