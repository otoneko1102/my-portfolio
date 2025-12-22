<script>
  import { aboutDetails } from "../../settings/config.js";
</script>

{#if aboutDetails && aboutDetails.length > 0}
  <div class="about-details">
    {#each aboutDetails as detail}
      <div class="detail-card">
        <h4 class="detail-label">{detail.label}</h4>
        <ul class="detail-values">
          {#each detail.values as value}
            <li>{value}</li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
{/if}

<style>
  .about-details {
    display: grid;
    /* Show up to 3 groups per row; any additional groups will wrap to the next line */
    grid-template-columns: repeat(3, minmax(200px, 1fr));
    gap: var(--spacing-lg);
    margin-top: var(--spacing-2xl);
  }

  .detail-card {
    padding: var(--spacing-lg);
    background-color: #ffffff;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-lg);
    transition: all var(--transition-normal);
  }

  .detail-card:hover {
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
    transform: translateY(-2px);
  }

  .detail-label {
    margin: 0 0 var(--spacing-sm) 0;
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--color-primary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .detail-values {
    margin: 0;
    padding-left: var(--spacing-md);
    list-style-type: disc;
  }

  .detail-values li {
    margin-bottom: var(--spacing-xs);
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .about-details {
      grid-template-columns: repeat(2, minmax(160px, 1fr));
    }
  }

  @media (max-width: 480px) {
    .about-details {
      grid-template-columns: 1fr;
    }

    .detail-label {
      font-size: var(--font-size-xs);
    }
  }
</style>
