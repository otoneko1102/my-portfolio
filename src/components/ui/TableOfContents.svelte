<script>
  import { onMount, tick } from "svelte";
  import { history } from "../../settings/config.js";

  let open = false;
  let sections = [];
  let activeId = null;

  let observer;
  let mutationObserver;

  let toggleEl;
  let panelEl;
  let prevOpen = false;

  const collectSections = () => {
    const main = document.querySelector("main");
    if (!main) {
      sections = [];
      return;
    }

    const nodes = Array.from(main.querySelectorAll("section[id]"));
    let baseSections = nodes
      .map((el) => {
        const heading = el.querySelector("h2, h1, h3");
        const title = heading
          ? heading.innerText.trim()
          : el.getAttribute("aria-label") || el.id;
        return { id: el.id, title };
      })
      .filter((s) => s.id && s.title);

    // If the page contains a `history` section, add year anchors to the TOC
    const historyIndex = baseSections.findIndex((s) => s.id === "history");
    if (historyIndex >= 0) {
      const years = Object.keys(history || {})
        .map((y) => Number(y))
        .filter((n) => !Number.isNaN(n))
        .sort((a, b) => b - a)
        .map((n) => String(n));

      const yearSections = years.map((y) => ({
        id: `year-${y}`,
        title: `${y}`,
        isYear: true,
      }));

      baseSections.splice(historyIndex + 1, 0, ...yearSections);
    }

    // If the page contains a `projects` section, add project anchors to the TOC
    const projectsIndex = baseSections.findIndex((s) => s.id === "projects");
    if (projectsIndex >= 0) {
      // Look for elements that have ids like `project-<index>` (added by ProjectsAll.svelte)
      const projectEls = Array.from(main.querySelectorAll('[id^="project-"]'));
      const projectSections = projectEls.map((el) => ({
        id: el.id,
        title: (el.innerText || el.textContent || "").trim(),
        isProject: true,
      }));

      if (projectSections.length) {
        baseSections.splice(projectsIndex + 1, 0, ...projectSections);
      }
    }

    sections = baseSections;
  };

  const setupObserver = () => {
    if (observer) observer.disconnect();

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
          }
        });
      },
      { root: null, rootMargin: "0px 0px -60% 0px", threshold: [0, 0.1, 0.5] }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
  };

  const handleToggle = () => {
    open = !open;
  };

  const getHeaderOffset = () => {
    const header = document.querySelector("header");
    return header ? Math.round(header.getBoundingClientRect().height) : 0;
  };

  const scrollToKeepVisible = (el, opts = {}) => {
    if (!el) return;
    const preferCenter = !!opts.preferCenter;
    const container =
      el.closest && el.closest("article") ? el.closest("article") : el;
    const headerOffset = getHeaderOffset();
    const padding = 12;
    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const top = rect.top;
    const bottom = rect.bottom;
    const elHeight = rect.height;

    // Prefer centering for project-like sections when the element fits comfortably
    if (preferCenter) {
      const availableSpace = viewportHeight - headerOffset - padding * 2;
      if (elHeight < availableSpace) {
        const centerOffset = Math.round((availableSpace - elHeight) / 2);
        const targetTop =
          window.scrollY + top - headerOffset - padding - centerOffset;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
        container.querySelector("h3, h2, h1")?.setAttribute("tabindex", "-1");
        container.querySelector("h3, h2, h1")?.focus({ preventScroll: true });
        return;
      }
    }

    // If already fully visible, just nudge to align to header offset for consistency
    if (top >= headerOffset + padding && bottom <= viewportHeight - padding) {
      window.scrollTo({
        top: window.scrollY + top - headerOffset - padding,
        behavior: "smooth",
      });
      container.querySelector("h3, h2, h1")?.setAttribute("tabindex", "-1");
      container.querySelector("h3, h2, h1")?.focus({ preventScroll: true });
      return;
    }

    // If element is taller than available space, align its top under the header
    if (elHeight + headerOffset + padding * 2 >= viewportHeight) {
      window.scrollTo({
        top: window.scrollY + top - headerOffset - padding,
        behavior: "smooth",
      });
      container.querySelector("h3, h2, h1")?.setAttribute("tabindex", "-1");
      container.querySelector("h3, h2, h1")?.focus({ preventScroll: true });
      return;
    }

    // Normal case: align the top under the header, but ensure bottom fits in viewport
    let targetTop = window.scrollY + top - headerOffset - padding;
    if (targetTop + elHeight > window.scrollY + viewportHeight - padding) {
      targetTop = window.scrollY + bottom - viewportHeight + padding;
    }

    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });

    container.querySelector("h3, h2, h1")?.setAttribute("tabindex", "-1");
    container.querySelector("h3, h2, h1")?.focus({ preventScroll: true });
  };

  const handleLinkClick = (id, opts = {}) => {
    const el = document.getElementById(id);
    if (el) {
      scrollToKeepVisible(el, opts);
      open = false;
    }
  };

  $: {
    if (open) {
      tick().then(() => panelEl?.focus());
    } else if (prevOpen) {
      tick().then(() => toggleEl?.focus());
    }

    prevOpen = open;
  }

  onMount(() => {
    collectSections();
    setupObserver();

    const main = document.querySelector("main");
    if (main) {
      mutationObserver = new MutationObserver(() => {
        collectSections();
        setupObserver();
      });
      mutationObserver.observe(main, { childList: true, subtree: true });
    }

    const onKey = (e) => {
      if (e.key === "Escape") open = false;
    };
    window.addEventListener("keydown", onKey);

    const handleOutsidePointer = (ev) => {
      if (!open) return;
      const target = ev.target;

      const clickedInsidePanel =
        panelEl && (panelEl === target || panelEl.contains(target));
      const clickedOnToggle =
        toggleEl && (toggleEl === target || toggleEl.contains(target));
      if (!clickedInsidePanel && !clickedOnToggle) {
        open = false;
      }
    };

    window.addEventListener("pointerdown", handleOutsidePointer);
    window.addEventListener("touchstart", handleOutsidePointer, {
      passive: true,
    });

    if (toggleEl === document.activeElement) toggleEl.blur();

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", handleOutsidePointer);
      window.removeEventListener("touchstart", handleOutsidePointer);
      if (observer) observer.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
    };
  });
</script>

{#if sections.length > 0}
  <div class="toc-root" class:open>
    <button
      type="button"
      class="toc-toggle-btn"
      aria-expanded={open}
      aria-controls="toc-panel"
      on:click={handleToggle}
      aria-label={open ? "閉じる" : "目次を開く"}
      bind:this={toggleEl}
    >
      <span class="hamburger" aria-hidden="true">
        <span class="bar bar-top"></span>
        <span class="bar bar-mid"></span>
        <span class="bar bar-bot"></span>
      </span>
    </button>

    <aside
      id="toc-panel"
      class="toc-drawer"
      class:open
      role="region"
      aria-hidden={!open}
      aria-label="目次"
      tabindex="-1"
      bind:this={panelEl}
    >
      <div class="toc-header">
        <div class="toc-spacer" aria-hidden="true"></div>
      </div>

      <nav class="toc-nav">
        <ul class="toc-list">
          {#each sections as s}
            <li
              class="toc-list-item"
              class:year-item={s.isYear}
              class:project-item={s.isProject}
            >
              <a
                href={"#" + s.id}
                class="toc-link"
                class:active={s.id === activeId}
                on:click|preventDefault={() =>
                  handleLinkClick(s.id, { preferCenter: !!s.isProject })}
              >
                {s.title}
              </a>
            </li>
          {/each}
        </ul>
      </nav>
    </aside>

    {#if open}
      <button
        type="button"
        class="toc-backdrop"
        aria-label="閉じる"
        on:click={() => (open = false)}
        on:pointerdown={() => (open = false)}
      ></button>
    {/if}
  </div>
{/if}

<style>
  .toc-root {
    --toggle-gap: var(--spacing-sm);
    --toggle-size: 48px;
    --toc-width: 340px;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 320;
    pointer-events: none;
  }

  .toc-toggle-btn {
    pointer-events: auto;
    position: fixed;
    top: calc(var(--header-height) + var(--spacing-sm));
    right: var(--toggle-gap);
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--toggle-size);
    height: var(--toggle-size);
    border-radius: 8px;
    background: transparent;
    color: var(--color-primary);
    border: none;
    cursor: pointer;
    font-weight: 700;
    transition: color var(--transition-fast);
    z-index: 350;
  }

  .toc-toggle-btn:hover,
  .toc-toggle-btn:focus {
    background: transparent;
    border: none;
  }

  .toc-toggle-btn:focus-visible {
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.08);
    outline: none;
    border-radius: 8px;
  }

  .hamburger {
    display: inline-block;
    width: 20px;
    height: 14px;
    position: relative;
  }

  .hamburger .bar {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: currentColor;
    border-radius: 2px;
    transition:
      transform 220ms cubic-bezier(0.4, 0, 0.2, 1),
      opacity 160ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hamburger .bar-top {
    top: 0;
    transform-origin: center;
  }

  .hamburger .bar-mid {
    top: 50%;
    transform: translateY(-50%);
  }

  .hamburger .bar-bot {
    bottom: 0;
    transform-origin: center;
  }

  .toc-root.open .hamburger .bar-top {
    transform: translateY(6px) rotate(45deg);
  }

  .toc-root.open .hamburger .bar-mid {
    opacity: 0;
    transform: scaleX(0);
  }

  .toc-root.open .hamburger .bar-bot {
    transform: translateY(-6px) rotate(-45deg);
  }

  .toc-root.open .toc-toggle-btn {
    color: var(--color-primary);
  }

  .toc-drawer {
    pointer-events: auto;
    position: fixed;
    top: calc(var(--header-height) + var(--spacing-sm));
    right: 0;

    transform: translateX(calc(100% + var(--toggle-size) + var(--toggle-gap)));
    width: var(--toc-width);
    max-width: 92vw;
    height: calc(100vh - (var(--header-height) + (var(--spacing-md) * 2)));

    background-color: rgba(248, 248, 248, 0.45);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-left: 1px solid rgba(0, 0, 0, 0.04);
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.04);
    padding: var(--spacing-md);
    transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
    overflow: auto;
    border-radius: 8px 0 0 8px;
    z-index: 340;
  }

  .toc-drawer.open {
    transform: translateX(0);
  }

  .toc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-sm);
  }

  .toc-spacer {
    height: calc(var(--font-size-lg) * 1.4);
    width: 100%;
  }

  .toc-nav .toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .toc-link {
    text-decoration: none;
    color: var(--color-text);
    display: block;
    padding: 6px 8px;
    border-radius: var(--border-radius-sm);
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast);
    font-weight: 600;
    /* Make non-top items compact by default */
    font-size: var(--font-size-sm);
  }

  /* Emphasize the very first TOC item and keep others small to match other pages */
  .toc-nav .toc-list .toc-list-item:first-child .toc-link {
    font-size: var(--font-size-lg);
    font-weight: 700;
    padding-left: 8px;
  }

  .toc-nav .toc-list .toc-list-item:not(:first-child) .toc-link {
    font-size: var(--font-size-sm);
    opacity: 0.95;
    /* Match the indentation used for year/project items */
    padding-left: calc(var(--spacing-lg) + 12px);
  }

  .toc-link:hover {
    background-color: rgba(99, 102, 241, 0.06);
    color: var(--color-primary);
  }

  .toc-link.active {
    color: var(--color-primary);
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.08),
      rgba(139, 92, 246, 0.02)
    );
  }

  .toc-list-item.year-item .toc-link {
    padding-left: calc(var(--spacing-lg) + 12px);
    font-size: var(--font-size-sm);
    color: var(--color-text);
    opacity: 0.95;
  }

  .toc-list-item.year-item .toc-link:hover {
    background-color: rgba(99, 102, 241, 0.04);
  }

  /* Project items (inserted under Projects section) */
  .toc-list-item.project-item .toc-link {
    padding-left: calc(var(--spacing-lg) + 12px);
    font-size: var(--font-size-sm);
    color: var(--color-text);
    opacity: 0.95;
  }

  .toc-list-item.project-item .toc-link:hover {
    background-color: rgba(99, 102, 241, 0.04);
  }

  .toc-backdrop {
    position: fixed;
    inset: 0;
    z-index: 330;
    background: rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 640px) {
    .toc-root {
      --toc-width: 90vw;
    }

    .toc-drawer {
      width: var(--toc-width);
      height: calc(100vh - (var(--header-height) + (var(--spacing-md) * 1)));
      top: calc(var(--header-height) + var(--spacing-sm));
      right: 0;
      transform: translateX(
        calc(100% + var(--toggle-size) + var(--toggle-gap))
      );
      border-radius: 0;
      padding: var(--spacing-md);
    }

    .toc-drawer.open {
      transform: translateX(0);
    }

    .toc-toggle-btn {
      width: 44px;
      height: 44px;
      border-radius: 999px;
    }

    /* Reduce TOC item indent on small screens */
    .toc-nav .toc-list .toc-list-item:not(:first-child) .toc-link {
      padding-left: calc(var(--spacing-md) + 8px);
    }

    .toc-nav .toc-list .toc-list-item:first-child .toc-link {
      padding-left: 8px;
    }
  }
</style>
