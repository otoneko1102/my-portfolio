<script>
  import { projects, sectionDescriptions } from "../../settings/config.js";
  import { onMount } from "svelte";
  import { fetchOGData } from "../../lib/og";

  let imageErrors = new Set();
  let projectList = projects;
  const handleImageError = (index) => {
    imageErrors.add(index);
    imageErrors = imageErrors;
  };

  onMount(() => {
    (async () => {
      const need = projects.some(
        (p) => p.url && (!p.image || !p.title || !p.description)
      );
      if (!need) return;

      const augmented = await Promise.all(
        projects.map(async (p) => {
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
</script>

<section id="projects" class="projects-section">
  <div class="container">
    <h2 class="projects-title section-title">Projects</h2>
    <p class="section-subtitle">{sectionDescriptions.projects}</p>

    <div class="projects-grid">
      {#each projectList as project, index (project.github ?? project.url ?? project.title)}
        <article class="project-card grid" class:no-image={!project.image}>
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
                  class="project-link">View Project</a
                >
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
            <h3 id={"project-" + index}>{project.title}</h3>
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
  </div>
</section>

<style>
  .projects-title {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
    color: var(--color-primary);
    font-size: var(--font-size-4xl);
  }

  .projects-grid {
    display: grid;

    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);

    max-width: 900px;
    margin: 0 auto var(--spacing-2xl);
    width: 100%;
    box-sizing: border-box;
  }

  .project-card {
    background-color: var(--color-sec-background);
  }

  .project-card.grid {
    position: relative;
    display: flex;
    flex-direction: column;
    height: auto;
    pointer-events: auto;
    transform: none;
    opacity: 1;
    transition: all var(--transition-normal);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
  }

  .project-card.grid:hover {
    border-color: var(--color-text);
    box-shadow: var(--shadow-lg);
  }

  .project-card.grid .project-image {
    height: 200px;
    position: relative;
    overflow: hidden;
    width: 100%;
    background-color: var(--color-surface-alt);
    flex-shrink: 0;
  }

  .project-card.grid .project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-normal);
  }

  .project-card.grid:hover .project-image img {
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
    background: linear-gradient(
      135deg,
      var(--color-surface-alt) 0%,
      var(--color-surface) 100%
    );
    color: var(--color-text-light);
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

  .project-card.grid:hover .project-overlay {
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

  .project-card.grid .project-content {
    padding: var(--spacing-lg);
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
    background-color: var(--color-surface-alt);
    color: var(--color-text);
    border-radius: var(--border-radius-full);
    font-size: var(--font-size-xs);
    font-weight: 500;
    flex-shrink: 0;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .project-card.grid .project-image {
      height: 220px;
    }

    .project-content h3 {
      font-size: var(--font-size-lg);
    }
  }

  @media (max-width: 480px) {
    .project-card.grid .project-image {
      height: 180px;
    }

    .project-content h3 {
      font-size: var(--font-size-base);
    }
  }
</style>
