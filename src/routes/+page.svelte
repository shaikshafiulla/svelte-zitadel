<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
    goto('/dashboard');
  });
</script>

<div class="loading-screen">
  <p>Loading SoloDev...</p>
</div>

<style>
  .loading-screen {
    height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    color: var(--text-secondary);
  }
</style>