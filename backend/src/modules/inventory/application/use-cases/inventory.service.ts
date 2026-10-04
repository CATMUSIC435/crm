import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { InventoryUseCase } from '../ports/in/inventory.use-case';
import { INVENTORY_REPOSITORY_PORT, InventoryRepositoryPort } from '../ports/out/inventory-repository.port';
import { FilterInventoryDto, BatchLockDto, CreateInventoryDto } from '../dtos/inventory.dto';
import { InventoryItemEntity } from '../../domain/inventory-item.entity';
import { RedisService } from '../../../../config/redis.service';
import { randomUUID } from 'crypto';

@Injectable()
export class InventoryService implements InventoryUseCase {
  constructor(
    @Inject(INVENTORY_REPOSITORY_PORT)
    private readonly inventoryRepo: InventoryRepositoryPort,
    private readonly redisService: RedisService,
  ) {}

  async getInventory(filters: FilterInventoryDto) {
    return await this.inventoryRepo.findAll(filters);
  }

  async getInventoryStats(projectId?: string) {
    return await this.inventoryRepo.getStats(projectId);
  }

  async batchUpdateStatus(dto: BatchLockDto, _actorId: string) {
    const updatedCount = await this.inventoryRepo.batchUpdateStatus(dto.unitIds, dto.targetStatus);
    const actionText = dto.targetStatus === 'LOCKED' ? 'khóa nội bộ' : 'mở bán lại';
    return {
      updatedCount,
      message: `Đã ${actionText} thành công ${updatedCount} căn hộ trong rổ hàng`,
    };
  }

  async createItem(dto: CreateInventoryDto) {
    const existing = await this.inventoryRepo.findByCode(dto.code);
    if (existing) {
      throw new ConflictException(`Mã căn hộ ${dto.code} đã tồn tại trong hệ thống`);
    }

    const newItem = new InventoryItemEntity(
      randomUUID(),
      dto.code,
      dto.projectId,
      dto.type,
      dto.price,
      dto.area,
      'AVAILABLE',
      dto.tower,
      dto.floor,
      dto.bedrooms || 1,
      1,
      dto.direction,
      undefined,
      dto.handoverStandard,
    );

    await this.inventoryRepo.save(newItem);
    return newItem;
  }

  async getUnitDetail(id: string) {
    const unit = await this.inventoryRepo.findById(id);
    if (!unit) {
      throw new NotFoundException(`Không tìm thấy căn hộ có mã định danh: ${id}`);
    }
    return unit;
  }
}
