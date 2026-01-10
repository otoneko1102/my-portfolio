<script>
  export let activity = [];

  let sorted = [];
  let maxCommits = 1;
  let sparklinePoints = "";
  let sparklineArea = "";
  let totalCommits = 0;
  let lastCommit = null;

  $: sorted = (activity || [])
    .filter((item) => item?.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  $: maxCommits =
    sorted.reduce((max, item) => Math.max(max, item.count || 0), 0) || 1;

  $: sparklinePoints = sorted.length
    ? sorted
        .map((item, index) => {
          const x =
            sorted.length === 1 ? 0 : (index / (sorted.length - 1)) * 100;
          const y = 100 - ((item.count || 0) / maxCommits) * 100;
          return `${x},${y}`;
        })
        .join(" ")
    : "";

  $: sparklineArea = sparklinePoints ? `0,100 ${sparklinePoints} 100,100` : "";

  $: totalCommits = sorted.reduce((sum, item) => sum + (item.count || 0), 0);
  $: lastCommit = sorted.length ? sorted[sorted.length - 1] : null;
</script>

<div class="card activity-card">
  <div class="card-head">
    <span class="card-title">Recent commits</span>
    <span class="card-sub">
      {#if sorted.length}
        Last {sorted.length} days · Max/day {maxCommits}
      {:else}
        No data
      {/if}
    </span>
  </div>

  {#if sorted.length}
    <div
      class="sparkline"
      role="img"
      aria-label="Recent commit activity sparkline"
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline class="area" points={sparklineArea} />
        <polyline class="line" points={sparklinePoints} />
      </svg>
    </div>
    <div class="legend">
      <span>{totalCommits} commits total</span>
      {#if lastCommit}
        <span>Last day {lastCommit.count} commits</span>
      {/if}
    </div>
  {:else}
    <div class="empty">No commit data found.</div>
  {/if}
</div>

<style>
  .card {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.12);
  }

  .card-head {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 0.5rem;
    gap: 0.25rem;
  }

  .card-title {
    font-weight: 700;
    color: #f1f5f9;
    white-space: nowrap;
  }

  .card-sub {
    color: #94a3b8;
    font-size: 0.75rem;
    white-space: nowrap;
  }

  .sparkline {
    width: 100%;
    height: 120px;
    background: #1e293b;
    border: 1px solid #475569;
    border-radius: 8px;
    padding: 0.5rem;
  }

  svg {
    width: 100%;
    height: 100%;
  }

  .area {
    fill: rgba(34, 197, 94, 0.25);
    stroke: none;
  }

  .line {
    fill: none;
    stroke: #22c55e;
    stroke-width: 2;
    stroke-linejoin: round;
    stroke-linecap: round;
  }

  .legend {
    display: flex;
    justify-content: space-between;
    margin-top: 0.25rem;
    color: #94a3b8;
    font-size: 0.75rem;
    white-space: nowrap;
  }

  .empty {
    text-align: center;
    padding: 1.5rem;
    color: #94a3b8;
  }

  @media (max-width: 768px) {
    .legend {
      flex-direction: column;
      gap: 0.25rem;
      align-items: flex-start;
      white-space: nowrap;
    }
  }
</style>
