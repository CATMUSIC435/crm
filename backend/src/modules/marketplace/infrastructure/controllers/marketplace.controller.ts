import { Controller, Get, Post, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import {
  MARKETPLACE_USE_CASE,
  MarketplaceUseCase,
  CreateMarketplaceListingDto,
  RegisterAgencyPartnerDto,
} from '../../application/ports/in/marketplace.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';

@ApiTags('Giai đoạn 5: Sàn liên kết đại lý & Co-brokering (Marketplace B2B)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/marketplace')
export class MarketplaceController {
  constructor(
    @Inject(MARKETPLACE_USE_CASE)
    private readonly useCase: MarketplaceUseCase,
  ) {}

  @Get('listings')
  @ApiOperation({ summary: 'Lấy rổ hàng BĐS liên minh phân phối F1/F2' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'verifiedOnly', required: false, type: Boolean })
  async getListings(
    @Query('category') category?: string,
    @Query('type') type?: string,
    @Query('verifiedOnly') verifiedOnly?: boolean,
  ) {
    return await this.useCase.getListings(category, type, verifiedOnly);
  }

  @Get('listings/:id')
  @ApiOperation({ summary: 'Chi tiết sản phẩm ký gửi liên kết bán chéo' })
  async getListingById(@Param('id') id: string) {
    return await this.useCase.getListingById(id);
  }

  @Post('listings')
  @ApiOperation({ summary: 'Đăng tin sản phẩm mới vào rổ hàng chung B2B' })
  async createListing(@Body() dto: CreateMarketplaceListingDto) {
    return await this.useCase.createListing(dto);
  }

  @Get('partners')
  @ApiOperation({ summary: 'Mạng lưới các sàn giao dịch & đại lý đối tác' })
  async getAgencyPartners() {
    return await this.useCase.getAgencyPartners();
  }

  @Post('partners')
  @ApiOperation({ summary: 'Đăng ký đại lý liên kết mới gia nhập liên minh' })
  async registerPartner(@Body() dto: RegisterAgencyPartnerDto) {
    return await this.useCase.registerPartner(dto);
  }

  @Post('listings/:id/co-broker')
  @ApiOperation({ summary: 'Gửi yêu cầu liên kết bán chéo 50/50 (Co-brokering)' })
  async requestCoBrokering(
    @Param('id') id: string,
    @Body('partnerName') partnerName: string,
    @Body('clientName') clientName: string,
  ) {
    return await this.useCase.requestCoBrokering(id, partnerName, clientName);
  }
}
