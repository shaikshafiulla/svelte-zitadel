<script lang="ts">
  import { enhance } from '$app/forms';
  import { Send } from 'lucide-svelte';
  import Card from '../ui/Card.svelte';

  let { categories, onCancel } = $props<{
    categories: string[];
    onCancel?: () => void;
  }>();

  let isSubmitting = $state(false);
</script>

<Card>
  <form
    method="POST"
    action="?/postJob"
    use:enhance={() => {
      isSubmitting = true;
      return async ({ result, update }) => {
        await update();
        isSubmitting = false;
        if (result.type === 'success') {
          onCancel?.();
        }
      };
    }}
    class="job-form"
  >
    <h3 class="form-title">Post a New Job</h3>

    <div class="form-group">
      <label for="title">Job Title *</label>
      <input
        type="text"
        id="title"
        name="title"
        required
        placeholder="e.g., SvelteKit Developer Needed"
      />
    </div>

    <div class="form-group">
      <label for="description">Description *</label>
      <textarea
        id="description"
        name="description"
        required
        rows="4"
        placeholder="Describe the job requirements, expectations, and deliverables..."
      ></textarea>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="category">Category *</label>
        <select id="category" name="category" required>
          <option value="">Select category</option>
          {#each categories as category}
            <option value={category}>{category}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label for="budget">Budget *</label>
        <input
          type="text"
          id="budget"
          name="budget"
          required
          placeholder="e.g., $1000 - $2000"
        />
      </div>

      <div class="form-group">
        <label for="duration">Duration *</label>
        <input
          type="text"
          id="duration"
          name="duration"
          required
          placeholder="e.g., 2-3 weeks"
        />
      </div>
    </div>

    <div class="form-group">
      <label for="skills">Required Skills (comma-separated) *</label>
      <input
        type="text"
        id="skills"
        name="skills"
        required
        placeholder="e.g., SvelteKit, TypeScript, Tailwind CSS"
      />
    </div>

    <div class="form-actions">
      {#if onCancel}
        <button type="button" class="btn-secondary" onclick={onCancel}>
          Cancel
        </button>
      {/if}
      <button type="submit" class="btn-primary" disabled={isSubmitting}>
        <Send size={18} />
        {isSubmitting ? 'Posting...' : 'Post Job'}
      </button>
    </div>
  </form>
</Card>

<style>
  .job-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  input,
  textarea,
  select {
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 0.9375rem;
    font-family: inherit;
    transition: border-color 0.2s;
  }

  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: var(--accent);
  }

  textarea {
    resize: vertical;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .btn-primary,
  .btn-secondary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-primary {
    background: var(--accent);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    opacity: 0.9;
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border);
  }

  .btn-secondary:hover {
    background: var(--bg-primary);
  }
</style>
