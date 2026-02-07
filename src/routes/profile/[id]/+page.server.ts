import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Dummy profiles data
const dummyProfiles: { [key: string]: any } = {
  'test-user': {
    id: 'test-user',
    name: 'Test User',
    email: 'test@example.com',
    role: 'FREELANCER',
    bio: 'Experienced freelancer specializing in web development',
    skills: ['React', 'TypeScript', 'Node.js', 'SvelteKit'],
    hourlyRate: 75,
    completedProjects: 12,
    rating: 4.8,
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test-user'
  },
  'user_1770462561604': {
    id: 'user_1770462561604',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'CLIENT',
    bio: 'Looking for talented developers for my startup',
    company: 'Tech Startup Inc',
    budget: 5000,
    projectsPosted: 5,
    rating: 4.5,
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
  }
};

export const load: PageServerLoad = async ({ params, fetch }) => {
  /* API CALL DISABLED - Using dummy data
  const response = await fetch(`http://localhost:3001/api/profile/${params.id}`);

  if (!response.ok) {
    if (response.status === 404) throw error(404, 'Profile not found');
    throw error(500, 'Failed to fetch profile from API');
  }

  const profile = await response.json();
  */

  // Use dummy data instead
  const profile = dummyProfiles[params.id];
  if (!profile) {
    throw error(404, 'Profile not found');
  }

  return {
    profile
  };
};