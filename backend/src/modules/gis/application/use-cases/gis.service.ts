import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { GisUseCase } from '../ports/in/gis.use-case';
import { GIS_REPOSITORY_PORT, GisRepositoryPort } from '../ports/out/gis-repository.port';
import { GisLayerEntity, ZoningMasterplanDetail } from '../../domain/gis-layer.entity';
import { GisCoordinate } from '../../domain/gis-coordinate.vo';

@Injectable()
export class GisService implements GisUseCase {
  constructor(
    @Inject(GIS_REPOSITORY_PORT)
    private readonly gisRepo: GisRepositoryPort,
  ) {}

  async getLayers(): Promise<GisLayerEntity[]> {
    return await this.gisRepo.getAllLayers();
  }

  async getProjectsSpatial(): Promise<any[]> {
    return await this.gisRepo.getProjectsSpatial();
  }

  async queryRadius(lat: number, lng: number, radiusKm: number) {
    const center = new GisCoordinate(lat, lng);
    const rawProjects = await this.gisRepo.getProjectsSpatial();

    const matched = rawProjects
      .map((p) => {
        if (!p.latitude || !p.longitude) return null;
        const projectCoord = new GisCoordinate(p.latitude, p.longitude);
        const distance = center.distanceToKm(projectCoord);
        return {
          ...p,
          distanceKm: distance,
        };
      })
      .filter((p) => p !== null && p.distanceKm <= radiusKm)
      .sort((a, b) => a!.distanceKm - b!.distanceKm);

    return {
      center: { lat, lng },
      radiusKm,
      totalFound: matched.length,
      projects: matched,
    };
  }

  async getZoningDetail(projectId: string): Promise<ZoningMasterplanDetail> {
    const zoning = await this.gisRepo.getZoningByProjectId(projectId);
    if (!zoning) {
      throw new NotFoundException(`Không tìm thấy hồ sơ quy hoạch 1/500 cho dự án: ${projectId}`);
    }
    return zoning;
  }
}
