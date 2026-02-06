import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Cradle } from '../../../core/infrastructure/di/container';

export const load: PageServerLoad = async ({ url, locals, cookies }) => {
  const code = url.searchParams.get('code');
  if (!code) throw redirect(302, '/');

  const container = (locals as any).container as { resolve: <T extends keyof Cradle>(key: T) => Cradle[T] };
  const authService = container.resolve('authService');

  try {
    const session = await authService.exchangeCodeForToken(url);
    
    // Store session in a cookie (simplified for MVP)
    cookies.set('session', JSON.stringify(session), {
      path: '/',
      httpOnly: true,
      secure: true, // Required for sameSite: 'none'
      sameSite: 'none',
      maxAge: 60 * 60 * 24 // 1 day
    });
  } catch (err) {
    console.error('Auth Callback Error:', err);
  }

  throw redirect(302, '/dashboard');
};
