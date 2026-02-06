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
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .job-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .job-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
  }

  .job-title {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    color: var(--text-primary);
  }

  .job-meta {
    font-size: 0.8125rem;
    color: var(--text-secondary);
  }

  .category-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 12px;
    font-weight: 600;
    white-space: nowrap;
  }

  .job-description {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .job-details {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .job-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
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
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .apply-btn:hover:not(:disabled) {
    opacity: 0.9;
  }

  .apply-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
