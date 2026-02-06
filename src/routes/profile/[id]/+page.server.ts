import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  // Public profiles don't strictly need auth in this MVP, 
  // but we call the Node API to maintain architecture consistency.
  const response = await fetch(`http://localhost:3001/api/profile/${params.id}`);

  if (!response.ok) {
    if (response.status === 404) throw error(404, 'Profile not found');
    throw error(500, 'Failed to fetch profile from API');
  }

  const profile = await response.json();

  return {
    profile
  };
};