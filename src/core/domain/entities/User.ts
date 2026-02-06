import type { Project } from './Project';
import type { Money } from './Money';

export enum UserRole {
  FREELANCER = 'FREELANCER',
  CLIENT = 'CLIENT'
}

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly role: UserRole,
    public readonly bio?: string,
    public readonly skills: string[] = [],
    public readonly avatarUrl?: string,
    public readonly projects: Project[] = [],
    public readonly totalEarnings?: Money,
    public readonly isAvailable: boolean = true
  ) {}
}
