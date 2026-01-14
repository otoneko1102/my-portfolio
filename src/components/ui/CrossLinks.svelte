<script>
  import {
    crossLinks,
    crossLinksConfig,
    sectionDescriptions,
  } from "../../settings/config.js";
  import { onMount, tick, onDestroy } from "svelte";

  import { fetchOGData } from "../../lib/og";

  let linkData = [];
  let isLoading = true;

  const loadCrossLinks = async () => {
    isLoading = true;
    const results = await Promise.all(
      crossLinks.map(async (link) => {
        const ogData = await fetchOGData(link.url);
        return {
          url: link.url,
          title: link.title || ogData.title,
          author: link.author,
          description: link.description || ogData.description,
          thumbnail: link.thumbnail || ogData.image,
          siteName: ogData.siteName,
          favicon: ogData.favicon,
        };
      })
    );
    linkData = results;
    isLoading = false;
  };

  onMount(() => {
    if (crossLinks.length > 0) {
      loadCrossLinks();
    } else {
      isLoading = false;
    }
  });

  let resizeTimeout;

  const adjustDescriptions = async () => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;
    await tick();
    const container = document.getElementById("crosslinks");
    if (!container) return;
    const nodes = container.querySelectorAll(".crosslink-description");

    nodes.forEach((el) => {
      if (!el.dataset.fulltext) el.dataset.fulltext = el.textContent || "";
      const fulltext = el.dataset.fulltext;

      const style = window.getComputedStyle(el);
      const lineHeightPx =
        parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.4;
      const maxHeight = lineHeightPx * 3;

      const measure = document.createElement("div");
      measure.style.position = "absolute";
      measure.style.visibility = "hidden";
      measure.style.pointerEvents = "none";
      measure.style.width = el.clientWidth + "px";
      measure.style.font = style.font;
      measure.style.fontSize = style.fontSize;
      measure.style.fontWeight = style.fontWeight;
      measure.style.lineHeight = style.lineHeight;
      measure.style.letterSpacing = style.letterSpacing;
      measure.style.whiteSpace = "normal";
      measure.style.wordBreak = "break-word";
      measure.style.padding = "0";
      measure.style.margin = "0";
      measure.textContent = fulltext;

      document.body.appendChild(measure);

      if (measure.scrollHeight <= maxHeight) {
        el.textContent = fulltext;
        el.removeAttribute("title");
        document.body.removeChild(measure);
        return;
      }

      let low = 0;
      let high = fulltext.length;
      let best = 0;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        measure.textContent = fulltext.slice(0, mid) + "…";
        if (measure.scrollHeight <= maxHeight) {
          best = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      let truncated = fulltext.slice(0, best);
      const lastSpace = truncated.lastIndexOf(" ");
      if (lastSpace > Math.floor(best * 0.6)) {
        truncated = truncated.slice(0, lastSpace);
      }

      el.textContent = truncated + "…";
      el.setAttribute("title", fulltext);

      document.body.removeChild(measure);
    });
  };

  $: if (!isLoading && linkData.length) {
    adjustDescriptions();
  }

  const onResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(adjustDescriptions, 120);
  };

  let ro;

  onMount(() => {
    const container = document.getElementById("crosslinks");
    if (typeof window !== "undefined") {
      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(() => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(adjustDescriptions, 120);
        });
        if (container) ro.observe(container);
      }
      window.addEventListener("resize", onResize);
    }
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", onResize);
    }
    if (ro) ro.disconnect();
    clearTimeout(resizeTimeout);
  });
</script>

<section id="crosslinks" class="crosslinks-section">
  <div class="container">
    <h2 class="crosslinks-title section-title">Cross Links</h2>
    <p class="section-subtitle">{sectionDescriptions.crossLinks}</p>

    <div class="crosslinks-apply">
      <p class="apply-description">
        {crossLinksConfig.applyDescription}
      </p>
      <a
        href={`https://twitter.com/messages/compose?recipient_id=${crossLinksConfig.twitterUsername}&text=${encodeURIComponent(crossLinksConfig.applyMessageTemplate)}`}
        target="_blank"
        rel="noopener noreferrer"
        class="apply-button"
        data-no-preview
      >
        <iconify-icon icon="logos:twitter" width="20" height="20"
        ></iconify-icon>
        {crossLinksConfig.applyButtonText}
      </a>

      {#if crossLinksConfig.requirementsHtml}
        <div class="apply-requirements" aria-live="polite">
          <h3 class="requirements-title">要件</h3>
          <div class="requirements-content">
            {@html crossLinksConfig.requirementsHtml}
          </div>
        </div>
      {/if}
    </div>

    {#if isLoading}
      <div class="loading">
        <div class="spinner"></div>
        <p>Loading links...</p>
      </div>
    {:else if linkData.length > 0}
      <div class="crosslinks-grid">
        {#each linkData as link}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            class="crosslink-card"
            data-no-preview
          >
            <div class="crosslink-thumbnail">
              {#if link.thumbnail}
                <img
                  src={link.thumbnail}
                  alt={link.title}
                  on:error={(e) => (e.target.style.display = "none")}
                />
              {/if}
            </div>
            <div class="crosslink-content">
              <div class="crosslink-header">
                <img
                  src={link.favicon}
                  alt=""
                  class="crosslink-favicon"
                  on:error={(e) => (e.target.style.display = "none")}
                />
                <span class="crosslink-sitename">{link.siteName}</span>
              </div>
              <h3 class="crosslink-title">{link.title}</h3>
              <p class="crosslink-author">
                {link.author ? "by " + link.author : ""}
              </p>
              {#if link.description}
                <p class="crosslink-description">{link.description}</p>
              {/if}
              <div class="crosslink-url">{link.url}</div>
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <div class="no-links">
        <p>まだ相互リンクはありません</p>
      </div>
    {/if}
  </div>
</section>

<style>
  .crosslinks-section {
    background-color: var(--color-background);
    padding: var(--spacing-4xl) var(--spacing-xl);
    margin-bottom: var(--spacing-3xl);
    width: 100%;
    overflow-x: hidden;

    --cl-title-size: 1rem;
    --cl-title-line-height: 1.4;
    --cl-author-size: var(--font-size-sm);
    --cl-author-line-height: 1.5;
    --cl-desc-size: var(--font-size-sm);
    --cl-desc-line-height: 1.5;

    --cl-title-height: calc(
      var(--cl-title-size) * var(--cl-title-line-height) * 2
    );
    --cl-author-height: calc(
      var(--cl-author-size) * var(--cl-author-line-height) * 1
    );
    --cl-desc-height: calc(
      var(--cl-desc-size) * var(--cl-desc-line-height) * 3
    );
  }

  .crosslinks-title {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
    color: var(--color-primary);
    font-size: var(--font-size-4xl);
  }

  .crosslinks-apply {
    text-align: center;
    margin-bottom: var(--spacing-3xl);
    padding: var(--spacing-xl);
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--color-border);
  }

  .apply-description {
    margin: 0 0 var(--spacing-lg) 0;
    color: var(--color-text);
    font-size: var(--font-size-base);
  }

  .apply-button {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-xl);
    background: linear-gradient(45deg, #1da1f2, #0d8bd9);
    color: #ffffff;
    text-decoration: none;
    border-radius: var(--border-radius-md);
    font-weight: 600;
    font-size: var(--font-size-base);
    transition: all var(--transition-normal);
    box-shadow: var(--shadow-md);
  }

  .apply-button:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    background: linear-gradient(45deg, #0d8bd9, #0a6fb8);
  }

  .apply-requirements {
    margin-top: var(--spacing-md);
    text-align: left;
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    border: 1px dashed var(--color-border);
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.01) 0%,
      rgba(255, 255, 255, 0.01) 100%
    );
  }

  .requirements-title {
    margin: 0 0 var(--spacing-sm) 0;
    font-size: var(--font-size-sm);
    color: var(--color-accent);
    font-weight: 600;
  }

  .requirements-content {
    font-size: var(--font-size-base);
    color: var(--color-text);
    line-height: 1.6;
  }

  :global(.apply-requirements ul) {
    margin: 0.5rem 0 0 1.25rem;
  }

  :global(.apply-requirements li) {
    margin: 0.25rem 0;
  }

  .no-links {
    text-align: center;
    padding: var(--spacing-3xl);
    color: var(--color-text-light);
    font-size: var(--font-size-base);
  }

  .no-links p {
    margin: 0;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 3rem;
    color: #94a3b8;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #334155;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .crosslinks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-xl);
    max-width: 1200px;
    margin: 0 auto;
    align-items: stretch;
    grid-auto-rows: 1fr;
  }

  .crosslink-card {
    display: flex;
    flex-direction: column;
    background: white;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    transition: all var(--transition-normal);
    text-decoration: none;
    color: inherit;
    box-shadow: var(--shadow-sm);
    height: 100%;
  }

  .crosslink-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
  }

  .crosslink-thumbnail {
    width: 100%;
    height: 160px;
    overflow: hidden;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .crosslink-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .crosslink-content {
    padding: var(--spacing-lg);
    display: grid;
    grid-template-rows:
      auto var(--cl-title-height) var(--cl-author-height) var(--cl-desc-height)
      auto;
    gap: var(--spacing-sm);
    flex: 1;
  }

  .crosslink-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);

    white-space: nowrap;
    overflow: hidden;
  }

  .crosslink-favicon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  .crosslink-sitename {
    font-size: var(--font-size-xs);
    color: var(--color-text-light);
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .crosslink-title {
    font-size: var(--cl-title-size);
    font-weight: 600;
    color: var(--color-primary);
    margin: 0;
    line-height: var(--cl-title-line-height);
    height: var(--cl-title-height);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .crosslink-author {
    font-size: var(--cl-author-size);
    color: var(--color-accent);
    font-weight: 500;
    margin: 0;
    height: var(--cl-author-height);
    line-height: var(--cl-author-line-height);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .crosslink-description {
    font-size: var(--cl-desc-size);
    color: var(--color-text-light);
    line-height: var(--cl-desc-line-height);
    height: var(--cl-desc-height);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
  }

  .crosslink-url {
    font-size: var(--font-size-xs);
    color: var(--color-text-light);
    font-family: "Courier New", monospace;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: auto;
    padding-top: var(--spacing-sm);
    border-top: 1px solid var(--color-border);
  }

  @media (max-width: 768px) {
    .crosslinks-section {
      padding: var(--spacing-2xl) var(--spacing-lg);

      --cl-title-size: var(--font-size-base);
      --cl-title-line-height: 1.3;
      --cl-author-size: var(--font-size-xs);
      --cl-author-line-height: 1.4;
      --cl-desc-size: var(--font-size-xs);
      --cl-desc-line-height: 1.4;
      --cl-title-height: calc(
        var(--cl-title-size) * var(--cl-title-line-height) * 2
      );
      --cl-author-height: calc(
        var(--cl-author-size) * var(--cl-author-line-height) * 1
      );
      --cl-desc-height: calc(
        var(--cl-desc-size) * var(--cl-desc-line-height) * 3
      );
    }

    .crosslinks-title {
      font-size: var(--font-size-xl);
      margin-bottom: var(--spacing-lg);
    }

    .crosslinks-apply {
      padding: var(--spacing-lg);
      margin-bottom: var(--spacing-2xl);
    }

    .apply-description {
      font-size: var(--font-size-sm);
      margin-bottom: var(--spacing-md);
    }

    .apply-button {
      font-size: var(--font-size-sm);
      padding: var(--spacing-sm) var(--spacing-lg);
    }

    .crosslinks-grid {
      grid-template-columns: 1fr;
      gap: var(--spacing-lg);
    }

    .crosslink-thumbnail {
      height: 140px;
    }
  }

  @media (max-width: 480px) {
    .crosslinks-section {
      padding: var(--spacing-2xl) var(--spacing-md);
    }

    .crosslinks-title {
      font-size: var(--font-size-xl);
      margin-bottom: var(--spacing-md);
    }

    .crosslinks-apply {
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .apply-description {
      font-size: var(--font-size-xs);
      margin-bottom: var(--spacing-sm);
    }

    .apply-button {
      font-size: var(--font-size-xs);
      padding: var(--spacing-xs) var(--spacing-md);
    }

    .apply-requirements {
      padding: var(--spacing-sm);
      font-size: var(--font-size-xs);
    }

    .crosslink-content {
      padding: var(--spacing-md);
    }

    .crosslink-thumbnail {
      height: 120px;
    }
  }
</style>
