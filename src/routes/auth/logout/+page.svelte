<script lang="ts">
  import { enhance } from '$app/forms';
</script>

<!-- Fallback: Auto-submit form for logout -->
<div style="display: flex; align-items: center; justify-content: center; min-height: 100vh;">
  <form method="POST" use:enhance>
    <p>Logging out...</p>
    <noscript>
      <button type="submit">Click here if not redirected</button>
    </noscript>
  </form>
</div>

<script>
  // Auto-submit on mount
  if (typeof window !== 'undefined') {
    document.querySelector('form')?.requestSubmit();
  }
</script>
