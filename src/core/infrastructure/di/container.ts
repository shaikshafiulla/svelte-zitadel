import 'dotenv/config'; 
import { createContainer, asClass, InjectionMode, type AwilixContainer } from 'awilix';
import type { ILogger } from '../../domain/ILogger';
import { ConsoleLogger } from '../logger/ConsoleLogger';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import { MockUserRepository } from '../repositories/MockUserRepository';
import type { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import { MockProjectRepository } from '../repositories/MockProjectRepository';
import type { IJobRepository } from '../../domain/repositories/IJobRepository';
import { MockJobRepository } from '../repositories/MockJobRepository';
import type { IAuthService } from '../../domain/repositories/IAuthService';
import { ZitadelAuthService } from '../services/ZitadelAuthService';
import { ZitadelManagementClient } from '../services/ZitadelManagementClient';
import { GetPublicProfile } from '../../domain/use-cases/GetPublicProfile';
import { GetFreelancerDashboard } from '../../domain/use-cases/GetFreelancerDashboard';
import { ZitadelUserRepository } from '../repositories/ZitadelUserRepository';

export interface Cradle {
  logger: ILogger;
  userRepository: IUserRepository;
  projectRepository: IProjectRepository;
  jobRepository: IJobRepository;
  authService: IAuthService;
  zitadelManagementClient: ZitadelManagementClient;
  getPublicProfile: GetPublicProfile;
  getFreelancerDashboard: GetFreelancerDashboard;
}

const container: AwilixContainer<Cradle> = createContainer<Cradle>({
  injectionMode: InjectionMode.PROXY,
  strict: true,
});

container.register({
  logger: asClass(ConsoleLogger).singleton(),
  zitadelManagementClient: asClass(ZitadelManagementClient).singleton(),
  userRepository: asClass(ZitadelUserRepository).singleton(), 
  projectRepository: asClass(MockProjectRepository).singleton(),
  jobRepository: asClass(MockJobRepository).singleton(),
  authService: asClass(ZitadelAuthService).singleton(),
  getPublicProfile: asClass(GetPublicProfile).singleton(),
  getFreelancerDashboard: asClass(GetFreelancerDashboard).singleton(),
});

export default container;
