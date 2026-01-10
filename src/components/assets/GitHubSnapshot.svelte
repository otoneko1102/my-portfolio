<script>
  import { onMount } from "svelte";
  import GitHubProfileCard from "./GitHubProfileCard.svelte";
  import GitHubCommitActivity from "./GitHubCommitActivity.svelte";
  import MostUsedLangs from "./MostUsedLangs.svelte";

  export let apiUrl = "https://github-most-used-langs.montblank.fun/";

  let loading = true;
  let error = null;
  let profile = null;
  let languages = [];
  let commitActivity = [];
  let lastFetched = null;

  const normalizeCommitActivity = (activity = []) => {
    if (!Array.isArray(activity)) return [];
    return activity
      .map((item) => ({
        date: item.date,
        count: item.count ?? item.commits ?? item.total ?? 0,
      }))
      .filter((item) => item.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const fetchFromApi = async () => {
    loading = true;
    error = null;
    try {
      const url =
        apiUrl + (apiUrl.includes("?") ? "&" : "?") + "_=" + Date.now();
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`API error ${res.status}`);

      const data = await res.json();

      profile = data?.profile
        ? {
            name: data.profile.name || null,
            login: data.profile.login,
            html_url: data.profile.html_url,
            avatar_url: data.profile.avatar_url,
            followers: data.profile.followers ?? 0,
            public_repos: data.profile.public_repos ?? 0,
            total_stars: data.profile.total_stars ?? data.profile.stars ?? 0,
          }
        : null;

      languages = (data.languages || [])
        .map((l) => ({
          name: l.name,
          bytes: l.bytes || 0,
          percentage: Number(l.percentage).toFixed(2),
          color: l.color || "#8b8b8b",
        }))
        .sort((a, b) => b.bytes - a.bytes);

      commitActivity = normalizeCommitActivity(data?.commit_activity);
      lastFetched =
        data?.meta?.cached_at ||
        data?.profile?.fetched_at ||
        new Date().toISOString();
    } catch (e) {
      error = e.message || String(e);
      profile = null;
      languages = [];
      commitActivity = [];
      lastFetched = null;
    } finally {
      loading = false;
    }
  };

  onMount(fetchFromApi);
</script>

{#if loading}
  <div class="loading">
    <div class="spinner"></div>
    <span>Loading…</span>
  </div>
{:else if error}
  <div class="error">Failed to load GitHub data: {error}</div>
{:else}
  <div class="summary-grid">
    <GitHubProfileCard {profile} />
    <GitHubCommitActivity activity={commitActivity} />
  </div>

  <MostUsedLangs {languages} />
{/if}

<style>
  .loading,
  .error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
    padding: 3rem;
    color: #94a3b8;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #334155;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  @media (max-width: 768px) {
    .summary-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
