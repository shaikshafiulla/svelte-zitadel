import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/* ZITADEL AUTH DISABLED
const ZITADEL_ISSUER = process.env.ZITADEL_ISSUER || 'http://localhost:8080';
const POST_LOGOUT_REDIRECT_URI = process.env.ZITADEL_POST_LOGOUT_REDIRECT_URI || 'http://localhost:5173/';

// GET request - immediately logout
export const load: PageServerLoad = async ({ cookies }) => {
  const logoutUrl = performLogout(cookies);
  throw redirect(302, logoutUrl);
};

// POST action - more reliable for logout (recommended)
export const actions: Actions = {
  default: async ({ cookies }) => {
    const logoutUrl = performLogout(cookies);
    throw redirect(302, logoutUrl);
  }
};

function performLogout(cookies: any): string {
  // Get session to extract id_token
  const sessionCookie = cookies.get('session');
  let idToken: string | null = null;

  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie);
      idToken = session.idToken;
    } catch (e) {
      console.error('Failed to parse session cookie:', e);
    }
  }

  // Clear the local session cookie (per SvelteKit best practices)
  cookies.set('session', '', {
    path: '/',
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 0
  });

  cookies.delete('session', { path: '/' });

  // Redirect to Zitadel's end_session endpoint (per OIDC/Zitadel docs)
  // Ref: https://zitadel.com/docs/guides/integrate/login/oidc/logout
  if (idToken) {
    const params = new URLSearchParams({
      id_token_hint: idToken,
      post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI
    });
    return `${ZITADEL_ISSUER}/oidc/v1/end_session?${params.toString()}`;
  }

  // Fallback if no id_token (shouldn't happen in normal flow)
  return '/auth/login';
}
*/

// Temporary: Simple logout redirect
export const load: PageServerLoad = async () => {
  throw redirect(302, '/');
};

// Add default action to prevent 405 error
export const actions: Actions = {
  default: async () => {
    throw redirect(302, '/');
  }
};
