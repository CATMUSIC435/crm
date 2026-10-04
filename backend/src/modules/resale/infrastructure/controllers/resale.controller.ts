import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RESALE_USE_CASE, ResaleUseCase, CreateResaleListingDto, CreateClientDemandDto, CloseDealDto } from '../../application/ports/in/resale.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { ResaleListingStatus } from '../../domain/resale-listing.entity';

@ApiTags('Giai đoạn 4: Thị trường thứ cấp & Co-brokering (Resale Engine)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/resale')
export class ResaleController {
  constructor(
    @Inject(RESALE_USE_CASE)
    private readonly resaleUseCase: ResaleUseCase,
  ) {}

  @Get('listings')
  @ApiOperation({ summary: 'Lấy danh sách giỏ hàng chuyển nhượng & cho thuê thứ cấp' })
  @ApiQuery({ name: 'type', required: false, enum: ['resale', 'rental'] })
  @ApiQuery({ name: 'status', required: false })
  async getListings(
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return await this.resaleUseCase.getListings(type, status);
  }

  @Get('listings/:id')
  @ApiOperation({ summary: 'Xem chi tiết căn hộ ký gửi thứ cấp' })
  async getListingById(@Param('id') id: string) {
    return await this.resaleUseCase.getListingById(id);
  }

  @Post('listings')
  @ApiOperation({ summary: 'Ký gửi sản phẩm bất động sản thứ cấp / cho thuê' })
  async createListing(@Body() dto: CreateResaleListingDto) {
    return await this.resaleUseCase.createListing(dto);
  }

  @Patch('listings/:id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái niêm yết giỏ hàng thứ cấp' })
  async updateListingStatus(
    @Param('id') id: string,
    @Body('status') status: ResaleListingStatus,
  ) {
    return await this.resaleUseCase.updateListingStatus(id, status);
  }

  @Get('demands')
  @ApiOperation({ summary: 'Lấy danh sách nhu cầu tìm mua / thuê của khách hàng' })
  async getDemands() {
    return await this.resaleUseCase.getDemands();
  }

  @Post('demands')
  @ApiOperation({ summary: 'Đăng ký nhu cầu khách hàng & tự động ghép cặp AI' })
  async createDemand(@Body() dto: CreateClientDemandDto) {
    return await this.resaleUseCase.createDemand(dto);
  }

  @Post('demands/:id/match-ai')
  @ApiOperation({ summary: 'AI Matchmaking: Phân tích và gợi ý giỏ hàng phù hợp nhất với nhu cầu' })
  async matchDemandAi(@Param('id') id: string) {
    return await this.resaleUseCase.matchDemandAi(id);
  }

  @Get('listings/:id/co-broker')
  @ApiOperation({ summary: 'Tính toán tỷ lệ phân chia hoa hồng liên kết Co-brokering (50/50)' })
  @ApiQuery({ name: 'customAmount', required: false, type: Number })
  async calculateCoBroker(
    @Param('id') id: string,
    @Query('customAmount') customAmount?: number,
  ) {
    return await this.resaleUseCase.calculateCoBroker(id, customAmount ? Number(customAmount) : undefined);
  }

  @Post('close-deal')
  @ApiOperation({ summary: 'Chốt cọc giao dịch thứ cấp & ghi nhận phân bổ hoa hồng liên kết' })
  async closeDeal(@Body() dto: CloseDealDto) {
    return await this.resaleUseCase.closeDeal(dto);
  }
}
