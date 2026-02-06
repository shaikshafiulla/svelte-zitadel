import { User, UserRole } from '../../domain/entities/User';
import { Money } from '../../domain/entities/Money';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';

export class MockUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  constructor() {
    const freelancer = new User(
      '1',
      'John Doe',
      'john@example.com',
      UserRole.FREELANCER,
      'Full-stack developer with 10 years of experience in Svelte and Node.js.',
      ['Svelte', 'TypeScript', 'Node.js', 'PostgreSQL'],
      'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      [],
      new Money(15000),
      true
    );
    this.users.set(freelancer.id, freelancer);
  }

  async getById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find(u => u.email === email) || null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }
}
