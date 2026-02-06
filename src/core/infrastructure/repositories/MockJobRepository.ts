import { Job, JobStatus, JobCategory } from '../../domain/entities/Job';
import type { IJobRepository } from '../../domain/repositories/IJobRepository';

export class MockJobRepository implements IJobRepository {
  private jobs: Map<string, Job> = new Map();
  private applications: Map<string, string[]> = new Map(); 

  constructor() {
    const sampleJobs = [
      new Job(
        'job1',
        'SvelteKit E-commerce Website',
        'Need an experienced developer to build a modern e-commerce platform using SvelteKit. Must have experience with payment integration and responsive design.',
        JobCategory.WEB_DEVELOPMENT,
        '$3000 - $5000',
        '2-3 months',
        'client1',
        'Tech Startup Inc',
        JobStatus.OPEN,
        new Date('2026-01-15'),
        ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'Stripe'],
        3
      ),
      new Job(
        'job2',
        'Mobile App UI/UX Design',
        'Looking for a creative designer to create modern, user-friendly interfaces for our mobile application. Experience with Figma required.',
        JobCategory.DESIGN,
        '$1500 - $2500',
        '1 month',
        'client2',
        'DesignCo',
        JobStatus.OPEN,
        new Date('2026-01-20'),
        ['Figma', 'UI/UX', 'Mobile Design', 'Prototyping'],
        7
      ),
      new Job(
        'job3',
        'Data Analysis & Visualization',
        'Seeking a data analyst to process customer data and create interactive dashboards. Python and D3.js experience preferred.',
        JobCategory.DATA,
        '$2000 - $3000',
        '6 weeks',
        'client1',
        'Tech Startup Inc',
        JobStatus.OPEN,
        new Date('2026-01-25'),
        ['Python', 'D3.js', 'Data Analysis', 'SQL'],
        2
      ),
      new Job(
        'job4',
        'Content Writing - Tech Blog',
        'Need technical writer to create engaging blog posts about web development trends. SEO knowledge is a plus.',
        JobCategory.WRITING,
        '$500 - $1000',
        '2 weeks',
        'client3',
        'ContentHub',
        JobStatus.OPEN,
        new Date('2026-01-28'),
        ['Technical Writing', 'SEO', 'Web Development'],
        5
      ),
    ];

    sampleJobs.forEach(job => {
      this.jobs.set(job.id, job);
      this.applications.set(job.id, []);
    });
  }

  async getAll(): Promise<Job[]> {
    return Array.from(this.jobs.values()).sort((a, b) =>
      b.postedAt.getTime() - a.postedAt.getTime()
    );
  }

  async getById(id: string): Promise<Job | null> {
    return this.jobs.get(id) || null;
  }

  async getByPostedBy(userId: string): Promise<Job[]> {
    return Array.from(this.jobs.values())
      .filter(job => job.postedBy === userId)
      .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
  }

  async save(job: Job): Promise<void> {
    this.jobs.set(job.id, job);
    if (!this.applications.has(job.id)) {
      this.applications.set(job.id, []);
    }
  }

  async applyForJob(jobId: string, freelancerId: string): Promise<void> {
    const applicants = this.applications.get(jobId) || [];
    if (!applicants.includes(freelancerId)) {
      applicants.push(freelancerId);
      this.applications.set(jobId, applicants);

      const job = this.jobs.get(jobId);
      if (job) {
        const updatedJob = new Job(
          job.id,
          job.title,
          job.description,
          job.category,
          job.budget,
          job.duration,
          job.postedBy,
          job.postedByName,
          job.status,
          job.postedAt,
          job.skills,
          applicants.length
        );
        this.jobs.set(jobId, updatedJob);
      }
    }
  }
}
