import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PanoramaUseCase } from '../ports/in/panorama.use-case';
import {
  PANORAMA_REPOSITORY_PORT,
  PanoramaRepositoryPort,
} from '../ports/out/panorama-repository.port';
import { PanoramaTourEntity, HotspotSpec } from '../../domain/panorama-tour.entity';

@Injectable()
export class PanoramaService implements PanoramaUseCase {
  constructor(
    @Inject(PANORAMA_REPOSITORY_PORT)
    private readonly panoramaRepo: PanoramaRepositoryPort,
  ) {}

  async getTours(): Promise<any[]> {
    const tours = await this.panoramaRepo.getAllTours();
    return tours.map((t) => ({
      id: t.id,
      projectId: t.projectId,
      name: t.name,
      developer: t.developer,
      unitCode: t.unitCode,
      unitTitle: t.unitTitle,
      type: t.type,
      price: t.price,
      area: t.area,
      bedrooms: t.bedrooms,
      bathrooms: t.bathrooms,
      location: t.location,
      totalRooms: t.rooms.length,
      totalHotspots: t.getTotalHotspots(),
    }));
  }

  async getTourDetail(projectId: string): Promise<PanoramaTourEntity> {
    const tour = await this.panoramaRepo.getTourByProjectId(projectId);
    if (!tour) {
      throw new NotFoundException(`Không tìm thấy dữ liệu Sa bàn VR 360 cho dự án: ${projectId}`);
    }
    return tour;
  }

  async addHotspot(
    projectId: string,
    roomId: string,
    hotspot: HotspotSpec,
  ): Promise<{ success: boolean; totalHotspots: number }> {
    const tour = await this.getTourDetail(projectId);
    const room = tour.getRoomById(roomId);
    if (!room) {
      throw new NotFoundException(`Không tìm thấy phòng: ${roomId} trong tour ${projectId}`);
    }
    room.specs.push(hotspot);
    await this.panoramaRepo.saveTour(tour);
    return {
      success: true,
      totalHotspots: tour.getTotalHotspots(),
    };
  }
}
