import { Controller, Get, Post, Patch, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OPERATIONS_USE_CASE, OperationsUseCase, CreateBillDto, CreateFitoutPermitDto, CreateAmenityBookingDto } from '../../application/ports/in/operations.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { FitoutStatus } from '../../domain/fitout-permit.entity';

@ApiTags('Giai đoạn 4: Vận hành đô thị & Dịch vụ cư dân (Urban Operations)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/operations')
export class OperationsController {
  constructor(
    @Inject(OPERATIONS_USE_CASE)
    private readonly operationsUseCase: OperationsUseCase,
  ) {}

  // 1. BILLING
  @Get('bills')
  @ApiOperation({ summary: 'Lấy danh sách hóa đơn dịch vụ cư dân (Quản lý, Gửi xe, Điện nước)' })
  async getBills() {
    return await this.operationsUseCase.getBills();
  }

  @Post('bills')
  @ApiOperation({ summary: 'Phát hành thông báo phí dịch vụ đô thị tháng mới' })
  async createBill(@Body() dto: CreateBillDto) {
    return await this.operationsUseCase.createBill(dto);
  }

  @Post('bills/:id/pay')
  @ApiOperation({ summary: 'Thanh toán đối soát hóa đơn dịch vụ qua VietQR Pro hoặc cổng thẻ' })
  async payBill(
    @Param('id') id: string,
    @Body('paymentMethod') paymentMethod?: string,
  ) {
    return await this.operationsUseCase.payBill(id, paymentMethod);
  }

  // 2. FIT-OUT PERMITS
  @Get('permits')
  @ApiOperation({ summary: 'Danh sách hồ sơ cấp phép thi công hoàn thiện nội thất' })
  async getPermits() {
    return await this.operationsUseCase.getPermits();
  }

  @Post('permits')
  @ApiOperation({ summary: 'Đăng ký hồ sơ thi công căn hộ & nộp tiền ký quỹ hoàn thiện' })
  async createPermit(@Body() dto: CreateFitoutPermitDto) {
    return await this.operationsUseCase.createPermit(dto);
  }

  @Patch('permits/:id/status')
  @ApiOperation({ summary: 'Phê duyệt giấy phép thi công (Cho duyệt -> Đang thi công -> Đã hoàn thành)' })
  async approvePermit(
    @Param('id') id: string,
    @Body('status') status: FitoutStatus,
  ) {
    return await this.operationsUseCase.approvePermit(id, status);
  }

  @Post('permits/:id/refund')
  @ApiOperation({ summary: 'Nghiệm thu hoàn trả tiền ký quỹ thi công cho cư dân' })
  async refundDeposit(@Param('id') id: string) {
    return await this.operationsUseCase.refundDeposit(id);
  }

  // 3. AMENITIES
  @Get('amenities/bookings')
  @ApiOperation({ summary: 'Danh sách đặt chỗ tiện ích Clubhouse, BBQ, Hồ bơi, Sân Pickleball' })
  async getBookings() {
    return await this.operationsUseCase.getBookings();
  }

  @Post('amenities/bookings')
  @ApiOperation({ summary: 'Đặt lịch sử dụng tiện ích nội khu đặc quyền' })
  async createBooking(@Body() dto: CreateAmenityBookingDto) {
    return await this.operationsUseCase.createBooking(dto);
  }

  @Post('amenities/bookings/:id/checkin')
  @ApiOperation({ summary: 'Check-in cư dân vào khu tiện ích qua QR Code' })
  async checkInBooking(@Param('id') id: string) {
    return await this.operationsUseCase.checkInBooking(id);
  }
}
