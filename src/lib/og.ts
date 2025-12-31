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

const getMetaContent = (
  doc: Document,
  property: string,
  attribute: "property" | "name" = "property"
): string | null => {
  const meta = doc.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${property}"]`
  );
  return meta ? meta.getAttribute("content") : null;
};

const extractOGData = (html: string, url: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const urlObj = new URL(url);
  const domain = urlObj.hostname.replace(/^www\./, "");

  const title =
    getMetaContent(doc, "og:title") ||
    getMetaContent(doc, "twitter:title") ||
    doc.querySelector("title")?.textContent ||
    domain;

  const description =
    getMetaContent(doc, "og:description") ||
    getMetaContent(doc, "twitter:description") ||
    getMetaContent(doc, "description", "name") ||
    "";

  const image =
    getMetaContent(doc, "og:image") ||
    getMetaContent(doc, "twitter:image") ||
    null;

  const siteName = getMetaContent(doc, "og:site_name") || domain;

  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  return { title, description, image, siteName, favicon };
};

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

const fetchWithRetry = async (url: string, maxRetries = 2): Promise<string> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      if (i > 0) await new Promise((r) => setTimeout(r, i * 200));
      const response = await fetchWithTimeout(url, 3000);
      if (response.ok) return await response.text();
    } catch (e) {
      if (i === maxRetries - 1) throw e;
      continue;
    }
  }
  throw new Error("Max retries exceeded");
};

export const fetchOGData = async (
  url?: string | null
): Promise<OGData | null> => {
  if (!url) return null;
  if (cache.has(url)) return cache.get(url)!;

  const urlObj = new URL(url);
  const domain = urlObj.hostname.replace(/^www\./, "");

  try {
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
    ];

    let html: string | null = null;
    for (const proxyUrl of proxies) {
      try {
        html = await fetchWithRetry(proxyUrl, 2);
        if (html) break;
      } catch (e) {
        continue;
      }
    }

    if (html) {
      const dataPartial = extractOGData(html, url);
      const data: OGData = {
        ...dataPartial,
        url,
        isFallback: false,
      };

      if (data.image && !/^https?:\/\//i.test(data.image)) {
        try {
          data.image = new URL(data.image, url).href;
        } catch (e) {
          // ignore
        }
      }

      cache.set(url, data);
      return data;
    }

    throw new Error("All proxies failed");
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
