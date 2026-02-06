<script lang="ts">
  import JobCard from './JobCard.svelte';
  import type { Job } from '../../../core/domain/entities/Job';

  let { jobs, showApplyButton = false, emptyMessage = 'No jobs available' } = $props<{
    jobs: Job[];
    showApplyButton?: boolean;
    emptyMessage?: string;
  }>();
</script>

<div class="job-list">
  {#if jobs.length === 0}
    <div class="empty-state">
      <p>{emptyMessage}</p>
    </div>
  {:else}
    {#each jobs as job (job.id)}
      <JobCard {job} {showApplyButton} />
    {/each}
  {/if}
</div>

<style>
  .job-list {
    display: grid;
    gap: 1.5rem;
  }

  .empty-state {
    padding: 3rem 2rem;
    text-align: center;
    color: var(--text-secondary);
    background: var(--bg-secondary);
    border-radius: 12px;
    border: 1px dashed var(--border);
  }

  .empty-state p {
    font-size: 1rem;
  }
</style>
