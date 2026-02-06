<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import { User, LayoutDashboard, Moon, Sun, Monitor, LogIn, LogOut, Download } from 'lucide-svelte';
  import { page } from '$app/state';
  import { enhance } from '$app/forms';

  let { children } = $props<{ children: Snippet }>();

  let theme = $state('light');
  let session = $derived(page.data.session);
  let deferredPrompt = $state<any>(null);
  let showInstallButton = $state(false);

  onMount(() => {
    theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      showInstallButton = true;
    });

    // Hide button if app is already installed
    window.addEventListener('appinstalled', () => {
      showInstallButton = false;
      deferredPrompt = null;
    });
  });

  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  async function installApp() {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    deferredPrompt = null;
    showInstallButton = false;
  }
</script>

<div class="app-shell">
  <nav class="navbar">
    <div class="nav-content">
      <div class="logo">
        <Monitor size={24} />
        <span>SoloDev</span>
      </div>
      
      <div class="nav-links">
        <a href="/dashboard" class="nav-link">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </a>
        {#if session}
          <a href="/profile/{session.userId}" class="nav-link">
            <User size={20} />
            <span>Profile</span>
          </a>
        {/if}
      </div>

      <div class="nav-actions">
        {#if session}
          <div class="user-badge">
            <span class="role-tag">{session.roles[0] || 'User'}</span>
            <span class="user-name">{session.name}</span>
          </div>
          <form method="POST" action="/auth/logout" use:enhance style="display: inline;">
            <button type="submit" class="logout-btn" title="Logout">
              <LogOut size={18} />
            </button>
          </form>
        {:else}
          <a href="/auth/login" class="login-btn">
            <LogIn size={18} />
            <span>Login</span>
          </a>
        {/if}

        {#if showInstallButton}
          <button onclick={installApp} class="install-btn" title="Install App">
            <Download size={18} />
          </button>
        {/if}

        <button onclick={toggleTheme} class="theme-toggle" aria-label="Toggle theme">
          {#if theme === 'light'}
            <Moon size={20} />
          {:else}
            <Sun size={20} />
          {/if}
        </button>
      </div>
    </div>
  </nav>

  <main class="content">
    {@render children()}
  </main>
</div>

<style>
  .app-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .navbar {
    height: 64px;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-content {
    max-width: 1200px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
    gap: 2rem;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 800;
    font-size: 1.25rem;
    color: var(--accent);
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;
    flex: 1;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    color: var(--text-secondary);
    transition: color 0.2s;
  }

  .nav-link:hover {
    color: var(--accent);
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-badge {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--border);
    border-radius: 20px;
    background: var(--bg-secondary);
  }

  .user-name {
    font-size: 0.875rem;
    font-weight: 600;
  }

  .role-tag {
    font-size: 0.65rem;
    background: var(--accent);
    color: white;
    padding: 0.125rem 0.5rem;
    border-radius: 10px;
    text-transform: uppercase;
    font-weight: 800;
  }

  .login-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--accent);
    color: white;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .logout-btn {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-secondary);
    border-radius: 8px;
    transition: all 0.2s;
    cursor: pointer;
    font-family: inherit;
  }

  .logout-btn:hover {
    background: var(--bg-secondary);
    color: var(--accent);
    border-color: var(--accent);
  }

  .install-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .install-btn:hover {
    opacity: 0.9;
  }

  .theme-toggle {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background 0.2s;
  }

  .theme-toggle:hover {
    background: var(--bg-secondary);
    color: var(--accent);
  }

  .content {
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding: 2rem 1.5rem;
  }

  @media (max-width: 640px) {
    .nav-content {
      gap: 1rem;
    }
    .logo span, .nav-link span {
      display: none;
    }
  }
</style>
