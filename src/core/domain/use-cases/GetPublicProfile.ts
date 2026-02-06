import type { IUserRepository } from '../repositories/IUserRepository';
import type { IProjectRepository } from '../repositories/IProjectRepository';
import type { PublicProfileDTO } from '../dtos/ProfileDTOs';

export class GetPublicProfile {
  constructor(
    private dependencies: {
      userRepository: IUserRepository;
      projectRepository: IProjectRepository;
    }
  ) {}

  async execute(userId: string): Promise<PublicProfileDTO> {
    const user = await this.dependencies.userRepository.getById(userId);
    if (!user) throw new Error('User not found');

    const projects = await this.dependencies.projectRepository.getByUserId(userId);

    return {
      user: {
        id: user.id,
        name: user.name,
        bio: user.bio,
        skills: user.skills,
        avatarUrl: user.avatarUrl,
        isAvailable: user.isAvailable,
      },
      projects: projects.map(p => ({
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
