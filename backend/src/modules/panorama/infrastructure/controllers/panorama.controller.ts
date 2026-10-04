import { Controller, Get, Post, Param, Body, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PANORAMA_USE_CASE, PanoramaUseCase } from '../../application/ports/in/panorama.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';

@ApiTags('Thực Tế Ảo VR 360 & Sa Bàn 3D (Panorama)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/panorama')
export class PanoramaController {
  constructor(
    @Inject(PANORAMA_USE_CASE)
    private readonly panoramaUseCase: PanoramaUseCase,
  ) {}

  @Get('tours')
  @ApiOperation({ summary: 'Lấy danh sách các căn hộ mẫu có Sa bàn VR 360' })
  async getTours() {
    return await this.panoramaUseCase.getTours();
  }

  @Get('tours/:projectId')
  @ApiOperation({ summary: 'Chi tiết trải nghiệm VR 360, ma trận phòng, cổng dịch chuyển & Hotspots 3D' })
  async getTourDetail(@Param('projectId') projectId: string) {
    return await this.panoramaUseCase.getTourDetail(projectId);
  }

  @Post('tours/:projectId/rooms/:roomId/hotspots')
  @ApiOperation({ summary: 'Gắn thêm điểm chạm Hotspot 3D mới vào phòng căn hộ mẫu' })
  async addHotspot(
    @Param('projectId') projectId: string,
    @Param('roomId') roomId: string,
    @Body() hotspot: any,
  ) {
    return await this.panoramaUseCase.addHotspot(projectId, roomId, hotspot);
  }
}
