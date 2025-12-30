<script>
  import { history, historyBadges } from "../../settings/config.js";

  const years = Object.keys(history || {})
    .map((y) => Number(y))
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => b - a)
    .map((n) => String(n));

  const getMonthsForYear = (year) =>
    Object.keys(history[year] || {})
      .map((m) => Number(m))
      .filter((n) => !Number.isNaN(n))
      .sort((a, b) => b - a)
      .map((n) => String(n));

  const getEntries = (year, month) =>
    (history?.[year]?.[month] ?? []).slice().reverse();

  /**
   * Determine badge/shaping info for an entry:
   * - returns null when no badge should be shown,
   * - otherwise returns { shape: string, color: string }.
   * Accepts category keys from historyBadges or direct shape names.
   */
  const getBadgeInfo = (item) => {
    if (typeof item === "string") {
      return { shape: "dot", color: "var(--color-primary)" };
    }
    if (!item || item.badge === "") return null;
    const key = String(item.badge);
    if (historyBadges && historyBadges[key]) {
      const { badge: shape, color } = historyBadges[key];
      return { shape: shape || "dot", color: color || "var(--color-primary)" };
    }
    const shape = key;
    const colorMap = {
      dot: "var(--color-primary)",
      circle: "var(--color-primary)",
      triangle: "#f59e0b",
      square: "#10b981",
      diamond: "#ef4444",
    };
    return { shape, color: colorMap[shape] || "var(--color-primary)" };
  };
</script>

<section id="history" class="history-section">
  <div class="container">
    <h2 class="history-title">History</h2>

    {#if years.length === 0}
      <p class="history-empty">No events yet.</p>
    {/if}

    {#each years as year}
      <div class="year-block" aria-labelledby={"year-" + year}>
        <div class="content-col">
          <div class="timeline-wrapper">
            <div
              id={"year-" + year}
              class="year-anchor"
              aria-hidden="true"
            ></div>
            <div class="timeline-line" aria-hidden="true"></div>

            <div class="timeline-items">
              {#each getMonthsForYear(year) as month}
                <div class="month-block">
                  <div class="month-label" id={"month-" + year + "-" + month}>
                    {year} / {String(Number(month)).padStart(2, "0")}
                  </div>

                  <div class="month-entries">
                    {#each getEntries(year, month) as item}
                      <div class="timeline-row">
                        <div class="month-col"></div>

                        <div class="dot-col" aria-hidden="true">
                          {#if getBadgeInfo(item)}
                            <span
                              class={"badge badge--" + getBadgeInfo(item).shape}
                              style={"--badge-color:" +
                                getBadgeInfo(item).color}
                            ></span>
                          {/if}
                        </div>

                        <div class="event-col">
                          {#if typeof item === "string"}
                            <div class="event-text">{item}</div>
                          {:else if item?.url}
                            <a
                              class="event-link"
                              href={item.url}
                              target={item.url.startsWith("http")
                                ? "_blank"
                                : undefined}
                              rel={item.url.startsWith("http")
                                ? "noopener noreferrer"
                                : undefined}
                            >
                              {item.text}
                            </a>
                          {:else}
                            <div class="event-text">{item.text}</div>
                          {/if}
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  .history-title {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
    color: var(--color-primary);
    font-size: var(--font-size-4xl);
  }

  .year-block {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
    padding: var(--spacing-xl) 0 var(--spacing-xl);
    align-items: start;
    border-bottom: 3px solid rgba(0, 0, 0, 0.18);
    position: relative;
  }

  .year-col {
    text-align: right;
    padding-right: 24px;
    box-sizing: border-box;
  }

  .content-col {
    position: relative;
  }

  .timeline-wrapper {
    position: relative;
    --axis-left: 16px; /* moved axis slightly left */
    padding-left: 44px;
    padding-top: var(--spacing-lg);
  }

  /* Use per-month connectors instead of one continuous line */
  .timeline-line {
    display: none;
  }

  .timeline-items {
    position: relative;
  }

  .year-anchor {
    position: absolute;
    left: var(--axis-left);
    top: 0;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  .month-block {
    position: relative;
    padding: var(--spacing-md) 0;
  }

  /* Per-month vertical connectors: draw a line above and below the centered month label */
  .month-block::before,
  .month-block::after {
    content: "";
    position: absolute;
    left: var(--axis-left);
    width: 2px;
    background-color: rgba(0, 0, 0, 0.06);
    opacity: 0.5;
    z-index: 1;
  }

  .month-block::before {
    top: 0;
    /* stop above the label: adjust the offset if label size changes */
    bottom: calc(50% + 14px);
  }

  .month-block::after {
    top: calc(50% + 14px);
    bottom: 0;
  }

  /* Horizontal separator between months (intra-year) */
  .month-block + .month-block::before {
    content: "";
    position: absolute;
    left: calc(var(--axis-left) + 32px);
    right: 0;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.06);
    opacity: 0.5;
    top: -8px;
    z-index: 2;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    .month-block + .month-block::before {
      left: calc(var(--axis-left) + 24px);
    }

    .timeline-wrapper {
      --axis-left: 20px;
      padding-left: 40px;
      padding-top: var(--spacing-md);
    }

    .year-block {
      padding: var(--spacing-lg) 0 var(--spacing-lg);
      gap: var(--spacing-md);
    }

    .year-label {
      font-size: var(--font-size-xl);
    }
  }

  .month-label {
    position: absolute;
    left: var(--axis-left);
    top: 50%;
    transform: translate(-50%, -50%);
    color: var(--color-text-light);
    background: var(--color-background);
    padding: 6px 10px;
    border-radius: var(--border-radius-full);
    font-weight: 700;
    z-index: 3;
    box-shadow: var(--shadow-sm);
  }

  .timeline-row {
    display: grid;
    grid-template-columns: 56px 40px 1fr;
    gap: var(--spacing-md);
    align-items: center;
    padding: var(--spacing-sm) 0;
  }

  .month-col {
    /* reserved column for month label (kept empty in rows) */
    width: 56px;
  }

  .dot-col {
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .badge {
    display: inline-block;
    width: 12px;
    height: 12px;
    box-sizing: border-box;
  }

  .badge--dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--badge-color);
  }

  .badge--circle {
    border-radius: 50%;
    background-color: var(--badge-color);
  }

  .badge--square {
    background-color: var(--badge-color);
    border-radius: 3px;
  }

  .badge--diamond {
    width: 12px;
    height: 12px;
    background-color: var(--badge-color);
    transform: rotate(45deg);
    border-radius: 2px;
  }

  .badge--triangle {
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 12px solid var(--badge-color);
    transform: translateY(-1px);
  }

  .event-col {
    padding-left: 8px;
  }

  .event-text {
    color: var(--color-text);
  }

  .event-link {
    color: var(--color-primary);
    text-decoration: underline;
    text-decoration-color: var(--color-primary);
  }

  .history-empty {
    text-align: center;
    color: var(--color-text-light);
    margin-bottom: var(--spacing-lg);
  }

  @media (max-width: 768px) {
    .year-label {
      font-size: var(--font-size-xl);
    }

    .timeline-row {
      grid-template-columns: 44px 36px 1fr;
    }
  }
</style>
