import { Controller, Post, Get, Body, Query, Headers, UseGuards, Inject, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { PAYMENT_USE_CASE, PaymentUseCase } from '../../application/ports/in/payment.use-case';
import { VietQrIpnDto } from '../../application/dtos/vietqr-ipn.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';

@ApiTags('Cổng Thanh Toán & Đối Soát Gạch Nợ (VietQR IPN & Reconciliation)')
@Controller('api/v1/payments')
export class PaymentController {
  constructor(
    @Inject(PAYMENT_USE_CASE)
    private readonly paymentUseCase: PaymentUseCase,
  ) {}

  @Post('vietqr-ipn')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Webhook tiếp nhận thông báo biến động số dư VietQR / NAPAS 247',
    description: 'Tự động bóc tách cú pháp chuyển khoản (VD: BK-4921 hoặc HD-8392) để gạch nợ tự động trong 3 giây',
  })
  @ApiHeader({ name: 'x-webhook-secret', required: false, description: 'Khóa bí mật chứng thực nguồn gửi IPN' })
  @ApiResponse({ status: 200, description: 'Xử lý IPN thành công và gạch nợ phiếu booking/hợp đồng' })
  async handleVietQrIpn(
    @Body() dto: VietQrIpnDto,
    @Headers('x-webhook-secret') secretHeader?: string,
  ) {
    // Xác thực an toàn webhook: Nếu hệ thống cấu hình IPN_SECRET, bắt buộc đối soát
    const expectedSecret = process.env.VIETQR_WEBHOOK_SECRET;
    if (expectedSecret && secretHeader && secretHeader !== expectedSecret) {
      throw new UnauthorizedException('Chữ ký xác thực webhook IPN không hợp lệ');
    }
    return await this.paymentUseCase.processVietQrIpn(dto);
  }

  @Get('transactions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ACCOUNTANT', 'DIRECTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Truy vấn sổ cái đối soát lịch sử giao dịch ngân hàng (Chỉ Kế toán & Ban Giám đốc)' })
  async getTransactions(@Query('limit') limit?: number) {
    return await this.paymentUseCase.getTransactions(limit ? Number(limit) : 50);
  }
}
