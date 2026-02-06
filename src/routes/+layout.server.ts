import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const sessionCookie = cookies.get('session');
  const session = sessionCookie ? JSON.parse(sessionCookie) : null;

  return {
    session
  };
};
