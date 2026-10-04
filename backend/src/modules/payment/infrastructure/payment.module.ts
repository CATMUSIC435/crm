import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from '../application/use-cases/payment.service';
import { PAYMENT_USE_CASE } from '../application/ports/in/payment.use-case';

@Module({
  controllers: [PaymentController],
  providers: [
    {
      provide: PAYMENT_USE_CASE,
      useClass: PaymentService,
    },
  ],
  exports: [PAYMENT_USE_CASE],
})
export class PaymentModule {}
