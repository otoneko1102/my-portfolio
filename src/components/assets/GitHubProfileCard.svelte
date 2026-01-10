<script>
  export let profile = null;
</script>

<div class="card profile-card">
  <div class="profile-row">
    <div class="avatar" aria-hidden="true">
      {#if profile?.avatar_url}
        <img src={profile.avatar_url} alt="" loading="lazy" />
      {:else}
        <span class="avatar-placeholder">@</span>
      {/if}
    </div>
    <div class="profile-meta">
      <div class="profile-name">
        {profile?.login ? `@${profile.login}` : "GitHub"}
      </div>
      {#if profile?.html_url}
        <a
          class="profile-link"
          href={profile.html_url}
          target="_blank"
          rel="noreferrer"
        >
          View profile
        </a>
      {/if}
    </div>
  </div>

  <div class="stats-grid">
    <div class="stat">
      <span class="label">Followers</span>
      <span class="value">{profile?.followers ?? "–"}</span>
    </div>
    <div class="stat">
      <span class="label">Repos</span>
      <span class="value">{profile?.public_repos ?? "–"}</span>
    </div>
    <div class="stat">
      <span class="label">Stars</span>
      <span class="value">{profile?.total_stars ?? "–"}</span>
    </div>
  </div>
</div>

<style>
  .card {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.12);
  }

  .profile-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #334155;
    display: grid;
    place-items: center;
    background: #0b1221;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-placeholder {
    color: #94a3b8;
    font-weight: 700;
  }

  .profile-meta {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .profile-name {
    font-weight: 700;
    color: #f1f5f9;
  }

  .profile-link {
    font-size: 0.875rem;
    color: #3b82f6;
    text-decoration: none;
  }

  .profile-link:hover,
  .profile-link:focus-visible {
    text-decoration: underline;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem;
    border: 1px solid #334155;
    border-radius: 8px;
    background: #1e293b;
    text-align: center;
  }

  .label {
    font-size: 0.75rem;
    color: #94a3b8;
  }

  .value {
    font-weight: 700;
    color: #f1f5f9;
  }
</style>
