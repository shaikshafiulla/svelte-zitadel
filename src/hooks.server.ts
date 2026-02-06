import type { Handle } from '@sveltejs/kit';
import container from './core/infrastructure/di/container';

export const handle: Handle = async ({ event, resolve }) => {
  // Attach the container to locals for easy access in load functions
  // We cast to any here to avoid augmenting the App namespace just yet
  (event.locals as any).container = container;

  const response = await resolve(event);
  return response;
};
