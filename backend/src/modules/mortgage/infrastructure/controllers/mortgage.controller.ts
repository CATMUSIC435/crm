import { Controller, Get, Post, Body, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import {
  MORTGAGE_USE_CASE,
  MortgageUseCase,
  CalculateMortgageDto,
} from '../../application/ports/in/mortgage.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';

@ApiTags('Giai đoạn 5: Công cụ tài chính tín dụng ngân hàng (Mortgage & Bank Credit)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/mortgage')
export class MortgageController {
  constructor(
    @Inject(MORTGAGE_USE_CASE)
    private readonly useCase: MortgageUseCase,
  ) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Lập bảng tính khấu hao vay ngân hàng 360 tháng (Dư nợ giảm dần / Niên kim đều)' })
  async calculate(@Body() dto: CalculateMortgageDto) {
    return await this.useCase.calculate(dto);
  }

  @Post('save')
  @ApiOperation({ summary: 'Lưu kịch bản mô phỏng gói vay cho khách hàng' })
  async saveSimulation(@Body() dto: CalculateMortgageDto) {
    return await this.useCase.saveSimulation(dto);
  }

  @Get('simulations')
  @ApiOperation({ summary: 'Lấy danh sách các phương án tài chính đã lưu' })
  @ApiQuery({ name: 'customerId', required: false })
  async getSimulations(@Query('customerId') customerId?: string) {
    return await this.useCase.getSimulations(customerId);
  }

  @Get('bank-packages')
  @ApiOperation({ summary: 'Danh mục gói vay ưu đãi từ các ngân hàng bảo lãnh (VPBank, MB, TPBank, VCB)' })
  async getBankPackages() {
    return await this.useCase.getBankPackages();
  }
}
