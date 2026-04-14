/**
 * Single AI provider — model is set via OPENROUTER_MODEL env variable.
 */

function safeJsonParse(text: string): string {
  if (!text?.trim()) return "{}";
  const block = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (block) text = block[1].trim();
  const obj = text.match(/\{[\s\S]*\}/);
  if (obj) text = obj[0];
  try { JSON.parse(text); return text; } catch { return "{}"; }
}

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i <= retries; i++) {
    try { return await fn(); } catch (e) {
      lastErr = e;
      if (i < retries) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw lastErr;
}

export async function complete(
  prompt: string,
  systemPrompt: string,
  options?: { maxTokens?: number }
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

  const model = process.env.OPENROUTER_MODEL;
  if (!model) throw new Error("OPENROUTER_MODEL is not set");

  const fullSystem = `${systemPrompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no explanation, no code blocks. Just the raw JSON object.`;

  return withRetry(async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "https://rawcv.com",
          "X-Title": "rawcv",
        },
        body: JSON.stringify({
          model,
          max_tokens: options?.maxTokens ?? 2000,
          temperature: 0.7,
          messages: [
            { role: "system", content: fullSystem },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`OpenRouter error (${res.status}): ${err}`);
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) throw new Error("OpenRouter returned empty content");
      return safeJsonParse(content);
    } finally {
      clearTimeout(timeout);
    }
  });
}
