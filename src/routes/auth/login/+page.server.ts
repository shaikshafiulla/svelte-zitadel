import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Cradle } from '../../../core/infrastructure/di/container';

export const load: PageServerLoad = async ({ locals }) => {
  const container = (locals as any).container as { resolve: <T extends keyof Cradle>(key: T) => Cradle[T] };
  const authService = container.resolve('authService');

  const url = await authService.getAuthorizationUrl();
  throw redirect(302, url);
};
