import { Controller, Get, Post, Param, Body, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AUCTION_USE_CASE, AuctionUseCase } from '../../application/ports/in/auction.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';

@ApiTags('Đấu Giá BĐS Trực Tuyến (Auction & Escrow)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/auctions')
export class AuctionController {
  constructor(
    @Inject(AUCTION_USE_CASE)
    private readonly auctionUseCase: AuctionUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách các phòng đấu giá sắp diễn ra & đang live' })
  async getRooms() {
    return await this.auctionUseCase.getRooms();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết phòng đấu giá, lịch sử bids và đồng hồ đếm ngược' })
  async getRoomDetail(@Param('id') id: string) {
    return await this.auctionUseCase.getRoomDetail(id);
  }

  @Post(':id/bid')
  @ApiOperation({ summary: 'Đặt giá mới qua REST API (hỗ trợ song song với WebSocket)' })
  async placeBid(
    @Param('id') id: string,
    @Body() body: { bidderId: string; bidderName: string; amount: number },
  ) {
    return await this.auctionUseCase.placeBid(
      id,
      body.bidderId,
      body.bidderName,
      Number(body.amount),
    );
  }

  @Post(':id/escrow')
  @ApiOperation({ summary: 'Nộp tiền ký quỹ bảo đảm tham gia đấu giá (Escrow Deposit)' })
  async registerEscrow(
    @Param('id') id: string,
    @Body() body: { bidderId: string; bidderName: string; depositAmount: number },
  ) {
    return await this.auctionUseCase.registerEscrow(
      id,
      body.bidderId,
      body.bidderName,
      Number(body.depositAmount),
    );
  }

  @Get(':id/escrows')
  @ApiOperation({ summary: 'Xem danh sách các khoản ký quỹ bảo đảm của phiên đấu giá' })
  async getEscrows(@Param('id') id: string) {
    return await this.auctionUseCase.getEscrows(id);
  }
}
