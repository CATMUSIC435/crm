import { GisLayerEntity, ZoningMasterplanDetail } from '../../../domain/gis-layer.entity';

export const GIS_USE_CASE = Symbol('GIS_USE_CASE');

export interface GisUseCase {
  getLayers(): Promise<GisLayerEntity[]>;
  getProjectsSpatial(): Promise<any[]>;
  queryRadius(lat: number, lng: number, radiusKm: number): Promise<{
    center: { lat: number; lng: number };
    radiusKm: number;
    totalFound: number;
    projects: any[];
  }>;
  getZoningDetail(projectId: string): Promise<ZoningMasterplanDetail>;
}
