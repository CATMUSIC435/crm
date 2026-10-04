import { Controller, Get, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GIS_USE_CASE, GisUseCase } from '../../application/ports/in/gis.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';

@ApiTags('PropTech GIS & Không Gian Địa Lý (Spatial Engine)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/gis')
export class GisController {
  constructor(
    @Inject(GIS_USE_CASE)
    private readonly gisUseCase: GisUseCase,
  ) {}

  @Get('layers')
  @ApiOperation({ summary: 'Lấy các lớp hạ tầng GIS (Metro, Vành đai 3, Cao tốc, Sân bay, Heatmap giá đất)' })
  async getLayers() {
    return await this.gisUseCase.getLayers();
  }

  @Get('projects')
  @ApiOperation({ summary: 'Lấy danh sách tọa độ và ranh quy hoạch của các đại đô thị' })
  async getProjectsSpatial() {
    return await this.gisUseCase.getProjectsSpatial();
  }

  @Get('radius')
  @ApiOperation({ summary: 'Truy vấn không gian: Tìm dự án và tiện ích trong bán kính R (km)' })
  @ApiQuery({ name: 'lat', type: Number, example: 10.7601 })
  @ApiQuery({ name: 'lng', type: Number, example: 10.6948 })
  @ApiQuery({ name: 'radiusKm', type: Number, example: 50 })
  async queryRadius(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radiusKm') radiusKm: number = 30,
  ) {
    return await this.gisUseCase.queryRadius(Number(lat), Number(lng), Number(radiusKm));
  }

  @Get('zoning/:projectId')
  @ApiOperation({ summary: 'Xem hồ sơ chi tiết quy hoạch 1/500 (Pháp lý, FAR, Mật độ xây dựng)' })
  async getZoningDetail(@Param('projectId') projectId: string) {
    return await this.gisUseCase.getZoningDetail(projectId);
  }
}
