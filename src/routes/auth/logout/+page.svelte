<script lang="ts">
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";

  onMount(() => {
    setTimeout(() => {
      document.querySelector("form")?.requestSubmit();
    }, 100);
  });
</script>

<!-- Fallback: Auto-submit form for logout -->
<div
  style="display: flex; align-items: center; justify-content: center; min-height: 100vh;"
>
  <form method="POST" use:enhance>
    <p>Logging out...</p>
    <noscript>
      <button type="submit">Click here if not redirected</button>
    </noscript>
  </form>
</div>
