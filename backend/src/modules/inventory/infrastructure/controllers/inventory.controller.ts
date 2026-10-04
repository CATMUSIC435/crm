import { Controller, Get, Post, Body, Query, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { INVENTORY_USE_CASE, InventoryUseCase } from '../../application/ports/in/inventory.use-case';
import { FilterInventoryDto, BatchLockDto, CreateInventoryDto } from '../../application/dtos/inventory.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';

@ApiTags('Rổ Hàng & Sơ Đồ Phân Lô (Inventory)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/inventory')
export class InventoryController {
  constructor(
    @Inject(INVENTORY_USE_CASE)
    private readonly inventoryUseCase: InventoryUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Truy vấn danh mục rổ hàng, ma trận phân lô, hỗ trợ lọc 6 chiều' })
  async getInventory(@Query() filters: FilterInventoryDto) {
    return await this.inventoryUseCase.getInventory(filters);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Lấy chỉ số KPI rổ hàng, số căn trống/booking/đã bán và tỷ lệ hấp thụ' })
  async getStats(@Query('projectId') projectId?: string) {
    return await this.inventoryUseCase.getInventoryStats(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết thông tin kỹ thuật, mặt bằng và chính sách chiết khấu của 1 căn' })
  async getUnitDetail(@Param('id') id: string) {
    return await this.inventoryUseCase.getUnitDetail(id);
  }

  @Post()
  @Roles('ADMIN', 'SUPER_ADMIN', 'DIRECTOR')
  @ApiOperation({ summary: 'Thêm mới căn hộ vào rổ hàng dự án' })
  async createItem(@Body() dto: CreateInventoryDto) {
    return await this.inventoryUseCase.createItem(dto);
  }

  @Post('batch-lock')
  @Roles('TEAM_LEADER', 'DIRECTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Thao tác hàng loạt: Khóa nội bộ hoặc Mở bán đồng loạt' })
  async batchLock(
    @Body() dto: BatchLockDto,
    @CurrentUser('id') actorId: string,
  ) {
    return await this.inventoryUseCase.batchUpdateStatus(dto, actorId);
  }
}
