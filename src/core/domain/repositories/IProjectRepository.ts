import type { Project } from '../entities/Project';

export interface IProjectRepository {
  getByUserId(userId: string): Promise<Project[]>;
  save(userId: string, project: Project): Promise<void>;
}
