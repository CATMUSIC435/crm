import { GisLayerEntity, ZoningMasterplanDetail } from '../../../domain/gis-layer.entity';

export const GIS_REPOSITORY_PORT = Symbol('GIS_REPOSITORY_PORT');

export interface GisRepositoryPort {
  getAllLayers(): Promise<GisLayerEntity[]>;
  getLayerByCode(code: string): Promise<GisLayerEntity | null>;
  getProjectsSpatial(): Promise<any[]>;
  findProjectsWithinRadius(lat: number, lng: number, radiusKm: number): Promise<any[]>;
  getZoningByProjectId(projectId: string): Promise<ZoningMasterplanDetail | null>;
}
