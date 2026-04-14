import { z } from "zod";

/**
 * Optional: Define schema (example)
 * Replace this with your resume schema
 */
const DefaultSchema = z.any();

/**
 * Extract JSON safely from model output
 */
function extractJson(text: string): string {
  if (!text?.trim()) throw new Error("Empty response");

  // Remove markdown blocks
  const block = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (block) text = block[1].trim();

  // Extract first JSON object
  const obj = text.match(/\{[\s\S]*\}/);
  if (obj) text = obj[0];

  return text;
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
    console.error("❌ Invalid JSON:\n", text);
    throw new Error("Invalid JSON from model");
  }
}

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let lastErr: unknown;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      console.warn(`⚠️ Retry ${i + 1} failed:`, e);

      if (i < retries) {
        await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
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
  const model = "qwen/qwen3.5-9b";

  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

  const schema = options?.schema ?? DefaultSchema;

  const fullSystem = `${systemPrompt}

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanation
- No trailing text
- Must match schema strictly`;

  return withRetry(async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 80000);

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
          temperature: 0.2,
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
      console.log("🔍 RAW RESPONSE:", JSON.stringify(data, null, 2));

      const content = data?.choices?.[0]?.message?.content;

      if (!content) {
        console.error("❌ Empty content:", data);
        throw new Error("Empty response from model");
      }

      return parseAndValidate(content, schema);
    } finally {
      clearTimeout(timeout);
    }
  });
}