<script>
  import {
    versions,
    versionsConfig,
    sectionDescriptions,
  } from "../../settings/config.js";
  import { onMount } from "svelte";
  import { fetchOGData } from "../../lib/og";

  let currentIndex = 0;
  let displayIndex = 0;
  let isTransitioning = false;
  let imageErrors = new Set();

  const baseDomain = versionsConfig?.baseDomain ?? "p.montblank.fun";

  // Keep only entries with a valid numeric version, then sort by version descending (newest first) and normalize entries.
  let versionsList = [...versions]
    .filter((e) => e && typeof e.version === "number")
    .sort((a, b) => (b.version || 0) - (a.version || 0))
    .map((e) => {
      const v = e.version;
      // Prefer explicit `url`; if missing, derive a fallback using the version and base domain.
      const url = e.url || (v ? `https://v${v}.${baseDomain}` : undefined);
      return {
        version: v,
        title: e.title || (v ? `V${v}` : ""),
        description: e.description || "",
        image: e.image,
        url,
      };
    });

  const handleImageError = (index) => {
    imageErrors.add(index);
    imageErrors = imageErrors;
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    isTransitioning = true;
    displayIndex = index;

    setTimeout(() => {
      currentIndex = index;
      isTransitioning = false;
    }, 650);
  };

  const prevSlide = () => {
    if (isTransitioning || currentIndex === 0) return;
    isTransitioning = true;
    displayIndex = currentIndex - 1;

    setTimeout(() => {
      currentIndex = currentIndex - 1;
      isTransitioning = false;
    }, 650);
  };

  const nextSlide = () => {
    if (isTransitioning || currentIndex === versionsList.length - 1) return;
    isTransitioning = true;
    displayIndex = currentIndex + 1;

    setTimeout(() => {
      currentIndex = currentIndex + 1;
      isTransitioning = false;
    }, 650);
  };

  const getSlidePosition = (index) => {
    return (index - displayIndex) * 100;
  };

  const getOpacity = (index) => {
    if (index === currentIndex || index === displayIndex) return 1;
    return 0;
  };

  onMount(() => {
    (async () => {
      const need = versionsList.some(
        (p) => p.url && (!p.image || !p.title || !p.description)
      );
      if (!need) return;

      const augmented = await Promise.all(
        versionsList.map(async (p) => {
          if (p.url && (!p.image || !p.title || !p.description)) {
            try {
              const og = await fetchOGData(p.url);
              return {
                ...p,
                image: p.image || og.image,
                title: p.title || og.title,
                description: p.description || og.description,
              };
            } catch (e) {
              return p;
            }
          }
          return p;
        })
      );

      versionsList = augmented;
    })();
  });

  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let touchStartTime = 0;
  const SWIPE_THRESHOLD = 50;
  const SWIPE_MAX_VERTICAL_DRIFT = 40;

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    touchEndX = t.clientX;
    touchEndY = t.clientY;
    touchStartTime = Date.now();
  };

  const handleTouchMove = (e) => {
    const t = e.touches[0];
    touchEndX = t.clientX;
    touchEndY = t.clientY;
  };

  const handleTouchEnd = () => {
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    const dt = Date.now() - touchStartTime;
    if (
      Math.abs(dy) < SWIPE_MAX_VERTICAL_DRIFT &&
      Math.abs(dx) > SWIPE_THRESHOLD
    ) {
      if (dx < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };
</script>

<section id="versions" class="versions-section">
  <div class="container">
    <h2 class="versions-title section-title">Versions</h2>
    <p class="section-subtitle">{sectionDescriptions.versions}</p>

    <div class="carousel-wrapper">
      <div
        class="carousel"
        on:touchstart={handleTouchStart}
        on:touchmove={handleTouchMove}
        on:touchend={handleTouchEnd}
      >
        {#each versionsList as item, index}
          <article
            class="versions-card"
            class:active={index === currentIndex}
            class:no-image={!item.image}
            style="transform: translateX({getSlidePosition(
              index
            )}%); opacity: {getOpacity(index)}; z-index: {index ===
              currentIndex || index === displayIndex
              ? 10
              : 1};"
          >
            <div class="versions-image">
              {#if !item.image || imageErrors.has(index)}
                <div class="versions-placeholder">
                  <iconify-icon icon="mdi:folder-image" width="64" height="64"
                  ></iconify-icon>
                  <p>No Image</p>
                </div>
              {:else}
                <img
                  src={item.image}
                  alt={item.title}
                  on:error={() => handleImageError(index)}
                />
              {/if}
              <div class="versions-overlay">
                {#if item.url}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="versions-link"
                  >
                    Visit Site
                  </a>
                {/if}
              </div>
            </div>
            <div class="versions-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        {/each}
      </div>

      {#if versionsList.length > 1}
        {#if currentIndex > 0}
          <button
            type="button"
            class="carousel-control carousel-prev"
            on:click={prevSlide}
            aria-label="Previous"
            title="Previous"
          >
            <span class="material-icons" aria-hidden="true">chevron_left</span>
          </button>
        {/if}
        {#if currentIndex < versionsList.length - 1}
          <button
            type="button"
            class="carousel-control carousel-next"
            on:click={nextSlide}
            aria-label="Next"
            title="Next"
          >
            <span class="material-icons" aria-hidden="true">chevron_right</span>
          </button>
        {/if}
      {/if}
    </div>

    {#if versionsList.length > 1}
      <div class="carousel-dots">
        {#each versionsList as _, index}
          <button
            class="dot"
            class:active={index === currentIndex}
            on:click={() => goToSlide(index)}
            aria-label="Go to {index + 1}"
            aria-current={index === currentIndex}
          ></button>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .versions-section {
    background-color: var(--color-background);
    padding: var(--spacing-4xl) var(--spacing-xl);
    margin-bottom: var(--spacing-3xl);
    width: 100%;
    overflow-x: hidden;
  }

  .versions-title {
    text-align: center;
    margin-bottom: var(--spacing-md);
    color: var(--color-primary);
    font-size: var(--font-size-4xl);
  }

  .carousel-wrapper {
    position: relative;
    max-width: 900px;
    margin: 0 auto var(--spacing-2xl);
    width: 100%;
    overflow: hidden;
    padding: 0 60px;
    box-sizing: border-box;
  }

  .carousel {
    position: relative;
    overflow: hidden;
    padding: var(--spacing-xl) 0;
    min-height: 500px;
    width: 100%;
  }

  .versions-card {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--color-sec-background);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    transition:
      opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
    pointer-events: none;
    will-change: transform, opacity;
    height: 100%;
  }

  .versions-card:hover {
    border-color: var(--color-text);
    box-shadow: var(--shadow-lg);
  }

  .versions-card.active {
    pointer-events: auto;
  }

  .versions-card.no-image {
    height: 100%;
  }

  .versions-card.no-image .versions-content {
    justify-content: center;
  }

  .carousel-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all var(--transition-normal);
  }

  .carousel-control:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }

  .carousel-control:focus {
    outline: 2px solid rgba(255, 255, 255, 0.85);
    outline-offset: 3px;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.08);
  }

  .carousel-control .material-icons {
    font-size: inherit;
    line-height: 1;
    vertical-align: middle;
  }

  .carousel-prev {
    left: 0;
  }

  .carousel-next {
    right: 0;
  }

  .versions-image {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 280px;
    background-color: #f0f0f0;
    flex-shrink: 0;
  }

  .versions-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-normal);
  }

  .versions-card:hover .versions-image img {
    transform: scale(1.05);
  }

  .versions-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
    background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
    color: var(--color-text-light);
  }

  .versions-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: linear-gradient(to top, rgba(0, 0, 0, 0.45), transparent);
  }

  .versions-link {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-lg);
    background: linear-gradient(45deg, #6366f1, #8b5cf6);
    color: #ffffff;
    border-radius: var(--border-radius-md);
    font-weight: 600;
    text-decoration: none;
    transition: all var(--transition-normal);
    box-shadow: var(--shadow-sm);
    white-space: nowrap;
  }

  .versions-link:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .versions-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-xl);
  }

  .carousel-dots {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: var(--spacing-md);
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #cbd5e1;
    border: none;
    cursor: pointer;
    transition: background-color var(--transition-fast);
  }

  .dot.active {
    background-color: var(--color-primary);
  }

  @media (max-width: 1024px) {
    .carousel-wrapper {
      padding: 0 45px;
    }

    .carousel-prev {
      left: 0;
    }

    .carousel-next {
      right: 0;
    }

    .carousel-control {
      width: 40px;
      height: 40px;
      font-size: 20px;
    }
  }

  @media (max-width: 768px) {
    .versions-section {
      padding: var(--spacing-2xl) var(--spacing-lg);
    }

    .versions-title {
      font-size: var(--font-size-2xl);
      margin-bottom: var(--spacing-2xl);
    }

    .carousel-wrapper {
      padding: 0 40px;
    }

    .carousel {
      padding: var(--spacing-lg) 0;
      min-height: 420px;
    }
    .versions-image {
      height: 220px;
    }

    .versions-card {
      width: 100%;
    }

    .carousel-prev {
      left: 0;
    }

    .carousel-next {
      right: 0;
    }

    .carousel-control {
      width: 36px;
      height: 36px;
      font-size: 18px;
    }

    .versions-content {
      padding: var(--spacing-lg);
    }

    .versions-content h3 {
      font-size: var(--font-size-lg);
    }

    .versions-content p {
      font-size: var(--font-size-sm);
    }
  }

  @media (max-width: 480px) {
    .versions-section {
      padding: var(--spacing-2xl) var(--spacing-md);
    }

    .versions-title {
      font-size: var(--font-size-xl);
      margin-bottom: var(--spacing-lg);
    }

    .carousel-wrapper {
      margin-bottom: var(--spacing-lg);
      padding: 0 32px;
    }

    .carousel {
      padding: var(--spacing-md) 0;
      min-height: 360px;
    }
    .versions-image {
      height: 180px;
    }

    .versions-card {
      width: 100%;
    }

    .carousel-prev,
    .carousel-next {
      width: 32px;
      height: 32px;
      font-size: 16px;
    }

    .carousel-prev {
      left: 0;
    }

    .carousel-next {
      right: 0;
    }

    .versions-overlay {
      flex-direction: row;
      align-items: flex-end;
      justify-content: flex-end;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm);
    }

    .versions-link {
      justify-content: center;
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: var(--font-size-xs);
      border-radius: var(--border-radius-sm);
    }

    .versions-content {
      padding: var(--spacing-md);
    }

    .versions-content h3 {
      font-size: var(--font-size-base);
    }

    .versions-content p {
      font-size: var(--font-size-xs);
    }

    .carousel-dots {
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
    }

    .dot {
      width: 10px;
      height: 10px;
    }
  }
</style>
