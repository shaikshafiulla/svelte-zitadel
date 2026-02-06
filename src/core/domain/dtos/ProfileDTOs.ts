import type { User } from '../entities/User';
import type { Project } from '../entities/Project';

export interface PublicProfileDTO {
  user: {
    id: string;
    name: string;
    bio?: string;
    skills: string[];
    avatarUrl?: string;
    isAvailable: boolean;
  };
  projects: Project[];
}

export interface DashboardDTO {
  user: {
    name: string;
    totalEarnings: string;
  };
  stats: {
    activeProjectsCount: number;
    completedProjectsCount: number;
    averageCompletion: number;
  };
  recentProjects: Project[];
}
