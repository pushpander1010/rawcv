import type { ModelId } from "@/types";

const OPENROUTER_REMOTE_MODEL: Record<string, string> = {
  "openrouter-liquid-1.2b":       "liquid/lfm-2.5-1.2b-thinking:free",
  "openrouter-qwen-7b":          "qwen/qwen-2.5-7b-instruct",
  "openrouter-mistral-small":    "mistralai/mistral-small-3.1-24b-instruct",
  "openrouter-llama-4-maverick": "meta-llama/llama-4-maverick",
  "openrouter-deepseek-v3":      "deepseek/deepseek-chat-v3-0324",
};

function safeJsonParse(text: string): string {
  if (!text?.trim()) return "{}";
  const block = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (block) text = block[1].trim();
  const obj = text.match(/\{[\s\S]*\}/);
  if (obj) text = obj[0];
  try { JSON.parse(text); return text; } catch { return "{}"; }
}

async function withRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 1000): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i <= retries; i++) {
    try { return await fn(); } catch (e) {
      lastErr = e;
      if (i < retries) await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw lastErr;
}

function enforceJson(systemPrompt: string): string {
  return `${systemPrompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no explanation, no code blocks. Just the raw JSON object.`;
}

export interface AIProvider {
  modelId: ModelId;
  complete(prompt: string, systemPrompt: string): Promise<string>;
  estimatedCost(inputTokens: number, outputTokens: number): number;
}

// ─── OpenRouter ───────────────────────────────────────────────────────────────

class OpenRouterProvider implements AIProvider {
  constructor(public modelId: ModelId) {}

  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");
    const remote = OPENROUTER_REMOTE_MODEL[this.modelId];
    if (!remote) throw new Error(`Unknown OpenRouter model: ${this.modelId}`);

    // Free models don't support the system role — inject instructions into the user turn
    const isFree = remote.endsWith(":free");
    const messages = isFree
      ? [{ role: "user", content: `[INST] ${enforceJson(systemPrompt)} [/INST]\n\n${prompt}` }]
      : [{ role: "system", content: enforceJson(systemPrompt) }, { role: "user", content: prompt }];

    return withRetry(async () => {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "https://rawcv.com",
          "X-Title": "rawcv",
        },
        body: JSON.stringify({ model: remote, max_tokens: 2000, temperature: 0.7, messages }),
      });
      if (!res.ok) throw new Error(`OpenRouter error (${res.status}): ${await res.text()}`);
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) throw new Error(`OpenRouter returned empty content for model: ${remote}`);
      return safeJsonParse(content);
    });
  }

  estimatedCost(): number { return 0; }
}

// ─── Together ─────────────────────────────────────────────────────────────────

class TogetherProvider implements AIProvider {
  constructor(public modelId: ModelId) {}

  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const apiKey = process.env.TOGETHER_API_KEY;
    if (!apiKey) throw new Error("TOGETHER_API_KEY is not set");

    return withRetry(async () => {
      const res = await fetch("https://api.together.xyz/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemma-3n-E4B-it",
          max_tokens: 2000,
          messages: [
            { role: "system", content: enforceJson(systemPrompt) },
            { role: "user", content: prompt },
          ],
        }),
      });
      if (!res.ok) throw new Error(`Together error (${res.status}): ${await res.text()}`);
      const data = await res.json();
      return safeJsonParse(data?.choices?.[0]?.message?.content ?? "{}");
    });
  }

  estimatedCost(): number { return 0; }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createProvider(modelId: ModelId): AIProvider {
  if (modelId.startsWith("openrouter-")) return new OpenRouterProvider(modelId);
  if (modelId.startsWith("together-")) return new TogetherProvider(modelId);
  throw new Error(`Unknown model: ${modelId}`);
}