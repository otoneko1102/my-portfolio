<script>
  import { onMount } from "svelte";

  let previewData = null;
  let isLoading = false;
  let showPreview = false;
  let previewPosition = { x: 0, y: 0 };
  let currentUrl = null;
  let previewTimeout = null;
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
      url: url,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
    };
  };

  const fetchWithTimeout = async (url, timeout = 8000) => {
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
        // 各リトライで少し遅延を入れる（200ms, 400ms...）
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, i * 200));
        }
        const response = await fetchWithTimeout(url, 8000);
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

  const fetchPreviewData = async (url) => {
    if (cache.has(url)) {
      return cache.get(url);
    }

    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace(/^www\./, "");

    try {
      // Try multiple CORS proxies with retry logic
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
      // Fallback to basic info from URL
      const fallbackData = {
        title: domain,
        description: url,
        image: null,
        siteName: domain,
        url: url,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
        isFallback: true,
      };
      cache.set(url, fallbackData);
      return fallbackData;
    }
  };

  const handleMouseEnter = async (event) => {
    const link = event.currentTarget;
    const url = link.href;

    if (
      !url ||
      url.startsWith("#") ||
      url.startsWith("mailto:") ||
      url.startsWith("tel:") ||
      link.hasAttribute("data-no-preview")
    ) {
      return;
    }

    currentUrl = url;

    clearTimeout(previewTimeout);
    previewTimeout = setTimeout(async () => {
      const rect = link.getBoundingClientRect();
      previewPosition = {
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      };

      showPreview = true;
      isLoading = true;

      const data = await fetchPreviewData(url);
      if (currentUrl === url) {
        previewData = data;
        isLoading = false;
      }
    }, 300);
  };

  const handleMouseLeave = () => {
    clearTimeout(previewTimeout);
    showPreview = false;
    isLoading = false;
    previewData = null;
    currentUrl = null;
  };

  const attachListeners = (link) => {
    // Remove title attribute
    link.removeAttribute("title");

    link.addEventListener("mouseenter", handleMouseEnter);
    link.addEventListener("mouseleave", handleMouseLeave);
  };

  const detachListeners = (link) => {
    link.removeEventListener("mouseenter", handleMouseEnter);
    link.removeEventListener("mouseleave", handleMouseLeave);
  };

  onMount(() => {
    const attachedLinks = new Set();

    const processLinks = () => {
      const links = document.querySelectorAll(
        'a[href]:not([data-no-preview]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])'
      );

      links.forEach((link) => {
        if (!attachedLinks.has(link)) {
          attachListeners(link);
          attachedLinks.add(link);
        }
      });
    };

    // Initial processing
    processLinks();

    // Observe DOM changes for dynamically added links
    const observer = new MutationObserver(() => {
      processLinks();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      attachedLinks.forEach((link) => {
        detachListeners(link);
      });
      attachedLinks.clear();
    };
  });
</script>

{#if showPreview}
  <div
    class="link-preview"
    style="left: {previewPosition.x}px; top: {previewPosition.y}px;"
  >
    {#if isLoading}
      <div class="preview-loading">
        <div class="spinner"></div>
        <span>Loading preview...</span>
      </div>
    {:else if previewData}
      <div class="preview-content">
        {#if previewData.image && !previewData.isFallback}
          <div class="preview-image">
            <img
              src={previewData.image}
              alt={previewData.title}
              on:error={(e) => (e.target.style.display = "none")}
            />
          </div>
        {/if}
        <div class="preview-info">
          <div class="preview-header">
            <img
              src={previewData.favicon}
              alt=""
              class="preview-favicon"
              on:error={(e) => (e.target.style.display = "none")}
            />
            <span class="preview-sitename">{previewData.siteName}</span>
          </div>
          <h4 class="preview-title">{previewData.title}</h4>
          {#if previewData.description}
            <p class="preview-description">{previewData.description}</p>
          {/if}
          <div class="preview-url">{previewData.url}</div>
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .link-preview {
    position: fixed;
    transform: translate(-50%, -100%);
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    max-width: 400px;
    width: max-content;
    z-index: 10001;
    pointer-events: none;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, calc(-100% + 8px));
    }
    to {
      opacity: 1;
      transform: translate(-50%, -100%);
    }
  }

  .preview-loading {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;
    color: #666;
    font-size: 14px;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #666;
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

  .preview-content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 12px;
  }

  .preview-image {
    width: 100%;
    height: 140px;
    overflow: hidden;
    background: #f5f5f5;
  }

  .preview-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .preview-info {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .preview-header {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .preview-favicon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  .preview-sitename {
    font-size: 11px;
    color: #666;
    font-weight: 500;
  }

  .preview-title {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .preview-description {
    font-size: 12px;
    color: #666;
    line-height: 1.4;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .preview-url {
    font-size: 10px;
    color: #999;
    font-family: "Courier New", monospace;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .link-preview {
      max-width: 320px;
    }

    .preview-image {
      height: 120px;
    }
  }
</style>
