import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const sessionCookie = cookies.get('session');
  let session = sessionCookie ? JSON.parse(sessionCookie) : null;
  
  // If no session, create a default mock session
  if (!session) {
    session = {
      userId: 'test-user',
      name: 'Test User',
      roles: ['FREELANCER', 'CLIENT'],
      email: 'test@example.com'
    };
  }

  return {
    session
  };
};
