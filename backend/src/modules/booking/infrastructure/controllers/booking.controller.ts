import { Controller, Get, Post, Patch, Body, Query, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BOOKING_USE_CASE, BookingUseCase } from '../../application/ports/in/booking.use-case';
import { CreateBookingDto, ApproveBookingDto, RejectBookingDto, ExtendSlaDto } from '../../application/dtos/booking.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';

@ApiTags('Quy Trình Booking & Khóa Căn (Booking Workflow)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/bookings')
export class BookingController {
  constructor(
    @Inject(BOOKING_USE_CASE)
    private readonly bookingUseCase: BookingUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách các phiếu booking cho bảng Kanban 5 cột' })
  async getBookings(
    @Query('projectId') projectId?: string,
    @Query('stage') stage?: string,
  ) {
    return await this.bookingUseCase.getBookings(projectId, stage);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết phiếu booking, tiến trình stepper và lịch sử duyệt' })
  async getBookingDetail(@Param('id') id: string) {
    return await this.bookingUseCase.getBookingDetail(id);
  }

  @Post()
  @Roles('AGENT', 'TEAM_LEADER', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Khởi tạo phiếu booking mới & kích hoạt khóa căn 15 phút' })
  async createBooking(
    @Body() dto: CreateBookingDto,
    @CurrentUser('id') agentId: string,
  ) {
    return await this.bookingUseCase.createBooking(dto, agentId);
  }

  @Patch(':id/approve')
  @Roles('TEAM_LEADER', 'DIRECTOR', 'ACCOUNTANT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Phê duyệt hồ sơ theo cấp bậc (Sale ➔ Quản lý ➔ Giám đốc ➔ Kế toán)' })
  async approveBooking(
    @Param('id') id: string,
    @Body() dto: ApproveBookingDto,
    @CurrentUser('role') role: string,
    @CurrentUser('email') email: string,
  ) {
    return await this.bookingUseCase.approveBooking(id, dto, role, email);
  }

  @Patch(':id/reject')
  @Roles('TEAM_LEADER', 'DIRECTOR', 'ACCOUNTANT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Từ chối hồ sơ booking và giải phóng căn hộ về rổ hàng trống' })
  async rejectBooking(
    @Param('id') id: string,
    @Body() dto: RejectBookingDto,
    @CurrentUser('email') email: string,
  ) {
    return await this.bookingUseCase.rejectBooking(id, dto, email);
  }

  @Patch(':id/extend-sla')
  @Roles('TEAM_LEADER', 'DIRECTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Gia hạn thêm thời gian SLA giữ chỗ (VD: +30 phút)' })
  async extendSLA(
    @Param('id') id: string,
    @Body() dto: ExtendSlaDto,
    @CurrentUser('email') email: string,
  ) {
    return await this.bookingUseCase.extendSLA(id, dto, email);
  }
}
