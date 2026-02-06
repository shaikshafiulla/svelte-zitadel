export interface UserAuthSession {
  userId: string;
  email: string;
  name: string;
  roles: string[];
  accessToken?: string; 
  idToken?: string; 
}

export interface IAuthService {
  getAuthorizationUrl(): Promise<string>;
  exchangeCodeForToken(url: URL): Promise<UserAuthSession>;
  verifyToken(token: string): Promise<UserAuthSession | null>;
}
