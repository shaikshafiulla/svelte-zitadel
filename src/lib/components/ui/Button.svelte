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
    gap: var(--spacing-sm);
    padding: 0.625rem 1.25rem;
    font-weight: 600;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
    font-size: 0.875rem;
    font-family: inherit;
    white-space: nowrap;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn:active:not(:disabled) {
    transform: scale(0.98);
  }

  .primary {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }

  .primary:hover:not(:disabled) {
    background: var(--accent-hover);
    border-color: var(--accent-hover);
  }

  .secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-color: var(--border);
  }

  .secondary:hover:not(:disabled) {
    background: var(--border);
  }

  .outline {
    background: transparent;
    border-color: var(--border);
    color: var(--text-primary);
  }

  .outline:hover:not(:disabled) {
    background: var(--bg-secondary);
    border-color: var(--accent);
    color: var(--accent);
  }

  /* Mobile responsiveness */
  @media (max-width: 640px) {
    .btn {
      padding: 0.5rem 1rem;
      font-size: 0.8125rem;
    }
  }

  @media (max-width: 480px) {
    .btn {
      width: 100%;
    }
  }
</style>
