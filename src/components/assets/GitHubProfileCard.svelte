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
    <a
      class="profile-meta"
      href={profile?.html_url || "#"}
      target="_blank"
      rel="noreferrer"
    >
      <div class="profile-display-name">
        {profile?.name || profile?.login || "GitHub"}
      </div>
      {#if profile?.login}
        <div class="profile-username">@{profile.login}</div>
      {/if}
    </a>
  </div>

  <div class="stats-grid">
    <div class="stat">
      <span class="label">Followers</span>
      <iconify-icon
        icon="mdi:account-multiple"
        width="18"
        height="18"
        class="icon"
        aria-hidden="true"
      ></iconify-icon>
      <span class="value">{profile?.followers ?? "-"}</span>
    </div>
    <div class="stat">
      <span class="label">Repos</span>
      <iconify-icon
        icon="mdi:book-outline"
        width="18"
        height="18"
        class="icon"
        aria-hidden="true"
      ></iconify-icon>
      <span class="value">{profile?.public_repos ?? "-"}</span>
    </div>
    <div class="stat">
      <span class="label">Stars</span>
      <iconify-icon
        icon="mdi:star"
        width="18"
        height="18"
        class="icon"
        aria-hidden="true"
      ></iconify-icon>
      <span class="value">{profile?.total_stars ?? "-"}</span>
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
    height: 100%;
    display: flex;
    flex-direction: column;
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
    font-size: 1.25rem;
    font-weight: 700;
  }

  .profile-meta {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    text-decoration: none;
  }

  .profile-display-name {
    font-weight: 700;
    color: #f1f5f9;
  }

  .profile-username {
    font-size: 0.75rem;
    color: #64748b;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    flex: 1;
    align-content: start;
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

  .icon {
    width: 18px;
    height: 18px;
    align-self: center;
    color: #94a3b8;
  }
</style>
