<script>
  import { crossLinks, crossLinksConfig } from "../../settings/config.js";
  import { onMount } from "svelte";

  let linkData = [];
  let isLoading = true;
  let cache = new Map();

  const extractOGData = (html, url) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const getMetaContent = (property, attribute = "property") => {
      const meta = doc.querySelector(`meta[${attribute}="${property}"]`);
      return meta ? meta.getAttribute("content") : null;
    };

    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace(/^www\./, "");

    return {
      title:
        getMetaContent("og:title") ||
        getMetaContent("twitter:title") ||
        doc.querySelector("title")?.textContent ||
        domain,
      description:
        getMetaContent("og:description") ||
        getMetaContent("twitter:description") ||
        getMetaContent("description", "name") ||
        "",
      image:
        getMetaContent("og:image") || getMetaContent("twitter:image") || null,
      siteName: getMetaContent("og:site_name") || domain,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
    };
  };

  const fetchWithTimeout = async (url, timeout = 3000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: "GET",
        cache: "force-cache",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  const fetchWithRetry = async (url, maxRetries = 2) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, i * 200));
        }
        const response = await fetchWithTimeout(url, 3000);
        if (response.ok) {
          return await response.text();
        }
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        continue;
      }
    }
    throw new Error("Max retries exceeded");
  };

  const fetchOGData = async (url) => {
    if (cache.has(url)) {
      return cache.get(url);
    }

    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace(/^www\./, "");

    try {
      const proxies = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
      ];

      let html = null;
      for (const proxyUrl of proxies) {
        try {
          html = await fetchWithRetry(proxyUrl, 2);
          if (html) break;
        } catch (e) {
          continue;
        }
      }

      if (html) {
        const data = extractOGData(html, url);
        cache.set(url, data);
        return data;
      }

      throw new Error("All proxies failed");
    } catch (error) {
      const fallbackData = {
        title: domain,
        description: url,
        image: null,
        siteName: domain,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      };
      cache.set(url, fallbackData);
      return fallbackData;
    }
  };

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
</script>

<section id="crosslinks" class="crosslinks-section">
  <div class="container">
    <h2 class="crosslinks-title">Cross Links</h2>

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
            {#if link.thumbnail}
              <div class="crosslink-thumbnail">
                <img
                  src={link.thumbnail}
                  alt={link.title}
                  on:error={(e) => (e.target.style.display = "none")}
                />
              </div>
            {/if}
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
              {#if link.author}
                <p class="crosslink-author">by {link.author}</p>
              {/if}
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
    gap: var(--spacing-md);
    padding: var(--spacing-3xl);
    color: var(--color-text-light);
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .crosslinks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-xl);
    max-width: 1200px;
    margin: 0 auto;
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
  }

  .crosslink-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .crosslink-content {
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    flex: 1;
  }

  .crosslink-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
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
  }

  .crosslink-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-primary);
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .crosslink-author {
    font-size: var(--font-size-sm);
    color: var(--color-accent);
    font-weight: 500;
    margin: 0;
  }

  .crosslink-description {
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }

  .crosslink-url {
    font-size: var(--font-size-xs);
    color: var(--color-text-light);
    font-family: "Courier New", monospace;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-top: var(--spacing-sm);
    border-top: 1px solid var(--color-border);
  }

  @media (max-width: 768px) {
    .crosslinks-section {
      padding: var(--spacing-2xl) var(--spacing-lg);
    }

    .crosslinks-title {
      font-size: var(--font-size-2xl);
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

    .crosslink-content {
      padding: var(--spacing-md);
    }

    .crosslink-thumbnail {
      height: 120px;
    }
  }
</style>
