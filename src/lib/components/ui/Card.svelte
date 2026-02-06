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
    border-radius: 12px;
    box-shadow: var(--card-shadow);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .card-header {
    padding: 1.25rem;
    border-bottom: 1px solid var(--border);
    font-weight: 600;
  }

  .card-body {
    padding: 1.25rem;
    flex: 1;
  }

  .card-footer {
    padding: 1rem 1.25rem;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border);
  }
</style>
