import { Controller, Get, Post, Body, Query, Param, Req, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { CONTRACT_USE_CASE, ContractUseCase } from '../../application/ports/in/contract.use-case';
import { CreateContractDto, SignContractDto, RecordPaymentDto } from '../../application/dtos/contract.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';

@ApiTags('Quản Trị Hợp Đồng & e-Sign (Contracts)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/contracts')
export class ContractController {
  constructor(
    @Inject(CONTRACT_USE_CASE)
    private readonly contractUseCase: ContractUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách các hợp đồng đặt cọc & HĐMB' })
  async getContracts(@Query('projectId') projectId?: string) {
    return await this.contractUseCase.getContracts(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết hợp đồng, tiến độ đóng tiền và mã hash chữ ký số' })
  async getContractDetail(@Param('id') id: string) {
    return await this.contractUseCase.getContractDetail(id);
  }

  @Post()
  @Roles('AGENT', 'TEAM_LEADER', 'DIRECTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Khởi tạo hợp đồng cọc / HĐMB mới' })
  async createContract(
    @Body() dto: CreateContractDto,
    @CurrentUser('id') creatorId: string,
  ) {
    return await this.contractUseCase.createContract(dto, creatorId);
  }

  @Post(':id/esign')
  @Roles('AGENT', 'TEAM_LEADER', 'DIRECTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Ký số điện tử SHA-256 xác thực hợp đồng' })
  async signContract(
    @Param('id') id: string,
    @Body() dto: SignContractDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || '127.0.0.1';
    return await this.contractUseCase.signContract(id, dto, ipAddress);
  }

  @Post(':id/payments')
  @Roles('ACCOUNTANT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Ghi nhận thanh toán đợt tiếp theo của hợp đồng (Chỉ Kế toán & Admin)' })
  async recordPayment(
    @Param('id') id: string,
    @Body() dto: RecordPaymentDto,
  ) {
    return await this.contractUseCase.recordPayment(id, dto);
  }
}
