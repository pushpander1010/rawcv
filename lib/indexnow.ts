/**
 * IndexNow API client for instant search engine indexing
 * Submits URL changes to Bing, Yandex, and other participating search engines
 */

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

interface IndexNowOptions {
  host: string;
  key: string;
  keyLocation: string;
}

/**
 * Submit a single URL to IndexNow
 */
export async function submitToIndexNow(
  url: string,
  options: IndexNowOptions
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: options.host,
        key: options.key,
        keyLocation: options.keyLocation,
        urlList: [url],
      }),
    });

    if (response.status === 200 || response.status === 202) {
      return { success: true };
    }

    return {
      success: false,
      error: `IndexNow returned status ${response.status}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Submit multiple URLs to IndexNow (max 10,000 per request)
 */
export async function submitBatchToIndexNow(
  urls: string[],
  options: IndexNowOptions
): Promise<{ success: boolean; error?: string }> {
  if (urls.length === 0) {
    return { success: false, error: "No URLs provided" };
  }

  if (urls.length > 10000) {
    return { success: false, error: "Maximum 10,000 URLs per request" };
  }

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: options.host,
        key: options.key,
        keyLocation: options.keyLocation,
        urlList: urls,
      }),
    });

    if (response.status === 200 || response.status === 202) {
      return { success: true };
    }

    return {
      success: false,
      error: `IndexNow returned status ${response.status}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
