import { InventoryItemEntity } from '../../../domain/inventory-item.entity';
import { FilterInventoryDto } from '../../dtos/inventory.dto';

export const INVENTORY_REPOSITORY_PORT = Symbol('INVENTORY_REPOSITORY_PORT');

export interface InventoryRepositoryPort {
  findAll(filters: FilterInventoryDto): Promise<InventoryItemEntity[]>;
  findById(id: string): Promise<InventoryItemEntity | null>;
  findByCode(code: string): Promise<InventoryItemEntity | null>;
  save(entity: InventoryItemEntity): Promise<void>;
  batchUpdateStatus(ids: string[], status: string): Promise<number>;
  getStats(projectId?: string): Promise<{
    total: number;
    available: number;
    booking: number;
    sold: number;
    locked: number;
    absorptionRate: number;
  }>;
}
