export enum JobStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CLOSED = 'CLOSED'
}

export enum JobCategory {
  WEB_DEVELOPMENT = 'Web Development',
  MOBILE_DEVELOPMENT = 'Mobile Development',
  DESIGN = 'Design',
  WRITING = 'Writing',
  MARKETING = 'Marketing',
  DATA = 'Data & Analytics'
}

export class Job {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly category: JobCategory,
    public readonly budget: string,
    public readonly duration: string,
    public readonly postedBy: string,
    public readonly postedByName: string,
    public readonly status: JobStatus,
    public readonly postedAt: Date,
    public readonly skills: string[],
    public readonly applications: number = 0
  ) {}
}
