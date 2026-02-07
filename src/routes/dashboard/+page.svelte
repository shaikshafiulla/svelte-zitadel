<script lang="ts">
  import { Plus, Briefcase, Search as SearchIcon, Shield } from "lucide-svelte";
  import { page } from "$app/state";
  import { enhance } from "$app/forms";
  import JobCard from "$lib/components/jobs/JobCard.svelte";
  import JobList from "$lib/components/jobs/JobList.svelte";
  import JobForm from "$lib/components/jobs/JobForm.svelte";
  import Card from "$lib/components/ui/Card.svelte";

  let { data, form } = $props();

  let session = $derived(page.data.session);
  let currentRole = $state(session?.roles?.[0] || "FREELANCER");
  let isFreelancer = $derived(currentRole === "FREELANCER");
  let isClient = $derived(currentRole === "CLIENT");

  let showJobForm = $state(false);
  let searchQuery = $state("");

  function toggleRole() {
    currentRole = currentRole === "FREELANCER" ? "CLIENT" : "FREELANCER";
    showJobForm = false;
  }

  let filteredJobs = $derived(
    data.jobs.filter(
      (job: any) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some((skill: string) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    ),
  );
</script>

<div class="workspace">
  <header class="workspace-header">
    <div>
      <h1>Workspace</h1>
      <p class="subtitle">
        {#if isFreelancer}
          Browse and apply for jobs that match your skills
        {:else if isClient}
          Post jobs and manage your hiring needs
        {:else}
          Manage your work and collaborations
        {/if}
      </p>
    </div>

    <div class="role-selector">
      <div class="role-badge {currentRole.toLowerCase()}">
        <Shield size={16} />
        {currentRole}
      </div>
      <button class="toggle-btn" onclick={toggleRole} title="Toggle role">
        Switch to {currentRole === "FREELANCER" ? "CLIENT" : "FREELANCER"}
      </button>
    </div>
  </header>

  {#if form?.success}
    <div class="success-message">{form.message}</div>
  {/if}

  {#if form?.message && !form?.success}
    <div class="error-message">{form.message}</div>
  {/if}

  <!-- CLIENT VIEW -->
  {#if isClient}
    <div class="section">
      <div class="section-header">
        <h2>My Posted Jobs</h2>
        {#if !showJobForm}
          <button class="btn-primary" onclick={() => (showJobForm = true)}>
            <Plus size={18} />
            Post New Job
          </button>
        {/if}
      </div>

      {#if showJobForm}
        <JobForm
          categories={data.jobCategories}
          onCancel={() => (showJobForm = false)}
        />
      {:else}
        <JobList
          jobs={data.myPostedJobs}
          emptyMessage="You haven't posted any jobs yet. Click 'Post New Job' to get started!"
        />
      {/if}
    </div>

    <div class="section">
      <h2>All Available Jobs</h2>
      <JobList
        jobs={data.jobs}
        emptyMessage="No jobs available at the moment."
      />
    </div>
  {/if}

  <!-- FREELANCER VIEW -->
  {#if isFreelancer}
    <div class="section">
      <div class="section-header">
        <h2>Browse Jobs</h2>
        <div class="search-box">
          <SearchIcon size={18} />
          <input
            type="text"
            placeholder="Search by title, skills, or keywords..."
            bind:value={searchQuery}
          />
        </div>
      </div>

      <JobList
        jobs={filteredJobs}
        showApplyButton={true}
        emptyMessage="No jobs match your search. Try different keywords."
      />
    </div>

    {#await data.streamed.dashboard}
      <div class="section loading-section">
        <Card>
          <p>Loading your stats...</p>
        </Card>
      </div>
    {:then dashboard}
      <div class="section">
        <h2>My Performance</h2>
        <div class="stats-grid">
          <Card class="stat-card">
            <div class="stat-content">
              <div class="stat-value">$2,450</div>
              <div class="stat-label">Total Earnings</div>
            </div>
          </Card>
          <Card class="stat-card">
            <div class="stat-content">
              <div class="stat-value">3</div>
              <div class="stat-label">Active Projects</div>
            </div>
          </Card>
          <Card class="stat-card">
            <div class="stat-content">
              <div class="stat-value">12</div>
              <div class="stat-label">Completed</div>
            </div>
          </Card>
          <Card class="stat-card">
            <div class="stat-content">
              <div class="stat-value">95%</div>
              <div class="stat-label">Avg. Completion</div>
            </div>
          </Card>
        </div>
      </div>
    {/await}
  {/if}

  <!-- Fallback if no role detected -->
  {#if !isClient && !isFreelancer}
    <div class="section">
      <Card>
        <div style="padding: 2rem; text-align: center;">
          <h3>No Role Detected</h3>
          <p style="color: var(--text-secondary); margin-top: 1rem;">
            Your account doesn't have a role assigned. Please contact support.
          </p>
        </div>
      </Card>
    </div>
  {/if}
</div>

<style>
  .workspace {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .workspace-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
  }

  .workspace-header h1 {
    margin: 0;
    font-size: 2rem;
  }

  .workspace-header .subtitle {
    font-size: 0.9375rem;
    color: var(--text-secondary);
    margin: var(--spacing-xs) 0 0 0;
  }

  .role-selector {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
  }

  .role-badge {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 0.875rem;
    background: var(--accent-light);
    color: var(--accent);
  }

  .role-badge.freelancer {
    background: #dbeafe;
    color: #0c4a6e;
  }

  .role-badge.client {
    background: #fce7f3;
    color: #831843;
  }

  .toggle-btn {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--accent);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    white-space: nowrap;
  }

  .toggle-btn:hover {
    background: var(--accent-hover);
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .section h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }

  .btn-primary {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-lg);
    background: var(--accent);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: 0.9375rem;
    white-space: nowrap;
  }

  .btn-primary:hover {
    background: var(--accent-hover);
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    transition: border-color 0.2s ease;
  }

  .search-box:focus-within {
    border-color: var(--accent);
  }

  .search-box input {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--text-primary);
    font-size: 0.9375rem;
    outline: none;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--spacing-lg);
  }

  .stat-card {
    text-align: center;
    padding: var(--spacing-lg);
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    transition: box-shadow 0.2s ease;
  }

  .stat-card:hover {
    box-shadow: var(--card-shadow-hover);
  }

  .stat-content {
    padding: 0;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent);
    margin-bottom: var(--spacing-sm);
  }

  .stat-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .success-message {
    padding: var(--spacing-md);
    background: #dcfce7;
    color: #166534;
    border-radius: var(--radius-md);
    font-weight: 500;
    border-left: 4px solid #10b981;
  }

  .error-message {
    padding: var(--spacing-md);
    background: #fee2e2;
    color: #991b1b;
    border-radius: var(--radius-md);
    font-weight: 500;
    border-left: 4px solid #ef4444;
  }

  .loading-section {
    text-align: center;
    color: var(--text-secondary);
    padding: var(--spacing-xl);
  }

  /* Responsive design */
  @media (max-width: 1024px) {
    .workspace-header {
      gap: var(--spacing-lg);
    }

    .role-selector {
      width: 100%;
      justify-content: space-between;
    }
  }

  @media (max-width: 768px) {
    .workspace {
      gap: var(--spacing-lg);
    }

    .workspace-header {
      flex-direction: column;
      align-items: stretch;
      gap: var(--spacing-md);
    }

    .workspace-header h1 {
      font-size: 1.5rem;
    }

    .role-selector {
      width: 100%;
      flex-wrap: wrap;
    }

    .section-header {
      flex-direction: column;
      align-items: stretch;
    }

    .btn-primary {
      width: 100%;
      justify-content: center;
    }

    .search-box {
      width: 100%;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-md);
    }

    .stat-card {
      padding: var(--spacing-md);
    }

    .stat-value {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .workspace-header {
      gap: var(--spacing-sm);
    }

    .workspace-header h1 {
      font-size: 1.25rem;
    }

    .role-selector {
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .role-badge {
      width: 100%;
      justify-content: center;
    }

    .toggle-btn {
      width: 100%;
    }

    .section h2 {
      font-size: 1.25rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .stat-value {
      font-size: 1.5rem;
    }
  }
</style>
