import { Controller, Get, Post, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LOYALTY_USE_CASE, LoyaltyUseCase, CreateVoucherDto, RedeemVoucherDto, AwardPointsDto } from '../../application/ports/in/loyalty.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';

@ApiTags('Giai đoạn 5: Khách hàng thân thiết & NovaClub (Loyalty & NovaPoints)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/loyalty')
export class LoyaltyController {
  constructor(
    @Inject(LOYALTY_USE_CASE)
    private readonly useCase: LoyaltyUseCase,
  ) {}

  @Get('vouchers')
  @ApiOperation({ summary: 'Lấy danh mục Voucher đặc quyền NovaClub' })
  @ApiQuery({ name: 'category', required: false })
  async getVouchers(@Query('category') category?: string) {
    return await this.useCase.getVouchers(category);
  }

  @Post('vouchers')
  @ApiOperation({ summary: 'Tạo voucher ưu đãi mới' })
  async createVoucher(@Body() dto: CreateVoucherDto) {
    return await this.useCase.createVoucher(dto);
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Đổi điểm NovaPoints lấy voucher đặc quyền' })
  async redeemVoucher(@Body() dto: RedeemVoucherDto) {
    return await this.useCase.redeemVoucher(dto);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Lịch sử giao dịch điểm tích lũy & đổi thưởng' })
  @ApiQuery({ name: 'customerId', required: false })
  async getTransactions(@Query('customerId') customerId?: string) {
    return await this.useCase.getTransactions(customerId);
  }

  @Post('award-points')
  @ApiOperation({ summary: 'Cộng điểm thưởng NovaPoints cho khách hàng' })
  async awardPoints(@Body() dto: AwardPointsDto) {
    return await this.useCase.awardPoints(dto);
  }

  @Get('members/:customerId')
  @ApiOperation({ summary: 'Hồ sơ thành viên NovaClub: Điểm tích lũy, Hạng thẻ (Silver/Gold/Platinum/Diamond)' })
  async getMemberProfile(@Param('customerId') customerId: string) {
    return await this.useCase.getMemberProfile(customerId);
  }
}
