<script>
  import { projects } from "../../settings/config.js";
  import { onMount } from "svelte";
  import { fetchOGData } from "../../lib/og";

  let currentIndex = 0;
  let displayIndex = 0;
  let isTransitioning = false;
  let imageErrors = new Set();

  let projectList = projects.filter((p) => p.pin === true);

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
    if (isTransitioning || currentIndex === projectList.length - 1) return;
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
      const pinned = projects.filter((p) => p.pin === true);
      const need = pinned.some(
        (p) => p.url && (!p.image || !p.title || !p.description)
      );
      if (!need) return;

      const augmented = await Promise.all(
        pinned.map(async (p) => {
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

      projectList = augmented;
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

<section id="projects" class="projects-section">
  <div class="container">
    <h2 class="projects-title">Projects</h2>

    <div class="carousel-wrapper">
      <div
        class="carousel"
        on:touchstart={handleTouchStart}
        on:touchmove={handleTouchMove}
        on:touchend={handleTouchEnd}
      >
        {#each projectList as project, index}
          <article
            class="project-card"
            class:active={index === currentIndex}
            class:no-image={!project.image}
            style="transform: translateX({getSlidePosition(
              index
            )}%); opacity: {getOpacity(index)}; z-index: {index ===
              currentIndex || index === displayIndex
              ? 10
              : 1};"
          >
            <div class="project-image">
              {#if !project.image || imageErrors.has(index)}
                <div class="project-placeholder">
                  <iconify-icon icon="mdi:folder-image" width="64" height="64"
                  ></iconify-icon>
                  <p>No Image</p>
                </div>
              {:else}
                <img
                  src={project.image}
                  alt={project.title}
                  on:error={() => handleImageError(index)}
                />
              {/if}
              <div class="project-overlay">
                {#if project.url}
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link"
                  >
                    View Project
                  </a>
                {/if}
                {#if project.github}
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-github"
                  >
                    <iconify-icon icon="mdi:github" width="20" height="20"
                    ></iconify-icon>
                    GitHub
                  </a>
                {/if}
              </div>
            </div>
            <div class="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div class="project-tags">
                {#each (project.tags ?? [])
                  .slice()
                  .sort((a, b) => a.localeCompare(b, "ja")) as tag}
                  <span class="tag">{tag}</span>
                {/each}
              </div>
            </div>
          </article>
        {/each}
      </div>

      {#if projectList.length > 1}
        {#if currentIndex > 0}
          <button
            type="button"
            class="carousel-control carousel-prev"
            on:click={prevSlide}
            aria-label="Previous project"
            title="Previous project"
          >
            <span class="material-icons" aria-hidden="true">chevron_left</span>
          </button>
        {/if}
        {#if currentIndex < projectList.length - 1}
          <button
            type="button"
            class="carousel-control carousel-next"
            on:click={nextSlide}
            aria-label="Next project"
            title="Next project"
          >
            <span class="material-icons" aria-hidden="true">chevron_right</span>
          </button>
        {/if}
      {/if}
    </div>

    {#if projectList.length > 1}
      <div class="carousel-dots">
        {#each projectList as _, index}
          <button
            class="dot"
            class:active={index === currentIndex}
            on:click={() => goToSlide(index)}
            aria-label="Go to project {index + 1}"
            aria-current={index === currentIndex}
          ></button>
        {/each}
      </div>
    {/if}

    <div class="projects-footer">
      <a class="projects-jump" href="/projects" data-no-preview
        >View All Projects</a
      >
    </div>
  </div>
</section>

<style>
  .projects-section {
    background-color: var(--color-background);
    padding: var(--spacing-4xl) var(--spacing-xl);
    margin-bottom: var(--spacing-3xl);
    width: 100%;
    overflow-x: hidden;
  }

  .projects-title {
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

  .project-card {
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

  .project-card.active {
    pointer-events: auto;
  }

  .project-card.no-image {
    height: 100%;
  }

  .project-card.no-image .project-content {
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

  .project-image {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 280px;
    background-color: #f0f0f0;
    flex-shrink: 0;
  }

  .project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-normal);
  }

  .project-card:hover .project-image img {
    transform: scale(1.05);
  }

  .project-placeholder {
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

  .project-placeholder p {
    margin: 0;
    font-size: var(--font-size-sm);
    font-weight: 500;
  }

  .project-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      transparent 60%,
      rgba(0, 0, 0, 0.7) 100%
    );
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    transition: background-color var(--transition-normal);
  }

  .project-card:hover .project-overlay {
    background: linear-gradient(
      180deg,
      transparent 0%,
      transparent 40%,
      rgba(0, 0, 0, 0.9) 100%
    );
  }

  .project-link,
  .project-github {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-lg);
    background: linear-gradient(45deg, #6366f1, #8b5cf6);
    color: #ffffff;
    text-decoration: none;
    border-radius: var(--border-radius-md);
    font-weight: 600;
    transition: all var(--transition-normal);
    box-shadow: var(--shadow-sm);
  }

  .project-link:hover,
  .project-github:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .project-content {
    padding: var(--spacing-xl);
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .project-content h3 {
    margin: 0 0 var(--spacing-sm) 0;
    color: var(--color-primary);
    font-size: var(--font-size-xl);
  }

  .project-content p {
    margin: 0 0 var(--spacing-md) 0;
    color: var(--color-text-light);
    font-size: var(--font-size-sm);
    line-height: 1.6;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .project-tags {
    display: flex;
    flex-wrap: nowrap;
    gap: var(--spacing-xs);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    margin-top: auto;
  }

  .project-tags::-webkit-scrollbar {
    height: 6px;
  }

  .project-tags::-webkit-scrollbar-thumb {
    background-color: var(--color-border);
    border-radius: var(--border-radius-full);
  }

  .tag {
    display: inline-block;
    padding: 4px 12px;
    background-color: #f0f0f0;
    color: var(--color-text);
    border-radius: var(--border-radius-full);
    font-size: var(--font-size-xs);
    font-weight: 500;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .carousel-dots {
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid var(--color-primary);
    background-color: transparent;
    cursor: pointer;
    transition: all var(--transition-normal);
  }

  .dot.active {
    background-color: var(--color-primary);
  }

  .dot:hover {
    transform: scale(1.2);
  }

  .projects-footer {
    display: flex;
    justify-content: center;
    margin-top: var(--spacing-3xl);
  }

  .projects-jump {
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

  .projects-jump:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
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
    .projects-section {
      padding: var(--spacing-2xl) var(--spacing-lg);
    }

    .projects-title {
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
    .project-image {
      height: 220px;
    }

    .project-card {
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

    .project-content {
      padding: var(--spacing-lg);
    }

    .project-content h3 {
      font-size: var(--font-size-lg);
    }

    .project-content p {
      font-size: var(--font-size-sm);
    }
  }

  @media (max-width: 480px) {
    .projects-section {
      padding: var(--spacing-2xl) var(--spacing-md);
    }

    .projects-title {
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
    .project-image {
      height: 180px;
    }

    .project-card {
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

    .project-overlay {
      flex-direction: row;
      align-items: flex-end;
      justify-content: flex-end;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm);
    }

    .project-link,
    .project-github {
      justify-content: center;
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: var(--font-size-xs);
      border-radius: var(--border-radius-sm);
    }

    .project-github iconify-icon {
      width: 16px;
      height: 16px;
    }

    .project-tags::-webkit-scrollbar {
      display: none;
    }

    .project-tags {
      scrollbar-width: none;
    }

    .project-content {
      padding: var(--spacing-md);
    }

    .project-content h3 {
      font-size: var(--font-size-base);
    }

    .project-content p {
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
