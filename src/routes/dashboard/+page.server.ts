import { redirect, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Job, JobStatus, JobCategory } from '../../core/domain/entities/Job';
import type { Cradle } from '../../core/infrastructure/di/container';

export const load: PageServerLoad = async ({ locals, cookies, fetch }) => {
  const sessionCookie = cookies.get('session');
  if (!sessionCookie) {
    throw redirect(302, '/auth/login');
  }

  const session = JSON.parse(sessionCookie);
  const token = session.accessToken;

  // Call the Standalone Node API
  // We use SvelteKit's fetch which handles internal requests, but here we go to localhost:3001
  const response = await fetch('http://localhost:3001/api/dashboard', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    // Token expired or invalid
    cookies.delete('session', { path: '/' });
    throw redirect(302, '/auth/login');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }

  const dashboardData = await response.json();

  // Load jobs data
  const container = (locals as any).container as { resolve: <T extends keyof Cradle>(key: T) => Cradle[T] };
  const jobRepository = container.resolve('jobRepository');

  const allJobs = await jobRepository.getAll();
  const myPostedJobs = await jobRepository.getByPostedBy(session.userId);

  // Convert Job entities to plain objects for serialization
  const serializeJob = (job: any) => ({
    id: job.id,
    title: job.title,
    description: job.description,
    category: job.category,
    budget: job.budget,
    duration: job.duration,
    postedBy: job.postedBy,
    postedByName: job.postedByName,
    status: job.status,
    postedAt: job.postedAt.toISOString(),
    skills: job.skills,
    applications: job.applications
  });

  return {
    streamed: {
      dashboard: Promise.resolve(dashboardData)
    },
    jobs: allJobs.map(serializeJob),
    myPostedJobs: myPostedJobs.map(serializeJob),
    jobCategories: Object.values(JobCategory)
  };
};

export const actions: Actions = {
  postJob: async ({ request, locals, cookies }) => {
    const sessionCookie = cookies.get('session');
    if (!sessionCookie) {
      return fail(401, { message: 'Not authenticated' });
    }

    const session = JSON.parse(sessionCookie);
    const isClient = session.roles?.includes('CLIENT');

    if (!isClient) {
      return fail(403, { message: 'Only clients can post jobs' });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as JobCategory;
    const budget = formData.get('budget') as string;
    const duration = formData.get('duration') as string;
    const skills = (formData.get('skills') as string).split(',').map(s => s.trim());

    const container = (locals as any).container as { resolve: <T extends keyof Cradle>(key: T) => Cradle[T] };
    const jobRepository = container.resolve('jobRepository');

    const newJob = new Job(
      `job_${Date.now()}`,
      title,
      description,
      category,
      budget,
      duration,
      session.userId,
      session.name,
      JobStatus.OPEN,
      new Date(),
      skills,
      0
    );

    await jobRepository.save(newJob);

    return { success: true, message: 'Job posted successfully!' };
  },

  applyForJob: async ({ request, locals, cookies }) => {
    const sessionCookie = cookies.get('session');
    if (!sessionCookie) {
      return fail(401, { message: 'Not authenticated' });
    }

    const session = JSON.parse(sessionCookie);
    const isFreelancer = session.roles?.includes('FREELANCER');

    if (!isFreelancer) {
      return fail(403, { message: 'Only freelancers can apply for jobs' });
    }

    const formData = await request.formData();
    const jobId = formData.get('jobId') as string;

    const container = (locals as any).container as { resolve: <T extends keyof Cradle>(key: T) => Cradle[T] };
    const jobRepository = container.resolve('jobRepository');

    await jobRepository.applyForJob(jobId, session.userId);

    return { success: true, message: 'Application submitted successfully!' };
  }
};