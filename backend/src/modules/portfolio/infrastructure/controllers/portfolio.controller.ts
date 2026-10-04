import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PORTFOLIO_USE_CASE, PortfolioUseCase, CreatePortfolioAssetDto } from '../../application/ports/in/portfolio.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';

@ApiTags('Giai đoạn 4: Quản lý tài sản VIP & Danh mục đầu tư (VIP Wealth Engine)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/portfolio')
export class PortfolioController {
  constructor(
    @Inject(PORTFOLIO_USE_CASE)
    private readonly portfolioUseCase: PortfolioUseCase,
  ) {}

  @Get('assets')
  @ApiOperation({ summary: 'Lấy danh sách bất động sản trong kho tài sản đầu tư' })
  @ApiQuery({ name: 'customerId', required: false })
  async getAssets(@Query('customerId') customerId?: string) {
    return await this.portfolioUseCase.getAssets(customerId);
  }

  @Get('assets/:id')
  @ApiOperation({ summary: 'Xem chi tiết tài sản, lịch đóng tiền và chỉ số tài chính' })
  async getAssetById(@Param('id') id: string) {
    return await this.portfolioUseCase.getAssetById(id);
  }

  @Post('assets')
  @ApiOperation({ summary: 'Thêm bất động sản vào danh mục tài sản tích sản' })
  async createAsset(@Body() dto: CreatePortfolioAssetDto) {
    return await this.portfolioUseCase.createAsset(dto);
  }

  @Patch('assets/:id/valuation')
  @ApiOperation({ summary: 'Định giá lại tài sản (Revaluation) & tự động tính lại IRR, CAGR, Yield' })
  async updateValuation(
    @Param('id') id: string,
    @Body('valuation') valuation: number,
  ) {
    return await this.portfolioUseCase.updateValuation(id, Number(valuation));
  }

  @Get('summary')
  @ApiOperation({ summary: 'Báo cáo tổng hợp tài sản danh mục VIP: Tổng vốn, Định giá, Lợi nhuận, IRR, CAGR trung bình' })
  @ApiQuery({ name: 'customerId', required: false })
  async getSummaryMetrics(@Query('customerId') customerId?: string) {
    return await this.portfolioUseCase.getSummaryMetrics(customerId);
  }

  @Post('assets/:id/simulate-exit')
  @ApiOperation({ summary: 'Mô phỏng kịch bản chốt lời tái đầu tư (Exit Scenario Analysis) với tỷ lệ tăng trưởng dự phóng' })
  async simulateExitScenario(
    @Param('id') id: string,
    @Body('additionalYears') additionalYears?: number,
    @Body('annualGrowthRate') annualGrowthRate?: number,
  ) {
    return await this.portfolioUseCase.simulateExitScenario(
      id,
      additionalYears !== undefined ? Number(additionalYears) : 3,
      annualGrowthRate !== undefined ? Number(annualGrowthRate) : 9.5,
    );
  }

  @Delete('assets/:id')
  @ApiOperation({ summary: 'Xóa tài sản khỏi danh mục quản lý' })
  async deleteAsset(@Param('id') id: string) {
    return await this.portfolioUseCase.deleteAsset(id);
  }
}
