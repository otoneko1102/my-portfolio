<script>
  import { skills } from "../../settings/config.js";
</script>

<section id="skills" class="skills-section">
  <div class="container">
    <h2 class="skills-title">Skills</h2>
    <div class="skills-categories">
      {#each skills as category}
        <div class="skill-category">
          <h3>{category.category}</h3>
          <div class="skill-items">
            {#each category.items as skill}
              {@const isPath =
                skill.icon.startsWith("/") || skill.icon.includes(".")}
              <div class="skill-item">
                <div class="skill-icon">
                  {#if isPath}
                    <img src={skill.icon} alt={skill.name} />
                  {:else}
                    <!-- svelte-ignore element_invalid_self_closing_tag -->
                    <iconify-icon icon={skill.icon} width="32" height="32" />
                  {/if}
                </div>
                <p class="skill-name">{skill.name}</p>
                {#if skill.proficiency !== undefined}
                  <div class="skill-proficiency">
                    <div class="proficiency-bar">
                      <div
                        class="proficiency-fill"
                        style="width: {skill.proficiency}%"
                      ></div>
                    </div>
                    <p class="proficiency-text">{skill.proficiency}%</p>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .skills-section {
    background-color: var(--color-background);
    padding: clamp(var(--spacing-lg), 4vw, var(--spacing-4xl)) var(--spacing-xl);
    margin-bottom: var(--spacing-3xl);
    width: 100%;
    overflow-x: hidden;
  }

  .skills-title {
    text-align: center;
    margin-bottom: var(--spacing-3xl);
    color: var(--color-primary);
    font-size: var(--font-size-4xl);
  }

  .skills-categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: clamp(var(--spacing-lg), 2vw, var(--spacing-3xl));
    width: 100%;
    box-sizing: border-box;
  }

  .skill-category {
    background-color: var(--color-background);
    padding: clamp(var(--spacing-lg), 2vw, var(--spacing-2xl));
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--color-border);
    transition: all var(--transition-normal);
  }

  .skill-category:hover {
    box-shadow: var(--shadow-lg);
    border-color: var(--color-text);
  }

  .skill-category h3 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-2xl);
    padding-bottom: var(--spacing-md);
    border-bottom: 2px solid var(--color-border);
    font-size: clamp(var(--font-size-base), 1.8vw, var(--font-size-2xl));
  }

  .skill-category:hover h3 {
    border-bottom-color: var(--color-primary);
  }

  .skill-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: clamp(var(--spacing-sm), 1.2vw, var(--spacing-lg));
  }

  .skill-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    cursor: pointer;
    transition: all var(--transition-normal);
  }

  .skill-item:hover {
    transform: translateY(-0.5rem);
  }

  .skill-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--skill-icon-size, clamp(40px, 4.5vw, 64px));
    height: var(--skill-icon-size, clamp(40px, 4.5vw, 64px));
    background-color: transparent;
    border-radius: var(--border-radius-md);
    margin-bottom: var(--spacing-md);
    transition: all var(--transition-normal);
  }

  .skill-icon img,
  .skill-icon :global(iconify-icon) {
    width: 70%;
    height: 70%;
    object-fit: contain;
    display: block;
  }

  .skill-item:hover .skill-icon {
    background-color: #f5f5f5;
    transform: scale(1.1);
  }

  :global(iconify-icon) {
    display: inline-block;
  }

  .skill-name {
    font-size: clamp(0.65rem, 0.9vw, var(--font-size-xs));
    color: var(--color-text);
    font-weight: 500;
    margin: 0;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .skill-proficiency {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    margin-top: var(--spacing-sm);
    width: 100%;
  }

  .proficiency-bar {
    width: clamp(40px, 6vw, 120px);
    max-width: 100%;
    height: clamp(6px, 0.9vh, 10px);
    background-color: #f0f0f0;
    border-radius: 3px;
    overflow: hidden;
    border: 1px solid #e0e0e0;
  }

  .proficiency-fill {
    height: 100%;
    background: linear-gradient(45deg, #6366f1, #8b5cf6, #6366f1, #8b5cf6);
    background-size: 200%;
    animation: gradientFlow 4s linear infinite;
  }

  @keyframes gradientFlow {
    0% {
      background-position: 0%;
    }
    100% {
      background-position: 200%;
    }
  }

  .proficiency-text {
    font-size: clamp(0.6rem, 0.7vw, var(--font-size-xs));
    color: var(--color-text);
    font-weight: 600;
    margin: 0;
  }

  @media (max-width: 768px) {
    .skills-section {
      padding: var(--spacing-2xl) var(--spacing-lg);
    }

    .skills-categories {
      grid-template-columns: 1fr;
    }

    .skill-items {
      grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
      gap: var(--spacing-lg);
    }

    .skill-icon {
      width: min(64px, var(--skill-icon-size, clamp(40px, 6vw, 72px)));
      height: min(64px, var(--skill-icon-size, clamp(40px, 6vw, 72px)));
    }

    .skill-name {
      font-size: clamp(0.7rem, 1.2vw, var(--font-size-xs));
    }
  }

  @media (max-width: 480px) {
    .skills-section {
      padding: var(--spacing-2xl) var(--spacing-md);
    }

    .skills-title {
      font-size: var(--font-size-2xl);
      margin-bottom: var(--spacing-md);
    }

    .skills-categories {
      grid-template-columns: 1fr;
      gap: var(--spacing-xl);
    }

    .skill-category {
      padding: var(--spacing-lg);
    }

    .skill-category h3 {
      font-size: var(--font-size-base);
      margin-bottom: var(--spacing-lg);
    }

    .skill-items {
      grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
      gap: var(--spacing-md);
    }

    .skill-icon {
      width: min(56px, var(--skill-icon-size, clamp(36px, 8vw, 56px)));
      height: min(56px, var(--skill-icon-size, clamp(36px, 8vw, 56px)));
    }

    .skill-name {
      font-size: clamp(0.6rem, 1.6vw, var(--font-size-2xs));
    }
  }
</style>
