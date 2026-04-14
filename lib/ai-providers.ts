import type { ModelId } from "@/types";

const OPENROUTER_REMOTE_MODEL: Record<string, string> = {
  "openrouter-mistral-small": "mistralai/mistral-small-24b-instruct-2501",
};

const TOGETHER_REMOTE_MODEL: Record<string, string> = {
  "together-gemma-3n": "google/gemma-3n-E4B-it",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeJsonParse(text: string): string {
  if (!text?.trim()) {
    console.warn("safeJsonParse: received empty content");
    return "{}";
  }

  // Strip markdown code fences if present
  const block = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (block) text = block[1].trim();

  // Extract first JSON object if surrounded by extra text
  const obj = text.match(/\{[\s\S]*\}/);
  if (obj) text = obj[0];

  try {
    JSON.parse(text);
    return text;
  } catch {
    console.warn("safeJsonParse: failed to parse JSON. Raw content was:\n", text);
    return "{}";
  }
}

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 1000
): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      console.warn(`withRetry: attempt ${i + 1} failed:`, e);
      if (i < retries) await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw lastErr;
}

function enforceJson(systemPrompt: string): string {
  return `${systemPrompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no explanation, no code blocks. Just the raw JSON object.`;
}

// ─── Provider Interface ───────────────────────────────────────────────────────

export interface AIProvider {
  modelId: ModelId;
  complete(prompt: string, systemPrompt: string, options?: { maxTokens?: number }): Promise<string>;
  estimatedCost(inputTokens: number, outputTokens: number): number;
}

// ─── OpenRouter ───────────────────────────────────────────────────────────────

class OpenRouterProvider implements AIProvider {
  constructor(public modelId: ModelId) {}

  async complete(prompt: string, systemPrompt: string, options?: { maxTokens?: number }): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

    const remote = OPENROUTER_REMOTE_MODEL[this.modelId];
    if (!remote) throw new Error(`Unknown OpenRouter model: ${this.modelId}`);

    const isFree = remote.endsWith(":free");
    const messages = isFree
      ? [{ role: "user", content: `${enforceJson(systemPrompt)}\n\n${prompt}` }]
      : [
          { role: "system", content: enforceJson(systemPrompt) },
          { role: "user",   content: prompt },
        ];

    return withRetry(async () => {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization:  `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer":  process.env.OPENROUTER_SITE_URL ?? "https://rawcv.com",
          "X-Title":       "rawcv",
        },
        body: JSON.stringify({
          model:       remote,
          max_tokens:  options?.maxTokens ?? 2000,
          temperature: 0.7,
          messages,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`OpenRouter error (${res.status}) for model "${remote}": ${errText}`);
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;

      if (!content) {
        console.warn("OpenRouter returned empty content. Full response:", JSON.stringify(data));
        throw new Error(`OpenRouter returned empty content for model: ${remote}`);
      }

      return safeJsonParse(content);
    });
  }

  estimatedCost(): number {
    return 0;
  }
}

// ─── Together ─────────────────────────────────────────────────────────────────

class TogetherProvider implements AIProvider {
  constructor(public modelId: ModelId) {}

  async complete(prompt: string, systemPrompt: string, options?: { maxTokens?: number }): Promise<string> {
    const apiKey = process.env.TOGETHER_API_KEY;
    if (!apiKey) throw new Error("TOGETHER_API_KEY is not set");

    const remote = TOGETHER_REMOTE_MODEL[this.modelId];
    if (!remote) throw new Error(`Unknown Together model: ${this.modelId}`);

    return withRetry(async () => {
      const res = await fetch("https://api.together.xyz/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization:  `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model:      remote,
          max_tokens: options?.maxTokens ?? 2000,
          messages: [
            { role: "system", content: enforceJson(systemPrompt) },
            { role: "user",   content: prompt },
          ],
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Together error (${res.status}): ${errText}`);
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;

      if (!content) {
        console.warn("Together returned empty content. Full response:", JSON.stringify(data));
        throw new Error("Together returned empty content");
      }

      return safeJsonParse(content);
    });
  }

  estimatedCost(): number {
    return 0;
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createProvider(modelId: ModelId): AIProvider {
  if (modelId.startsWith("openrouter-")) return new OpenRouterProvider(modelId);
  if (modelId.startsWith("together-"))   return new TogetherProvider(modelId);
  throw new Error(`Unknown model: ${modelId}`);
}