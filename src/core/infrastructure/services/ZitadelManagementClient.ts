import { readFileSync, existsSync } from 'fs';
import type { ILogger } from '../../domain/ILogger';

export class ZitadelManagementClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(private dependencies: { logger: ILogger }) {
    this.baseUrl = process.env.ZITADEL_ISSUER || 'http://localhost:8080';
    this.loadToken();
  }

  private loadToken() {
    if (process.env.ZITADEL_SERVICE_USER_TOKEN) {
      this.token = process.env.ZITADEL_SERVICE_USER_TOKEN;
      return;
    }

    try {
      if (existsSync('admin.pat')) {
        this.token = readFileSync('admin.pat', 'utf-8').trim();
      }
    } catch (error) {
      this.dependencies.logger.warn('Could not read admin.pat', error);
    }
  }

  async getUserById(userId: string): Promise<any> {
    if (!this.token) {
      throw new Error('Zitadel Management API Token not available');
    }

    const response = await fetch(`${this.baseUrl}/v2/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Zitadel API Error: ${response.statusText}`);
    }

    return response.json();
  }

}
