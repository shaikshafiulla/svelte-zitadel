import type { Job } from '../entities/Job';

export interface IJobRepository {
  getAll(): Promise<Job[]>;
  getById(id: string): Promise<Job | null>;
  getByPostedBy(userId: string): Promise<Job[]>;
  save(job: Job): Promise<void>;
  applyForJob(jobId: string, freelancerId: string): Promise<void>;
}
