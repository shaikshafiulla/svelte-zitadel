import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const sessionCookie = cookies.get('session');
  let session = sessionCookie ? JSON.parse(sessionCookie) : null;
  
  // If no session, create a default mock session (freelancer test user)
  if (!session) {
    session = {
      userId: 'freelancer-user-001',
      name: 'Alex Johnson',
      roles: ['FREELANCER', 'CLIENT'],
      email: 'alex@solodev.dev'
    };
  }

  return {
    session
  };
};
