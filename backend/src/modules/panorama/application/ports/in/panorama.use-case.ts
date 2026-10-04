import { PanoramaTourEntity, HotspotSpec } from '../../../domain/panorama-tour.entity';

export const PANORAMA_USE_CASE = Symbol('PANORAMA_USE_CASE');

export interface PanoramaUseCase {
  getTours(): Promise<any[]>;
  getTourDetail(projectId: string): Promise<PanoramaTourEntity>;
  addHotspot(
    projectId: string,
    roomId: string,
    hotspot: HotspotSpec,
  ): Promise<{ success: boolean; totalHotspots: number }>;
}
