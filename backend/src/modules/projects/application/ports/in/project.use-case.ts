import { CreateProjectDto } from '../../dtos/project.dto';

export const PROJECT_USE_CASE = Symbol('PROJECT_USE_CASE');

export interface ProjectUseCase {
  getProjects(status?: string): Promise<any[]>;
  getProjectDetail(id: string): Promise<any>;
  createProject(dto: CreateProjectDto): Promise<any>;
}
