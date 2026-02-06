import type { IUserRepository } from '../repositories/IUserRepository';
import type { IProjectRepository } from '../repositories/IProjectRepository';
import type { DashboardDTO } from '../dtos/ProfileDTOs';
import { ProjectStatus } from '../entities/Project';

export class GetFreelancerDashboard {
  constructor(
    private dependencies: {
      userRepository: IUserRepository;
      projectRepository: IProjectRepository;
    }
  ) {}

  async execute(userId: string): Promise<DashboardDTO> {
    const user = await this.dependencies.userRepository.getById(userId);
    if (!user) throw new Error('User not found');

    const projects = await this.dependencies.projectRepository.getByUserId(userId);

    const activeProjects = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS);
    const completedProjects = projects.filter(p => p.status === ProjectStatus.COMPLETED);

    const averageCompletion = projects.length > 0
      ? projects.reduce((acc, p) => acc + p.completionPercentage, 0) / projects.length
      : 0;

    return {
      user: {
        name: user.name,
        totalEarnings: user.totalEarnings?.toString() || '$0.00',
      },
      stats: {
        activeProjectsCount: activeProjects.length,
        completedProjectsCount: completedProjects.length,
        averageCompletion: Math.round(averageCompletion),
      },
      recentProjects: projects.slice(0, 5).map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        status: p.status,
        clientName: p.clientName,
        completionPercentage: p.completionPercentage
      })),
    };
  }
}
