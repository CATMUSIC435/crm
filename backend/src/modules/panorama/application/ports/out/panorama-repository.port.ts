import { PanoramaTourEntity } from '../../../domain/panorama-tour.entity';

export const PANORAMA_REPOSITORY_PORT = Symbol('PANORAMA_REPOSITORY_PORT');

export interface PanoramaRepositoryPort {
  getAllTours(): Promise<PanoramaTourEntity[]>;
  getTourByProjectId(projectId: string): Promise<PanoramaTourEntity | null>;
  saveTour(tour: PanoramaTourEntity): Promise<void>;
}
