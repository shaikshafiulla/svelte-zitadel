import * as client from 'openid-client';
import type { IAuthService, UserAuthSession } from '../../domain/repositories/IAuthService';
import type { ILogger } from '../../domain/ILogger';

export class ZitadelAuthService implements IAuthService {
  private config: client.Configuration | null = null;
  private issuerUrl: string;
  private clientId: string;
  private redirectUri: string;

  constructor(private dependencies: { logger: ILogger }) {
    this.issuerUrl = process.env.ZITADEL_ISSUER || 'http://localhost:8080';
    this.clientId = process.env.ZITADEL_CLIENT_ID || '';
    this.redirectUri = process.env.ZITADEL_REDIRECT_URI || 'http://localhost:5173/auth/callback';
  }

  private async getConfig(): Promise<client.Configuration> {
    if (this.config) return this.config;

    try {
      const server = new URL(this.issuerUrl);
      
      if (this.issuerUrl.startsWith('http:')) {
        this.config = new client.Configuration(
          {
            issuer: this.issuerUrl,
            authorization_endpoint: `${this.issuerUrl}/oauth/v2/authorize`,
            token_endpoint: `${this.issuerUrl}/oauth/v2/token`,
            userinfo_endpoint: `${this.issuerUrl}/oidc/v1/userinfo`,
            jwks_uri: `${this.issuerUrl}/oauth/v2/keys`,
            response_types_supported: ['code'],
            scopes_supported: ['openid', 'email', 'profile', 'offline_access'],
            token_endpoint_auth_methods_supported: ['none', 'client_secret_basic'],
          },
          this.clientId,
          process.env.ZITADEL_CLIENT_SECRET // Client Secret if needed (for backend) or undefined for public
        );
        client.allowInsecureRequests(this.config);
      } else {
        this.config = await client.discovery(server, this.clientId, process.env.ZITADEL_CLIENT_SECRET);
      }
      
      return this.config;
    } catch (error) {
      this.dependencies.logger.error('Failed to discover Zitadel issuer', error);
      throw error;
    }
  }

  async getAuthorizationUrl(): Promise<string> {
    const config = await this.getConfig();
    const url = client.buildAuthorizationUrl(config, {
      redirect_uri: this.redirectUri,
      scope: 'openid email profile urn:zitadel:iam:org:project:roles',
      state: 'state',
    });
    return url.href;
  }

  async exchangeCodeForToken(url: URL): Promise<UserAuthSession> {
    const config = await this.getConfig();
    
    
    const tokens = await client.authorizationCodeGrant(config, url, {
      expectedState: 'state', 
    });

    const claims:any = tokens.claims();

    const rolesMap = claims?.['urn:zitadel:iam:org:project:roles'] as Record<string, any>;
    const roles = rolesMap ? Object.keys(rolesMap) : [];

    return {
      userId: claims.sub as string,
      email: claims.email as string,
      name: claims.name as string,
      roles: roles,
      accessToken: tokens.access_token,
      idToken: tokens.id_token, 
    };
  }

  async verifyToken(token: string): Promise<UserAuthSession | null> {
    try {
      const config = await this.getConfig();
      const userinfo = await client.fetchUserInfo(config, token, client.skipSubjectCheck);
      
      const rolesMap = userinfo['urn:zitadel:iam:org:project:roles'] as Record<string, any>;
      const roles = rolesMap ? Object.keys(rolesMap) : [];

      return {
        userId: userinfo.sub,
        email: userinfo.email as string,
        name: userinfo.name as string,
        roles: roles,
        accessToken: token,
      };
    } catch (error) {
      this.dependencies.logger.error('Token verification failed', error);
      return null;
    }
  }
}
