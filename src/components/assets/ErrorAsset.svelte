<script lang="ts">
  import { onMount } from "svelte";

  export let code: string;
  export let title: string;
  export let description: string = "";
  export let icon: string | null;
  export let variant: "default" | "teapot" = "default";
  export let redirectAfter: number | null; // sec
  export let redirectTo: string = "/";
  export let backText: string = "トップページへ戻る";

  let countdown = redirectAfter ?? 0;

  onMount(() => {
    if (typeof redirectAfter === "number" && redirectAfter > 0) {
      countdown = redirectAfter;
      const timer = setInterval(() => {
        countdown -= 1;
        if (countdown <= 0) {
          clearInterval(timer);
          window.location.href = redirectTo;
        }
      }, 1000);
    }
  });
</script>

<div
  class={`error-container ${variant}`}
  role="region"
  aria-labelledby="error-title"
>
  <div class="error-content">
    {#if icon}
      <div class="error-icon" aria-hidden="true">{icon}</div>
    {/if}
    <h1 class="error-code">{code}</h1>

    <div class="message-card" role="group" aria-labelledby="error-title">
      <h2 id="error-title" class="error-message">{title}</h2>
      {#if description}
        <p class="error-description">{description}</p>
      {/if}
      {#if typeof redirectAfter === "number" && redirectAfter > 0}
        <p class="redirect-message">
          <span id="countdown">{countdown}</span
          >秒後にトップページへリダイレクトします...
        </p>
      {/if}
      <a class="back-button gradient-btn" href={redirectTo} data-no-preview
        >{backText}</a
      >
    </div>
  </div>
</div>

<style>
  .error-container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
    inset: 0;
    z-index: 0; /* allow header/footer (higher z-index) to overlay */
  }

  .error-container.default {
    background: transparent;
  }

  /* Teapot uses an image background with a subtle overlay for readability */
  .error-container.teapot {
    background-image: url("/teapot.png");
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    background-color: #f5576c; /* fallback */
    position: relative;
    overflow-x: hidden; /* hide any horizontal overflow from the background */
  }

  .error-container.teapot::before {
    content: "";
    position: absolute;
    inset: 0;
    /* subtle dark overlay to ensure contrast with varying images */
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.25) 0%,
      rgba(0, 0, 0, 0.25) 100%
    );
    z-index: 0;
  }

  /* Hide inline icon for teapot variant (we also remove the prop in the invocation) */
  .error-container.teapot .error-icon {
    display: none;
  }

  .error-content {
    text-align: center;
    color: white;
    max-width: 560px;
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    position: relative;
    z-index: 1;
  }

  .error-content {
    text-align: center;
    color: white;
    max-width: 560px;
    width: 100%;
    padding: 0 var(--spacing-sm);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  .message-card {
    margin-top: 0;
    background: transparent;
    color: var(--color-text);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-md) var(--spacing-lg);
    box-shadow: 0 0 0 transparent;
    backdrop-filter: none;
  }

  .message-card .error-message,
  .message-card .error-description,
  .message-card .redirect-message {
    text-shadow: none;
    margin: 0;
  }

  .message-card .gradient-btn {
    margin-top: var(--spacing-sm);
  }

  .error-icon {
    font-size: 52px;
    margin-bottom: 0;
    animation: steam 2s ease-in-out infinite;
  }

  @keyframes steam {
    0%,
    100% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    50% {
      transform: translateY(-8px) scale(1.03);
      opacity: 0.9;
    }
  }

  .error-code {
    font-size: 60px;
    font-weight: 700;
    line-height: 1;
    margin: 0;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  .error-message {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin: 0;
    line-height: 1.15;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  .error-description {
    font-size: var(--font-size-xs);
    margin: 0;
    line-height: 1.4;
    opacity: 0.9;
  }

  .redirect-message {
    font-size: var(--font-size-xs);
    margin: 0;
    opacity: 0.85;
  }

  .gradient-btn {
    display: inline-block;
    margin-top: 0;
    padding: var(--spacing-xs) var(--spacing-sm);
    background: var(--brand-gradient);
    color: #ffffff;
    text-decoration: none;
    border-radius: var(--border-radius-full);
    font-weight: 700;
    font-size: var(--font-size-sm);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
    transition:
      transform var(--transition-normal),
      box-shadow var(--transition-normal),
      opacity var(--transition-normal);
  }

  .gradient-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 26px rgba(99, 102, 241, 0.45);
    opacity: 0.95;
  }

  @media (max-width: 768px) {
    .error-container {
      height: 100vh;
      position: fixed;
      inset: 0;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .error-icon {
      font-size: 44px;
    }
    .error-code {
      font-size: 48px;
    }
    .error-message {
      font-size: var(--font-size-base);
    }
    .message-card {
      padding: var(--spacing-sm) var(--spacing-md);
    }
  }
</style>
