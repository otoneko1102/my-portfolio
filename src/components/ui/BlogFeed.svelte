<script>
  import { onMount } from "svelte";
  import { blogConfig } from "../../settings/config.js";

  const DEFAULT_FEED_URL = "https://blog.montblank.fun/feed";
  const DEFAULT_BLOG_URL = "https://blog.montblank.fun";
  const MAX_ITEMS = 3;

  const feedUrl = (blogConfig && blogConfig.feedUrl) || DEFAULT_FEED_URL;
  const blogUrl = (blogConfig && blogConfig.siteUrl) || DEFAULT_BLOG_URL;

  let posts = [];
  let loading = true;
  let hasError = false;

  const parseTag = (source, tag) => {
    const pattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
    const match = source.match(pattern);
    if (!match) return "";
    const value = match[1].trim();
    const cdata = value.match(/<!\[CDATA\[(.*)\]\]>/s);
    return cdata ? cdata[1].trim() : value;
  };

  const sanitize = (text) => (text || "").replace(/<[^>]+>/g, "").trim();

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const loadFeed = async () => {
    try {
      const response = await fetch(feedUrl, { cache: "no-store" });
      if (!response.ok)
        throw new Error(`Feed request failed: ${response.status}`);

      const xml = await response.text();
      const chunks = xml.split(/<item>/).slice(1);

      const items = chunks.slice(0, MAX_ITEMS).map((chunk) => {
        const title = sanitize(parseTag(chunk, "title"));
        const link = parseTag(chunk, "link");
        const description = sanitize(parseTag(chunk, "description"));
        const pubDate = formatDate(parseTag(chunk, "pubDate"));
        return { title, link, description, pubDate };
      });

      posts = items.filter((item) => item.title && item.link);
      hasError = posts.length === 0;
    } catch (error) {
      console.error("Failed to load blog feed", error);
      hasError = true;
    } finally {
      loading = false;
    }
  };

  onMount(loadFeed);
</script>

<section id="blog" class="blog-section">
  <div class="container">
    <div class="blog-header">
      <h2 class="blog-title">Blog</h2>
    </div>
    {#if loading}
      <div class="blog-list">
        {#each Array(MAX_ITEMS) as _, i}
          <article class="blog-card placeholder" aria-busy="true">
            <div class="card-header">
              <p class="pub-date skeleton skeleton-text short"></p>
              <h3 class="post-title skeleton skeleton-title">
                <span class="sr-only">Loading…</span>
              </h3>
            </div>
            <p class="post-description skeleton skeleton-text"></p>
            <div class="card-actions" aria-hidden="true">
              <div
                class="read-link skeleton skeleton-button"
                style="width: 100px; height: 34px;"
              ></div>
            </div>
          </article>
        {/each}
      </div>
    {:else if hasError}
      <p class="empty">Unable to load recent posts.</p>
    {:else}
      <div class="blog-list">
        {#each posts as post}
          <article class="blog-card">
            <div class="card-header">
              <p class="pub-date">{post.pubDate}</p>
              <h3 class="post-title">{post.title}</h3>
            </div>
            {#if post.description}
              <p class="post-description">{post.description}</p>
            {/if}
            <div class="card-actions">
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                class="read-link"
              >
                Read Article
              </a>
            </div>
          </article>
        {/each}
      </div>
      <div class="blog-footer">
        <a
          class="blog-jump"
          href={blogUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          View All Articles
        </a>
      </div>
    {/if}
  </div>
</section>

<style>
  .blog-section {
    background-color: var(--color-background);
    padding: var(--spacing-4xl) var(--spacing-xl);
    margin-bottom: var(--spacing-3xl);
    width: 100%;
    overflow-x: hidden;
  }

  .blog-header {
    margin-bottom: var(--spacing-3xl);
  }

  .blog-title {
    margin: 0;
    color: var(--color-primary);
    font-size: var(--font-size-4xl);
    text-align: center;
  }

  .blog-footer {
    display: flex;
    justify-content: center;
    margin-top: var(--spacing-3xl);
  }

  .blog-jump {
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

  .blog-jump:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .blog-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-2xl);
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }

  .blog-card {
    background: #ffffff;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-2xl);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    transition: all var(--transition-normal);
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;
  }

  .blog-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(99, 102, 241, 0.08),
      rgba(139, 92, 246, 0)
    );
    pointer-events: none;
  }

  .blog-card:hover {
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
    transform: translateY(-2px);
  }

  .card-header {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .pub-date {
    color: var(--color-text);
    opacity: 0.7;
    font-size: var(--font-size-sm);
  }

  .post-title {
    color: var(--color-primary);
    font-size: var(--font-size-xl);
    line-height: 1.4;
  }

  .post-description {
    color: var(--color-text);
    opacity: 0.85;
    line-height: 1.6;
  }

  .card-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
  }

  .read-link {
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
  }

  .read-link:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .empty {
    text-align: center;
    color: var(--color-text);
    opacity: 0.8;
    font-size: var(--font-size-md);
  }

  /* Skeleton placeholders for loading state */
  .blog-card.placeholder {
    pointer-events: none;
    opacity: 0.95;
    filter: saturate(0.98);
    background: linear-gradient(180deg, #fff, #fbfbfb);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  }

  .blog-card.placeholder:hover {
    transform: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    border-color: var(--color-border);
  }

  .skeleton {
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.06) 25%,
      rgba(0, 0, 0, 0.04) 50%,
      rgba(0, 0, 0, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.2s linear infinite;
    border-radius: 6px;
  }

  .skeleton-text {
    height: 12px;
  }

  .skeleton-text.short {
    width: 80px;
    height: 12px;
  }

  .skeleton-title {
    height: 20px;
    width: 80%;
    margin: 6px 0;
  }

  /* Ensure placeholders match the expected height of the real card content */
  .blog-card.placeholder .skeleton-title {
    /* title typically spans up to 2 lines */
    height: calc(var(--font-size-xl) * 1.4 * 2);
  }

  .blog-card.placeholder .post-description.skeleton {
    /* description typically spans up to 3 lines */
    height: calc(var(--font-size-base) * 1.6 * 3);
    margin: 0;
  }

  .skeleton-button {
    border-radius: var(--border-radius-md);
  }

  @keyframes shimmer {
    from {
      background-position: 200% 0;
    }
    to {
      background-position: -200% 0;
    }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (max-width: 768px) {
    .blog-section {
      padding: var(--spacing-3xl) var(--spacing-lg);
    }

    .blog-title {
      font-size: var(--font-size-2xl);
    }
  }

  @media (max-width: 480px) {
    .blog-section {
      padding: var(--spacing-3xl) var(--spacing-md);
    }

    .blog-list {
      grid-template-columns: 1fr;
    }
  }
</style>
