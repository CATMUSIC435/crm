import { Controller, Get, Post, Patch, Body, Query, Param, UseGuards, Inject, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CUSTOMER_USE_CASE, CustomerUseCase } from '../../application/ports/in/customer.use-case';
import { CreateCustomerDto, FilterCustomerDto, UpdateCustomerDto } from '../../application/dtos/customer.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';

@ApiTags('Hồ Sơ Khách Hàng 360° (Customers)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/customers')
export class CustomerController {
  constructor(
    @Inject(CUSTOMER_USE_CASE)
    private readonly customerUseCase: CustomerUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Truy vấn danh bạ khách hàng 360, lọc theo phân tầng VIP (Phân quyền dữ liệu theo vai trò)' })
  async getCustomers(
    @Query() filters: FilterCustomerDto,
    @CurrentUser('id') agentId: string,
    @CurrentUser('role') role: string,
  ) {
    // Môi giới chỉ xem khách của mình, Quản lý/Giám đốc xem toàn sàn
    const scopeAgentId = role === 'AGENT' ? agentId : undefined;
    return await this.customerUseCase.getCustomers(filters, scopeAgentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết hồ sơ khách hàng 360, tài sản sở hữu và dòng sự kiện' })
  async getCustomerDetail(@Param('id') id: string) {
    return await this.customerUseCase.getCustomerDetail(id);
  }

  @Post()
  @Roles('AGENT', 'TEAM_LEADER', 'DIRECTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Thêm mới khách hàng vào danh bạ chăm sóc' })
  async createCustomer(
    @Body() dto: CreateCustomerDto,
    @CurrentUser('id') agentId: string,
  ) {
    return await this.customerUseCase.createCustomer(dto, agentId);
  }

  @Patch(':id')
  @Roles('AGENT', 'TEAM_LEADER', 'DIRECTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Cập nhật thông tin hồ sơ khách hàng 360' })
  async updateCustomer(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
    @CurrentUser('role') role: string,
    @CurrentUser('id') currentUserId: string,
  ) {
    // Phân quyền chặt chẽ: Chỉ cấp Quản lý (TEAM_LEADER, DIRECTOR, ADMIN, SUPER_ADMIN) mới có quyền đổi chuyên viên phụ trách
    if (role === 'AGENT' && dto.assignedToId && dto.assignedToId !== currentUserId) {
      throw new ForbiddenException('Chuyên viên môi giới (AGENT) không được phép tự ý chuyển giao khách hàng cho chuyên viên khác. Vui lòng liên hệ Trưởng phòng hoặc Quản trị viên!');
    }
    return await this.customerUseCase.updateCustomer(id, dto);
  }
}

