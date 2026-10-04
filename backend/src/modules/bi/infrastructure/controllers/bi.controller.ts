import { Controller, Get, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BI_USE_CASE, BiUseCase } from '../../application/ports/in/bi.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';

@ApiTags('Giai đoạn 5: Phân tích kinh doanh BI & Dự báo chuỗi thời gian (BI Analytics & ARIMA)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/bi')
export class BiController {
  constructor(
    @Inject(BI_USE_CASE)
    private readonly useCase: BiUseCase,
  ) {}

  @Get('macro-metrics')
  @ApiOperation({ summary: 'Chỉ số tài chính vĩ mô toàn tập đoàn: GDV, Doanh thu thực thu, Tỷ lệ hấp thụ, EBITDA' })
  async getMacroMetrics() {
    return await this.useCase.getMacroMetrics();
  }

  @Get('arima-forecast')
  @ApiOperation({ summary: 'Dự báo doanh thu chuỗi thời gian bằng mô hình kinh tế lượng ARIMA(1,1,1)' })
  @ApiQuery({ name: 'months', required: false, type: Number })
  async getArimaForecast(@Query('months') months?: number) {
    return await this.useCase.getArimaForecast(months || 8);
  }

  @Get('telesale-heatmap')
  @ApiOperation({ summary: 'Bản đồ nhiệt cuộc gọi Telesale tối ưu hóa khung giờ vàng chốt deal' })
  async getTelesaleHeatmap() {
    return await this.useCase.getTelesaleHeatmap();
  }

  @Get('conversion-funnel')
  @ApiOperation({ summary: 'Phân tích phễu chuyển đổi 5 giai đoạn: Lead ➔ Kết nối ➔ Tham quan ➔ Giữ chỗ ➔ HĐMB' })
  @ApiQuery({ name: 'projectId', required: false })
  async getConversionFunnel(@Query('projectId') projectId?: string) {
    return await this.useCase.getConversionFunnel(projectId);
  }
}
