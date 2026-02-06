<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import { BadgeCheck, ExternalLink, Mail, Github } from 'lucide-svelte';

  let { data } = $props();
  let profile = $derived(data.profile);
</script>

<div class="profile-container">
  <div class="sidebar">
    <Card class="user-card">
      <div class="user-info">
        <img src={profile.user.avatarUrl} alt={profile.user.name} class="avatar" />
        <h1>{profile.user.name}</h1>
        {#if profile.user.isAvailable}
          <div class="status-badge available">
            <BadgeCheck size={16} />
            Available for work
          </div>
        {/if}
        <p class="bio">{profile.user.bio}</p>
        
        <div class="contact-links">
          <a href="mailto:john@example.com" class="link-btn">
            <Mail size={18} /> Email
          </a>
          <a href="https://github.com" class="link-btn">
            <Github size={18} /> GitHub
          </a>
        </div>
      </div>
    </Card>

    <Card class="skills-card">
      {#snippet title()}Skills{/snippet}
      <div class="skills-grid">
        {#each profile.user.skills as skill}
          <span class="skill-tag">{skill}</span>
        {/each}
      </div>
    </Card>
  </div>

  <div class="main-content">
    <h2>Projects</h2>
    <div class="projects-grid">
      {#each profile.projects as project}
        <Card class="project-card">
          {#snippet title()}
            <div class="project-header">
              {project.title}
              <span class="status {project.status.toLowerCase()}">{project.status}</span>
            </div>
          {/snippet}
          
          <p>{project.description}</p>
          
          {#snippet footer()}
            <div class="project-footer">
              <span class="client">{project.clientName}</span>
              <button type="button" class="view-link">View Project <ExternalLink size={14} /></button>
            </div>
          {/snippet}
        </Card>
      {/each}
    </div>
  </div>
</div>

<style>
  .profile-container {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 2rem;
    align-items: start;
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
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    margin: 0.5rem 0 1rem;
  }

  .available {
    background: #dcfce7;
    color: #166534;
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

  .main-content h2 {
    margin-bottom: 1.5rem;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .status {
    font-size: 0.7rem;
    padding: 0.125rem 0.5rem;
    border-radius: 12px;
    text-transform: uppercase;
    font-weight: 700;
  }

  .status.completed { background: #dcfce7; color: #166534; }
  .status.in_progress { background: #fef9c3; color: #854d0e; }
  .status.pending { background: #f1f5f9; color: #475569; }

  .project-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8125rem;
  }

  .client {
    color: var(--text-secondary);
    font-weight: 500;
  }

  .view-link {
    color: var(--accent);
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-weight: 600;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-size: inherit;
  }

  @media (max-width: 900px) {
    .profile-container {
      grid-template-columns: 1fr;
    }
    .sidebar {
      max-width: none;
    }
  }
</style>
