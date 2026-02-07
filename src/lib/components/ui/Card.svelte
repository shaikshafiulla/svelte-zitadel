<script lang="ts">
  import type { Snippet } from 'svelte';

  let { 
    children, 
    title, 
    footer,
    class: className = '' 
  } = $props<{
    children: Snippet;
    title?: Snippet;
    footer?: Snippet;
    class?: string;
  }>();
</script>

<div class="card {className}">
  {#if title}
    <div class="card-header">
      {@render title()}
    </div>
  {/if}

  <div class="card-body">
    {@render children()}
  </div>

  {#if footer}
    <div class="card-footer">
      {@render footer()}
    </div>
  {/if}
</div>

<style>
  .card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--card-shadow);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }

  .card:hover {
    box-shadow: var(--card-shadow-hover);
  }

  .card-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border);
    font-weight: 600;
  }

  .card-body {
    padding: var(--spacing-lg);
    flex: 1;
  }

  .card-footer {
    padding: var(--spacing-lg);
    background: var(--bg-secondary);
    border-top: 1px solid var(--border);
  }

  /* Responsive padding */
  @media (max-width: 768px) {
    .card-header {
      padding: var(--spacing-md);
    }

    .card-body {
      padding: var(--spacing-md);
    }

    .card-footer {
      padding: var(--spacing-md);
    }
  }

  @media (max-width: 480px) {
    .card {
      border-radius: var(--radius-md);
    }

    .card-header {
      padding: var(--spacing-md);
    }

    .card-body {
      padding: var(--spacing-md);
    }

    .card-footer {
      padding: var(--spacing-md);
    }
  }
</style>
