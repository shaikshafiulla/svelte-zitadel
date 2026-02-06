import { User, UserRole } from '../../domain/entities/User';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { ZitadelManagementClient } from '../services/ZitadelManagementClient';
import { Money } from '../../domain/entities/Money';

export class ZitadelUserRepository implements IUserRepository {
  constructor(private dependencies: { zitadelManagementClient: ZitadelManagementClient }) {}

  async getById(id: string): Promise<User | null> {
    const zitadelUser = await this.dependencies.zitadelManagementClient.getUserById(id);
    
    if (!zitadelUser || !zitadelUser.user) return null;

    const u = zitadelUser.user;
    
    
    
    const displayName = u.human?.profile?.displayName || u.machine?.name || 'Unknown User';
    const email = u.human?.email?.email || 'no-email';

    const bio = `${displayName} is a verified Zitadel user working on various projects.`;
    const skills = ["Zitadel", "SvelteKit", "Clean Architecture"];

    return new User(
      u.id,
      displayName,
      email,
      UserRole.FREELANCER,
      bio,
      skills,
      `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`,
      [],
      new Money(12500), 
      true
    );
  }

  async getByEmail(email: string): Promise<User | null> {
    return null;
  }

  async save(user: User): Promise<void> {
    console.log('Save user not implemented in ZitadelRepo yet');
  }
}
