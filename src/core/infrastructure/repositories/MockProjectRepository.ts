import { Project, ProjectStatus } from '../../domain/entities/Project';
import type { IProjectRepository } from '../../domain/repositories/IProjectRepository';

export class MockProjectRepository implements IProjectRepository {
  private projects: Map<string, Project[]> = new Map();

  constructor() {
    this.projects.set('1', [
      new Project('p1', 'E-commerce Platform', 'Building a modern shop with SvelteKit', ProjectStatus.COMPLETED, 'TechCorp', 100),
      new Project('p2', 'Analytics Dashboard', 'Real-time data visualization', ProjectStatus.IN_PROGRESS, 'DataViz Inc', 65),
      new Project('p3', 'Mobile App API', 'Scalable backend for iOS/Android', ProjectStatus.PENDING, 'StartUp LLC', 0),
    ]);
  }

  async getByUserId(userId: string): Promise<Project[]> {
    if (!this.projects.has(userId)) {
      return [
        new Project('p1', 'E-commerce Platform', 'Building a modern shop with SvelteKit', ProjectStatus.COMPLETED, 'TechCorp', 100),
        new Project('p2', 'Analytics Dashboard', 'Real-time data visualization', ProjectStatus.IN_PROGRESS, 'DataViz Inc', 65),
        new Project('p3', 'Mobile App API', 'Scalable backend for iOS/Android', ProjectStatus.PENDING, 'StartUp LLC', 0),
      ];
    }
    return this.projects.get(userId) || [];
  }

  async save(userId: string, project: Project): Promise<void> {
    const userProjects = this.projects.get(userId) || [];
    userProjects.push(project);
    this.projects.set(userId, userProjects);
  }
}
