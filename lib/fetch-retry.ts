/**
 * Fetch with automatic retry on timeout or network errors
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param maxRetries - Maximum number of retries (default: 2)
 * @param timeout - Timeout in milliseconds (default: 60000)
 * @returns Promise<Response>
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 2,
  timeout = 60000
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return res;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Log retry attempt
      console.log(`[fetchWithRetry] Attempt ${attempt + 1} failed for ${url}, retrying...`);

      // Exponential backoff: 1s, 2s, 3s...
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  throw lastError || new Error("Request failed after retries");
}

/**
 * Safely parse JSON response with error handling
 * @param res - Response object
 * @returns Parsed JSON data
 * @throws Error with helpful message if JSON parsing fails
 */
export async function safeJsonParse<T = unknown>(res: Response): Promise<T> {
  try {
    return await res.json();
  } catch (err) {
    console.error("[safeJsonParse] JSON parse error:", err);
    const text = await res.text().catch(() => "(unable to read response)");
    console.error("[safeJsonParse] Response text:", text.slice(0, 500));
    throw new Error("Invalid response from server. Please try again.");
  }
}

/**
 * Fetch with retry and safe JSON parsing
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param maxRetries - Maximum number of retries (default: 2)
 * @param timeout - Timeout in milliseconds (default: 60000)
 * @returns Parsed JSON data
 */
export async function fetchJsonWithRetry<T = unknown>(
  url: string,
  options: RequestInit = {},
  maxRetries = 2,
  timeout = 60000
): Promise<T> {
  const res = await fetchWithRetry(url, options, maxRetries, timeout);
  return safeJsonParse<T>(res);
}
