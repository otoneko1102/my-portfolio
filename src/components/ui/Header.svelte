<script>
  import { navLinks, siteConfig } from "../../settings/config.js";
  import { onMount } from "svelte";

  let currentPath = "/";

  onMount(() => {
    const updatePath = () => (currentPath = location.pathname || "/");
    updatePath();
    window.addEventListener("popstate", updatePath);
    window.addEventListener("hashchange", updatePath);
    return () => {
      window.removeEventListener("popstate", updatePath);
      window.removeEventListener("hashchange", updatePath);
    };
  });
</script>

<header>
  <div class="container header-content">
    <a href="/" class="header-brand" data-no-preview>
      <img src={siteConfig.logo} alt={siteConfig.title} class="header-logo" />
    </a>
    <ul class="header-links">
      {#each navLinks as link}
        <li>
          <a
            href={link.href}
            data-no-preview
            aria-current={link.href === currentPath ? "page" : undefined}
            >{link.label}</a
          >
        </li>
      {/each}
    </ul>
  </div>
</header>

<style>
  header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: var(--color-glass-bg);
    border-bottom: 1px solid var(--color-glass-border);
    z-index: 100;
    box-shadow: 0 1px 2px var(--color-glass-shadow);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--header-padding-y) var(--header-padding-x);
    max-width: 1600px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }

  .header-brand {
    display: flex;
    align-items: center;
    margin-left: var(--spacing-xl);
    flex-shrink: 0;
  }

  .header-links {
    display: flex;
    list-style: none;
    gap: var(--spacing-lg);
    margin: 0;
    margin-right: var(--spacing-xl);
    padding: 0;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .header-logo {
    height: 60px;
    width: auto;
    transition: opacity var(--transition-fast);
  }

  .header-brand:hover .header-logo {
    opacity: 0.75;
  }

  .header-links {
    display: flex;
    list-style: none;
    gap: var(--spacing-lg);
    margin: 0;
    padding: 0;
  }

  .header-links a {
    font-size: var(--font-size-base);
    color: var(--color-text);
    font-weight: 500;
    transition: color var(--transition-fast);
    position: relative;
  }

  .header-links a:hover {
    color: var(--color-primary);
  }

  .header-links a::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--color-primary);
    transition: width var(--transition-normal);
  }

  .header-links a:hover::after {
    width: 100%;
  }

  .header-links a[aria-current="page"] {
    color: var(--color-primary);
    font-weight: 700;
  }

  @media (max-width: 768px) {
    .header-content {
      padding: var(--header-padding-y) var(--header-padding-x);
    }

    .header-brand {
      margin-left: var(--spacing-md);
    }

    .header-logo {
      height: 32px;
    }

    .header-links {
      gap: var(--spacing-md);
      margin-right: var(--spacing-md);
    }

    .header-links a {
      font-size: var(--font-size-sm);
    }
  }

  @media (max-width: 480px) {
    .header-content {
      padding: var(--header-padding-y) var(--header-padding-x);
    }

    .header-brand {
      margin-left: var(--spacing-sm);
    }

    .header-links {
      gap: var(--spacing-sm);
      margin-right: var(--spacing-sm);
    }

    .header-links a {
      font-size: var(--font-size-xs);
    }
  }
</style>
