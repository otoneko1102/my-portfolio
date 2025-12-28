const cache = new Map();

const getMetaContent = (doc, property, attribute = "property") => {
  const meta = doc.querySelector(`meta[${attribute}="${property}"]`);
  return meta ? meta.getAttribute("content") : null;
};

const extractOGData = (html, url) => {
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

const fetchWithTimeout = async (url, timeout = 3000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "force-cache",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

const fetchWithRetry = async (url, maxRetries = 2) => {
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

export const fetchOGData = async (url) => {
  if (!url) return null;
  if (cache.has(url)) return cache.get(url);

  const urlObj = new URL(url);
  const domain = urlObj.hostname.replace(/^www\./, "");

  try {
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
    ];

    let html = null;
    for (const proxyUrl of proxies) {
      try {
        html = await fetchWithRetry(proxyUrl, 2);
        if (html) break;
      } catch (e) {
        continue;
      }
    }

    if (html) {
      const data = extractOGData(html, url);
      if (data.image && !/^https?:\/\//i.test(data.image)) {
        try {
          data.image = new URL(data.image, url).href;
        } catch (e) {}
      }

      data.url = url;
      data.isFallback = false;
      cache.set(url, data);
      return data;
    }

    throw new Error("All proxies failed");
  } catch (error) {
    const fallbackData = {
      title: domain,
      description: url,
      image: null,
      siteName: domain,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
    };
    cache.set(url, fallbackData);
    return fallbackData;
  }
};

export default { fetchOGData };

// NOTE: fetchOGData returns an object with the following fields:
// {
//   title: string,
//   description: string,
//   image: string | null,
//   siteName: string,
//   favicon: string,
//   url: string,
//   isFallback: boolean
// }
