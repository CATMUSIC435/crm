import { Module } from '@nestjs/common';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from '../application/use-cases/customer.service';
import { CUSTOMER_USE_CASE } from '../application/ports/in/customer.use-case';

@Module({
  controllers: [CustomerController],
  providers: [
    {
      provide: CUSTOMER_USE_CASE,
      useClass: CustomerService,
    },
  ],
  exports: [CUSTOMER_USE_CASE],
})
export class CustomerModule {}
