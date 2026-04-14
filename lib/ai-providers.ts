import { z } from "zod";

/**
 * Optional: Define schema (fallback)
 */
const DefaultSchema = z.any();

/**
 * Extract JSON safely from model output, handling markdown blocks
 * and grabbing text exclusively between the first { and last }
 */
function extractJson(text: string): string {
  if (!text?.trim()) throw new Error("Empty response");

  let cleaned = text.trim();

  // Remove markdown blocks using hex codes (\x60) for backticks to prevent parser issues
  const block = cleaned.match(/\x60\x60\x60(?:json)?\s*([\s\S]*?)\x60\x60\x60/);
  if (block) cleaned = block[1].trim();

  // Extract first valid JSON object boundaries
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

/**
 * Parse + validate JSON with retry signal
 */
function parseAndValidate<T>(text: string, schema: z.ZodSchema<T>): T {
  try {
    const cleaned = extractJson(text);
    const parsed = JSON.parse(cleaned);
    return schema.parse(parsed);
  } catch (err) {
    console.error("❌ Invalid JSON Payload Received:\n", text);
    throw new Error("Invalid JSON from model");
  }
}

/**
 * Wrapper to auto-retry network/AI failures
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let lastErr: unknown;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      console.warn(`⚠️ AI Request Retry ${i + 1} failed:`, e instanceof Error ? e.message : String(e));

      if (i < retries) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  }

  throw lastErr;
}

export async function complete<T = any>(
  prompt: string,
  systemPrompt: string,
  options?: {
    maxTokens?: number;
    schema?: z.ZodSchema<T>;
  }
): Promise<T> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  // Strongly recommended: Use a model built for fast, strict JSON extraction
  const model = "google/gemini-2.5-flash";

  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

  const schema = options?.schema ?? DefaultSchema;

  const fullSystem = `${systemPrompt}

STRICT RULES:
- Return ONLY valid JSON
- No markdown wrappers (do not use markdown code blocks)
- No explanation or conversational text
- Must match the requested schema strictly`;

  return withRetry(async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
      const res = await fetch("[https://openrouter.ai/api/v1/chat/completions](https://openrouter.ai/api/v1/chat/completions)", {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "[https://rawcv.com](https://rawcv.com)",
          "X-Title": "rawcv",
        },
        body: JSON.stringify({
          model,
          max_tokens: options?.maxTokens ?? 2500,
          temperature: 0.1, // Lower temperature to prevent hallucinated data
          response_format: { type: "json_object" }, 
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

      if (!content) {
        throw new Error("Empty response from model");
      }

      return parseAndValidate(content, schema);
    } finally {
      clearTimeout(timeout);
    }
  });
}