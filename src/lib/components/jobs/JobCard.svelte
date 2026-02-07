<script lang="ts">
  import { Briefcase, DollarSign, Clock, Users, Tag } from 'lucide-svelte';
  import { enhance } from '$app/forms';
  import Card from '../ui/Card.svelte';
  import type { Job } from '../../../core/domain/entities/Job';

  let { job, showApplyButton = false } = $props<{
    job: Job;
    showApplyButton?: boolean;
  }>();

  let isApplying = $state(false);

  function formatDate(date: Date | string) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }
</script>

<Card class="job-card">
  <div class="job-header">
    <div>
      <h3 class="job-title">{job.title}</h3>
      <p class="job-meta">Posted by {job.postedByName} · {formatDate(job.postedAt)}</p>
    </div>
    <span class="category-badge">{job.category}</span>
  </div>

  <p class="job-description">{job.description}</p>

  <div class="job-details">
    <div class="detail-item">
      <DollarSign size={16} />
      <span>{job.budget}</span>
    </div>
    <div class="detail-item">
      <Clock size={16} />
      <span>{job.duration}</span>
    </div>
    <div class="detail-item">
      <Users size={16} />
      <span>{job.applications} applicants</span>
    </div>
  </div>

  <div class="job-skills">
    {#each job.skills as skill}
      <span class="skill-tag">
        <Tag size={12} />
        {skill}
      </span>
    {/each}
  </div>

  {#if showApplyButton}
    <form
      method="POST"
      action="?/applyForJob"
      use:enhance={() => {
        isApplying = true;
        return async ({ result, update }) => {
          await update();
          isApplying = false;
        };
      }}
    >
      <input type="hidden" name="jobId" value={job.id} />
      <button type="submit" class="apply-btn" disabled={isApplying}>
        <Briefcase size={18} />
        {isApplying ? 'Applying...' : 'Apply for this Job'}
      </button>
    </form>
  {/if}
</Card>

<style>
  .job-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .job-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--card-shadow-hover);
  }

  .job-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-md);
    gap: var(--spacing-md);
  }

  .job-title {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: var(--spacing-xs);
    color: var(--text-primary);
    line-height: 1.3;
  }

  .job-meta {
    font-size: 0.8125rem;
    color: var(--text-secondary);
  }

  .category-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    background: var(--accent-light);
    color: var(--accent);
    border: 1px solid var(--accent);
    border-radius: 12px;
    font-weight: 600;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .job-description {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: var(--spacing-md);
    font-size: 0.9375rem;
  }

  .job-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .job-skills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }

  .skill-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    padding: 0.25rem 0.625rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text-secondary);
    font-weight: 500;
  }

  form {
    width: 100%;
  }

  .apply-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: 0.75rem var(--spacing-md);
    background: var(--accent);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .apply-btn:hover:not(:disabled) {
    background: var(--accent-hover);
  }

  .apply-btn:active:not(:disabled) {
    transform: scale(0.98);
  }

  .apply-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Responsive design */
  @media (max-width: 640px) {
    .job-header {
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .category-badge {
      align-self: flex-start;
    }

    .job-title {
      font-size: 1rem;
    }

    .job-details {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-sm);
    }
  }

  @media (max-width: 480px) {
    .job-details {
      grid-template-columns: 1fr;
    }
  }
</style>
