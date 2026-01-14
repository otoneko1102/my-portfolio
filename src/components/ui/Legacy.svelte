<script>
  import { legacy, legacyConfig } from "../../settings/config.js";
  import { onMount } from "svelte";
  import { fetchOGData } from "../../lib/og";

  let currentIndex = 0;
  let displayIndex = 0;
  let isTransitioning = false;
  let imageErrors = new Set();

  const baseDomain = legacyConfig?.baseDomain ?? "p.montblank.fun";

  let legacyList = legacy.map((e) => {
    const v = e.version;
    const url = e.url || `https://v${v}.${baseDomain}`;
    return {
      title: e.title || `V${v}`,
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
    if (isTransitioning || currentIndex === legacyList.length - 1) return;
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
      const need = legacyList.some(
        (p) => p.url && (!p.image || !p.title || !p.description)
      );
      if (!need) return;

      const augmented = await Promise.all(
        legacyList.map(async (p) => {
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

      legacyList = augmented;
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

<section id="legacy" class="legacy-section">
  <div class="container">
    <h2 class="legacy-title">Legacy</h2>

    <div class="carousel-wrapper">
      <div
        class="carousel"
        on:touchstart={handleTouchStart}
        on:touchmove={handleTouchMove}
        on:touchend={handleTouchEnd}
      >
        {#each legacyList as item, index}
          <article
            class="legacy-card"
            class:active={index === currentIndex}
            class:no-image={!item.image}
            style="transform: translateX({getSlidePosition(
              index
            )}%); opacity: {getOpacity(index)}; z-index: {index ===
              currentIndex || index === displayIndex
              ? 10
              : 1};"
          >
            <div class="legacy-image">
              {#if !item.image || imageErrors.has(index)}
                <div class="legacy-placeholder">
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
              <div class="legacy-overlay">
                {#if item.url}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="legacy-link"
                  >
                    Visit Site
                  </a>
                {/if}
              </div>
            </div>
            <div class="legacy-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        {/each}
      </div>

      {#if legacyList.length > 1}
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
        {#if currentIndex < legacyList.length - 1}
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

    {#if legacyList.length > 1}
      <div class="carousel-dots">
        {#each legacyList as _, index}
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
  .legacy-section {
    background-color: var(--color-background);
    padding: var(--spacing-4xl) var(--spacing-xl);
    margin-bottom: var(--spacing-3xl);
    width: 100%;
    overflow-x: hidden;
  }

  .legacy-title {
    text-align: center;
    margin-bottom: var(--spacing-3xl);
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

  .legacy-card {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--color-background);
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

  .legacy-card:hover {
    border-color: var(--color-text);
    box-shadow: var(--shadow-lg);
  }

  .legacy-card.active {
    pointer-events: auto;
  }

  .legacy-card.no-image {
    height: 100%;
  }

  .legacy-card.no-image .legacy-content {
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

  .legacy-image {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 280px;
    background-color: #f0f0f0;
    flex-shrink: 0;
  }

  .legacy-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-normal);
  }

  .legacy-card:hover .legacy-image img {
    transform: scale(1.05);
  }

  .legacy-placeholder {
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

  .legacy-overlay {
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

  .legacy-link {
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

  .legacy-link:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .legacy-content {
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
</style>
