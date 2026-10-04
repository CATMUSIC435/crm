import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MARKETING_USE_CASE, MarketingUseCase, CreateCampaignDto } from '../../application/ports/in/marketing.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';

@ApiTags('Giai đoạn 5: Tiếp thị & Chiến dịch đa kênh (Marketing Multi-channel)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/marketing')
export class MarketingController {
  constructor(
    @Inject(MARKETING_USE_CASE)
    private readonly useCase: MarketingUseCase,
  ) {}

  @Get('campaigns')
  @ApiOperation({ summary: 'Lấy danh sách chiến dịch quảng cáo đa kênh' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'platform', required: false })
  async getCampaigns(@Query('status') status?: string, @Query('platform') platform?: string) {
    return await this.useCase.getCampaigns(status, platform);
  }

  @Get('campaigns/:id')
  @ApiOperation({ summary: 'Xem chi tiết chiến dịch tiếp thị' })
  async getCampaignById(@Param('id') id: string) {
    return await this.useCase.getCampaignById(id);
  }

  @Post('campaigns')
  @ApiOperation({ summary: 'Khởi tạo chiến dịch tiếp thị mới' })
  async createCampaign(@Body() dto: CreateCampaignDto) {
    return await this.useCase.createCampaign(dto);
  }

  @Patch('campaigns/:id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái chiến dịch (Active, Paused, Completed)' })
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return await this.useCase.updateCampaignStatus(id, status);
  }

  @Post('campaigns/:id/ingest-lead')
  @ApiOperation({ summary: 'Webhook ghi nhận lead mới từ Facebook/Google/TikTok/Zalo' })
  async ingestLead(@Param('id') id: string, @Body('count') count?: number) {
    return await this.useCase.recordLeadIngestion(id, count || 1);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Báo cáo chỉ số tổng hợp tiếp thị: Ngân sách, Chi phí, Lead, CPL, Conversion Rate' })
  async getMetrics() {
    return await this.useCase.getMetrics();
  }
}
