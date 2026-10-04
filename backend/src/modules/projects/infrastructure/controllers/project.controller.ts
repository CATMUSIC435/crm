import { Controller, Get, Post, Body, Query, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PROJECT_USE_CASE, ProjectUseCase } from '../../application/ports/in/project.use-case';
import { CreateProjectDto } from '../../application/dtos/project.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';

@ApiTags('Quản Lý Dự Án (Projects)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/projects')
export class ProjectController {
  constructor(
    @Inject(PROJECT_USE_CASE)
    private readonly projectUseCase: ProjectUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách các đại dự án, lọc theo tình trạng mở bán' })
  async getProjects(@Query('status') status?: string) {
    return await this.projectUseCase.getProjects(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết đại dự án, mặt bằng, tiện ích và phân tích đầu tư AI' })
  async getProjectDetail(@Param('id') id: string) {
    return await this.projectUseCase.getProjectDetail(id);
  }

  @Post()
  @Roles('DIRECTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Khởi tạo đại dự án mới' })
  async createProject(@Body() dto: CreateProjectDto) {
    return await this.projectUseCase.createProject(dto);
  }
}
