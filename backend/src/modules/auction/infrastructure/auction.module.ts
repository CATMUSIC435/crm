import { Module } from '@nestjs/common';
import { AuctionController } from './controllers/auction.controller';
import { AuctionGateway } from './gateways/auction.gateway';
import { AuctionService } from '../application/use-cases/auction.service';
import { AUCTION_USE_CASE } from '../application/ports/in/auction.use-case';

@Module({
  controllers: [AuctionController],
  providers: [
    {
      provide: AUCTION_USE_CASE,
      useClass: AuctionService,
    },
    AuctionGateway,
  ],
  exports: [AUCTION_USE_CASE],
})
export class AuctionModule {}
