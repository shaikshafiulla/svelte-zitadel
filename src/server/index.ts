import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import container from '../core/infrastructure/di/container';

const app = express();
const port = 3001; // Changed to avoid conflict with Zitadel Login V2 (3000)

const ZITADEL_ISSUER = process.env.ZITADEL_ISSUER || 'http://localhost:8080';
const CLIENT_ID = process.env.ZITADEL_API_CLIENT_ID;
const CLIENT_SECRET = process.env.ZITADEL_API_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Missing ZITADEL_API_CLIENT_ID or ZITADEL_API_CLIENT_SECRET');
  process.exit(1);
}

// Middleware to Validate Token via UserInfo Endpoint
async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'No Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Invalid Authorization header' });
    return;
  }

  try {
    // Use userinfo endpoint instead of introspection (standard OIDC approach)
    const response = await fetch(`${ZITADEL_ISSUER}/oidc/v1/userinfo`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('UserInfo Error Details:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          endpoint: `${ZITADEL_ISSUER}/oidc/v1/userinfo`
        });
        res.status(401).json({ error: 'Token validation failed' });
        return;
    }

    const data = await response.json();

    // Attach user to request
    (req as any).user = {
      id: data.sub,
      email: data.email,
      name: data.name,
      roles: data['urn:zitadel:iam:org:project:roles']
        ? Object.keys(data['urn:zitadel:iam:org:project:roles'])
        : []
    };

    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

app.get('/api/profile/:id', async (req, res) => {
  try {
    const getPublicProfile = container.resolve('getPublicProfile');
    // Use the actual user ID from route parameter
    const profile = await getPublicProfile.execute(req.params.id);
    res.json(profile);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Protect the Dashboard Route
app.get('/api/dashboard', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const isFreelancer = user.roles.includes('FREELANCER');
    
    // In a real app, we would use the user.id to fetch *their* specific dashboard
    // For MVP demo, we use hardcoded '1' to match MockUserRepository/MockProjectRepository

    // Role-Based Logic at API level:
    // If client, maybe return different data structure?

    const getFreelancerDashboard = container.resolve('getFreelancerDashboard');
    const dashboard = await getFreelancerDashboard.execute(user.id); // Use real Zitadel user ID
    
    // Mask earnings for non-freelancers (Example RBAC on data)
    if (!isFreelancer) {
        dashboard.user.totalEarnings = '***';
        dashboard.stats.activeProjectsCount = 0; // Hide stats
    }

    res.json({
        ...dashboard,
        role: isFreelancer ? 'FREELANCER' : 'CLIENT'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Standalone Node Server running at http://localhost:${port}`);
});