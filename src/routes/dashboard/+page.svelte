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
    gap: 2.5rem;
  }

  .workspace-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
  }

  .workspace-header h1 {
    font-size: 1.875rem;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: var(--text-secondary);
    font-size: 0.9375rem;
  }

  .role-selector {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--border);
    min-width: 200px;
  }

  .role-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.9rem;
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
    padding: 0.5rem 1rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--accent);
    color: white;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.8rem;
    transition: all 0.2s;
    width: 100%;
  }

  .toggle-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .section h2 {
    font-size: 1.25rem;
    font-weight: 700;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn-primary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-primary:hover {
    opacity: 0.9;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 8px;
    min-width: 300px;
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
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .stat-card {
    text-align: center;
  }

  .stat-content {
    padding: 1rem;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent);
    margin-bottom: 0.5rem;
  }

  .stat-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .success-message {
    padding: 1rem;
    background: #dcfce7;
    color: #166534;
    border-radius: 8px;
    font-weight: 500;
  }

  .error-message {
    padding: 1rem;
    background: #fee2e2;
    color: #991b1b;
    border-radius: 8px;
    font-weight: 500;
  }

  .loading-section {
    text-align: center;
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    .workspace-header {
      flex-direction: column;
      align-items: stretch;
    }

    .role-selector {
      min-width: 100%;
    }

    .search-box {
      min-width: 100%;
    }

    .section-header {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
