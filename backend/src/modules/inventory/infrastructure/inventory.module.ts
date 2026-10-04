import { Module } from '@nestjs/common';
import { InventoryController } from './controllers/inventory.controller';
import { InventoryService } from '../application/use-cases/inventory.service';
import { INVENTORY_USE_CASE } from '../application/ports/in/inventory.use-case';
import { INVENTORY_REPOSITORY_PORT } from '../application/ports/out/inventory-repository.port';
import { PrismaInventoryRepositoryAdapter } from './repositories/prisma-inventory-repository.adapter';
import { InventoryGateway } from './gateways/inventory.gateway';

@Module({
  controllers: [InventoryController],
  providers: [
    {
      provide: INVENTORY_USE_CASE,
      useClass: InventoryService,
    },
    {
      provide: INVENTORY_REPOSITORY_PORT,
      useClass: PrismaInventoryRepositoryAdapter,
    },
    InventoryGateway,
  ],
  exports: [INVENTORY_USE_CASE, INVENTORY_REPOSITORY_PORT, InventoryGateway],
})
export class InventoryModule {}
