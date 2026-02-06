<script lang="ts">
  import type { Snippet } from 'svelte';

  let { 
    children, 
    onclick, 
    variant = 'primary',
    type = 'button',
    disabled = false
  } = $props<{
    children: Snippet;
    onclick?: (e: MouseEvent) => void;
    variant?: 'primary' | 'secondary' | 'outline';
    type?: 'button' | 'submit';
    disabled?: boolean;
  }>();
</script>

<button 
  {type}
  {onclick} 
  {disabled}
  class="btn {variant}"
>
  {@render children()}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.625rem 1.25rem;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
    font-size: 0.875rem;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .primary {
    background: var(--accent);
    color: white;
  }

  .primary:hover:not(:disabled) {
    background: var(--accent-hover);
  }

  .secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }

  .outline {
    background: transparent;
    border-color: var(--border);
    color: var(--text-primary);
  }

  .outline:hover:not(:disabled) {
    background: var(--bg-secondary);
  }
</style>
