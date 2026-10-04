import { FilterInventoryDto, BatchLockDto, CreateInventoryDto } from '../../dtos/inventory.dto';

export const INVENTORY_USE_CASE = Symbol('INVENTORY_USE_CASE');

export interface InventoryUseCase {
  getInventory(filters: FilterInventoryDto): Promise<any>;
  getInventoryStats(projectId?: string): Promise<any>;
  batchUpdateStatus(dto: BatchLockDto, actorId: string): Promise<{ updatedCount: number; message: string }>;
  createItem(dto: CreateInventoryDto): Promise<any>;
  getUnitDetail(id: string): Promise<any>;
}
