import { Module } from '@nestjs/common';
import { ContractController } from './controllers/contract.controller';
import { ContractService } from '../application/use-cases/contract.service';
import { CONTRACT_USE_CASE } from '../application/ports/in/contract.use-case';

@Module({
  controllers: [ContractController],
  providers: [
    {
      provide: CONTRACT_USE_CASE,
      useClass: ContractService,
    },
  ],
  exports: [CONTRACT_USE_CASE],
})
export class ContractModule {}
