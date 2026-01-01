export type OGData = {
  title: string;
  description: string;
  image: string | null;
  siteName: string;
  favicon: string;
  url: string;
  isFallback: boolean;
};

const cache = new Map<string, OGData>();

// Use external OGP API for fetching metadata instead of scraping HTML.
// Endpoint: https://ogp.montblank.fun?url={encodedUrl}

const fetchWithTimeout = async (
  url: string,
  timeout = 3000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "force-cache" as RequestCache,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// fetchWithRetry removed — using direct API call instead.

export const fetchOGData = async (
  url?: string | null
): Promise<OGData | null> => {
  if (!url) return null;
  if (cache.has(url)) return cache.get(url)!;

  const urlObj = new URL(url);
  const domain = urlObj.hostname.replace(/^www\./, "");

  try {
    const apiUrl = `https://ogp.montblank.fun?url=${encodeURIComponent(url)}`;

    const response = await fetchWithTimeout(apiUrl, 3000);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();

    const data: OGData = {
      title:
        typeof json.title === "string" && json.title.length > 0
          ? json.title
          : domain,
      description:
        typeof json.description === "string" && json.description.length > 0
          ? json.description
          : url,
      image:
        typeof json.image === "string" && json.image.length > 0
          ? json.image
          : null,
      siteName:
        typeof json.siteName === "string" && json.siteName.length > 0
          ? json.siteName
          : domain,
      favicon:
        typeof json.favicon === "string" && json.favicon.length > 0
          ? json.favicon
          : `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      url: typeof json.url === "string" && json.url.length > 0 ? json.url : url,
      isFallback: Boolean(json.isFallback || false),
    };

    // Resolve relative image URLs
    if (data.image && !/^https?:\/\//i.test(data.image)) {
      try {
        data.image = new URL(data.image, data.url || url).href;
      } catch (e) {
        // ignore
      }
    }

    cache.set(url, data);
    return data;
  } catch (error) {
    const fallbackData: OGData = {
      title: domain,
      description: url,
      image: null,
      siteName: domain,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      url,
      isFallback: true,
    };
    cache.set(url, fallbackData);
    return fallbackData;
  }
};

export default { fetchOGData };
