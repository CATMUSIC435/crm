import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BookingController } from './controllers/booking.controller';
import { BookingService } from '../application/use-cases/booking.service';
import { BOOKING_USE_CASE } from '../application/ports/in/booking.use-case';
import { BOOKING_REPOSITORY_PORT } from '../application/ports/out/booking-repository.port';
import { PrismaBookingRepositoryAdapter } from './repositories/prisma-booking-repository.adapter';
import { BookingSlaProcessor } from './jobs/booking-sla.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'booking-sla',
    }),
  ],
  controllers: [BookingController],
  providers: [
    {
      provide: BOOKING_USE_CASE,
      useClass: BookingService,
    },
    {
      provide: BOOKING_REPOSITORY_PORT,
      useClass: PrismaBookingRepositoryAdapter,
    },
    BookingSlaProcessor,
  ],
  exports: [BOOKING_USE_CASE, BOOKING_REPOSITORY_PORT],
})
export class BookingModule {}
