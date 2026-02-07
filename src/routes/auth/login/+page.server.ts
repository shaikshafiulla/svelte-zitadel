import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Cradle } from '../../../core/infrastructure/di/container';

/* ZITADEL AUTH DISABLED
export const load: PageServerLoad = async ({ locals }) => {
  const container = (locals as any).container as { resolve: <T extends keyof Cradle>(key: T) => Cradle[T] };
  const authService = container.resolve('authService');

  const url = await authService.getAuthorizationUrl();
  throw redirect(302, url);
};
*/

// Temporary: Skip auth and redirect to dashboard
export const load: PageServerLoad = async () => {
  throw redirect(302, '/dashboard');
};
