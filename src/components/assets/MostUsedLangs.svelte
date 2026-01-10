<script>
  export let languages = [];
</script>

<div class="language-block">
  <div class="language-header">
    <h4 class="language-title">Most Used Languages</h4>
  </div>

  {#if !languages || languages.length === 0}
    <div class="empty">No language data found.</div>
  {:else}
    <div class="language-bar" role="img" aria-label="Language usage bar">
      {#each languages as lang}
        <div
          class="bar-segment"
          style={`width: ${lang.percentage}%; background-color: ${lang.color || "#8b8b8b"};`}
          title="{lang.name}: {lang.percentage}%"
        ></div>
      {/each}
    </div>

    <ul class="language-list">
      {#each languages as lang}
        <li class="language-item">
          <span
            class="color-dot"
            style={`background-color: ${lang.color || "#8b8b8b"};`}
            aria-hidden="true"
          ></span>
          <span class="lang-name">{lang.name}</span>
          <span class="lang-percent">{lang.percentage}%</span>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .language-block {
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 1.5rem;
    background: #0f172a;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.12);
  }

  .language-header {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    align-items: baseline;
    margin-bottom: 1rem;
  }

  .language-title {
    margin: 0;
    font-size: 1.125rem;
    color: #f1f5f9;
  }

  .empty {
    text-align: center;
    padding: 1.5rem;
    color: #94a3b8;
  }

  .language-bar {
    display: flex;
    height: 12px;
    border-radius: 9999px;
    overflow: hidden;
    margin-bottom: 2rem;
    background-color: #334155;
    width: 100%;
  }

  .bar-segment {
    height: 100%;
    transition: width 0.3s ease;
  }

  .language-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.5rem 1rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .language-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    color: #f1f5f9;
  }

  .color-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .lang-name {
    font-weight: 500;
  }
  .lang-percent {
    color: #94a3b8;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .language-list {
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 0.375rem 0.75rem;
    }
  }

  @media (max-width: 480px) {
    .language-bar {
      height: 8px;
    }
    .color-dot {
      width: 10px;
      height: 10px;
    }
  }
</style>
