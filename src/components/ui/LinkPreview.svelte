<script>
  import { onMount, tick } from "svelte";
  import { fetchOGData } from "../../lib/og";

  let previewData = null;
  let isLoading = false;
  let showPreview = false;
  let previewPosition = { x: 0, y: 0 };
  let currentUrl = null;
  let currentLink = null;
  let previewTimeout = null;

  let previewDirection = "top";

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
    currentLink = link;

    clearTimeout(previewTimeout);
    previewTimeout = setTimeout(async () => {
      const rect = link.getBoundingClientRect();
      previewPosition = {
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      };
      previewDirection = "top";

      showPreview = true;
      isLoading = true;

      await tick();
      adjustPreview(link);

      try {
        const data = await fetchOGData(url);
        if (currentUrl === url) {
          previewData = data;
          isLoading = false;

          await tick();
          adjustPreview(link);
        }
      } catch (e) {
        if (currentUrl === url) {
          const urlObj = new URL(url);
          const domain = urlObj.hostname.replace(/^www\./, "");
          previewData = {
            title: domain,
            description: url,
            image: null,
            siteName: domain,
            favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
            url,
            isFallback: true,
          };
          isLoading = false;
          await tick();
          adjustPreview(link);
        }
      }
    }, 300);
  };

  const handleMouseLeave = () => {
    clearTimeout(previewTimeout);
    showPreview = false;
    isLoading = false;
    previewData = null;
    currentUrl = null;
    currentLink = null;
  };

  const attachListeners = (link) => {
    link.removeAttribute("title");

    link.addEventListener("mouseenter", handleMouseEnter);
    link.addEventListener("mouseleave", handleMouseLeave);
  };

  const detachListeners = (link) => {
    link.removeEventListener("mouseenter", handleMouseEnter);
    link.removeEventListener("mouseleave", handleMouseLeave);
  };

  const adjustPreview = async (link) => {
    await tick();
    const el = document.querySelector(".link-preview");
    if (!el || !link) return;

    const elRect = el.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const margin = 12;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const elWidth = elRect.width;
    const elHeight = elRect.height;

    let centerX = linkRect.left + linkRect.width / 2;
    centerX = Math.min(
      Math.max(centerX, margin + elWidth / 2),
      viewportWidth - margin - elWidth / 2
    );
    previewPosition.x = centerX;

    const gap = 8;
    const topSpace = linkRect.top - margin;
    const bottomSpace = viewportHeight - linkRect.bottom - margin;

    if (topSpace >= elHeight + gap) {
      previewDirection = "top";
      previewPosition.y = linkRect.top - gap;
    } else if (bottomSpace >= elHeight + gap) {
      previewDirection = "bottom";
      previewPosition.y = linkRect.bottom + gap;
    } else {
      if (topSpace > bottomSpace) {
        previewDirection = "top";
        previewPosition.y = Math.max(margin + elHeight, linkRect.top - gap);
      } else {
        previewDirection = "bottom";
        previewPosition.y = Math.min(
          viewportHeight - margin - elHeight,
          linkRect.bottom + gap
        );
      }
    }
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

    processLinks();

    const observer = new MutationObserver(() => {
      processLinks();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const onWindowChange = () => {
      if (showPreview && currentLink) {
        adjustPreview(currentLink);
      }
    };

    window.addEventListener("resize", onWindowChange);
    document.addEventListener("scroll", onWindowChange, true);

    return () => {
      observer.disconnect();
      attachedLinks.forEach((link) => {
        detachListeners(link);
      });
      attachedLinks.clear();
      window.removeEventListener("resize", onWindowChange);
      document.removeEventListener("scroll", onWindowChange, true);
    };
  });
</script>

{#if showPreview}
  <div
    class="link-preview"
    data-position={previewDirection}
    style="left: {previewPosition.x}px; top: {previewPosition.y}px;"
  >
    {#if isLoading}
      <div class="preview-loading">
        <div class="spinner"></div>
        <span>Loading...</span>
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
    max-width: min(400px, calc(100vw - 32px));
    width: auto;
    z-index: 10001;
    pointer-events: none;
    opacity: 0;
    animation: fadeIn 0.12s ease forwards;
    max-height: calc(100vh - 48px);
    overflow: auto;
  }

  .link-preview[data-position="bottom"] {
    transform: translate(-50%, 0);
  }
  .link-preview[data-position="top"] {
    transform: translate(-50%, -100%);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .preview-loading {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;
    color: #94a3b8;
    font-size: 14px;
  }

  .spinner {
    width: 24px;
    height: 24px;
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

  .preview-content {
    display: flex;
    flex-direction: column;
    overflow: auto;
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
