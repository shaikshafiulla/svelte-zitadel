import type { IAuthService, UserAuthSession } from '../../domain/repositories/IAuthService';

export class DummyAuthService implements IAuthService {
  async getAuthorizationUrl(): Promise<string> {
    return '/auth/callback';
  }

  async exchangeCodeForToken(url: URL): Promise<UserAuthSession> {
    return {
      userId: 'test-user',
      email: 'test@example.com',
      name: 'Test User',
      roles: ['FREELANCER', 'CLIENT'],
      accessToken: 'mock-token'
    };
  }

  async verifyToken(token: string): Promise<UserAuthSession | null> {
    if (token === 'mock-token') {
      return {
        userId: 'test-user',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['FREELANCER', 'CLIENT'],
        accessToken: token
      };
    }
    return null;
  }
}
