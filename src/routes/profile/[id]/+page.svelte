<script lang="ts">
  import Card from "$lib/components/ui/Card.svelte";
  import {
    BadgeCheck,
    ExternalLink,
    Mail,
    Github,
    Shield,
  } from "lucide-svelte";

  let { data } = $props();
  let profile = $state(data.profile);
  let userRole = $state(profile.role || "FREELANCER");
  let toggleableRole = $derived(
    userRole === "FREELANCER" ? "CLIENT" : "FREELANCER",
  );
</script>

<div class="profile-container">
  <div class="sidebar">
    <Card class="user-card">
      <div class="user-info">
        <img src={profile.profileImage} alt={profile.name} class="avatar" />
        <h1>{profile.name}</h1>

        <div class="role-section">
          <div class="role-badge {userRole.toLowerCase()}">
            <Shield size={14} />
            {userRole}
          </div>
          <button
            type="button"
            class="toggle-role-btn"
            onclick={() => (userRole = toggleableRole)}
            title="Toggle between FREELANCER and CLIENT roles"
          >
            Switch to {toggleableRole}
          </button>
        </div>

        <p class="bio">{profile.bio}</p>

        <div class="contact-links">
          <a href="mailto:{profile.email}" class="link-btn">
            <Mail size={18} /> Email
          </a>
          {#if profile.email}
            <a href="https://github.com" class="link-btn">
              <Github size={18} /> GitHub
            </a>
          {/if}
        </div>
      </div>
    </Card>

    {#if profile.skills}
      <Card class="skills-card">
        {#snippet title()}Skills{/snippet}
        <div class="skills-grid">
          {#each profile.skills as skill}
            <span class="skill-tag">{skill}</span>
          {/each}
        </div>
      </Card>
    {/if}

    {#if profile.hourlyRate}
      <Card class="rate-card">
        {#snippet title()}Rate{/snippet}
        <div class="rate-info">
          <p class="rate-amount">${profile.hourlyRate}/hr</p>
          <p class="rate-label">Hourly Rate</p>
        </div>
      </Card>
    {/if}
  </div>

  <div class="main-content">
    {#if profile.completedProjects}
      <h2>Stats</h2>
      <div class="stats-grid">
        <Card class="stat-card">
          {#snippet title()}Completed Projects{/snippet}
          <p class="stat-value">{profile.completedProjects}</p>
        </Card>
        <Card class="stat-card">
          {#snippet title()}Rating{/snippet}
          <p class="stat-value">{profile.rating}/5.0</p>
        </Card>
      </div>
    {/if}

    {#if profile.projectsPosted}
      <h2>Projects Posted</h2>
      <Card>
        <p class="stat-value">{profile.projectsPosted}</p>
        <p class="stat-label">Total projects posted</p>
      </Card>
    {/if}
  </div>
</div>

<style>
  .profile-container {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 2rem;
    align-items: start;
    padding: 2rem;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .user-info {
    text-align: center;
  }

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 1rem;
    border: 4px solid var(--bg-secondary);
    object-fit: cover;
  }

  .role-section {
    margin: 1rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .role-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.85rem;
  }

  .role-badge.freelancer {
    background: #dbeafe;
    color: #0c4a6e;
  }

  .role-badge.client {
    background: #fce7f3;
    color: #831843;
  }

  .toggle-role-btn {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-secondary);
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s;
  }

  .toggle-role-btn:hover {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }

  .bio {
    color: var(--text-secondary);
    font-size: 0.9375rem;
    margin-bottom: 1.5rem;
  }

  .contact-links {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .link-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.875rem;
    transition: background 0.2s;
    text-decoration: none;
    color: inherit;
  }

  .link-btn:hover {
    background: var(--bg-secondary);
  }

  .skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .skill-tag {
    background: var(--bg-secondary);
    padding: 0.25rem 0.625rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid var(--border);
  }

  .rate-card {
    text-align: center;
  }

  .rate-info {
    padding: 1rem 0;
  }

  .rate-amount {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--accent);
    margin: 0;
  }

  .rate-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin: 0.5rem 0 0;
  }

  .main-content h2 {
    margin: 2rem 0 1.5rem;
    font-size: 1.25rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    text-align: center;
    padding: 1.5rem;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent);
    margin: 0.5rem 0 0;
  }

  .stat-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin: 0.5rem 0 0;
  }

  @media (max-width: 900px) {
    .profile-container {
      grid-template-columns: 1fr;
    }
    .sidebar {
      max-width: none;
    }
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
