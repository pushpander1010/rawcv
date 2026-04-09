import type { ModelId } from "@/types";

const GROQ_REMOTE_MODEL: Record<string, string> = {
  "groq-llama-3.1-8b":  "llama-3.1-8b-instant",
  "groq-llama-3.3-70b": "llama-3.3-70b-versatile",
  "groq-deepseek-r1":   "deepseek-r1-distill-llama-70b",
};

const OPENROUTER_REMOTE_MODEL: Record<string, string> = {
  "openrouter-gemma-4-27b":      "google/gemma-4-26b-a4b-it:free",
  "openrouter-qwen-7b":          "qwen/qwen-2.5-7b-instruct",
  "openrouter-mistral-small":    "mistralai/mistral-small-3.1-24b-instruct",
  "openrouter-llama-4-maverick": "meta-llama/llama-4-maverick",
  "openrouter-deepseek-v3":      "deepseek/deepseek-chat-v3-0324",
};

function safeJsonParse(text: string): string {
  try { JSON.parse(text); return text; } catch { return "{}"; }
}

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try { return await fn(); } catch (e) { lastErr = e; }
  }
  throw lastErr;
}

function enforceJson(systemPrompt: string) {
  return `${systemPrompt}\nReturn ONLY valid JSON. No explanation.`;
}

export interface AIProvider {
  modelId: ModelId;
  complete(prompt: string, systemPrompt: string): Promise<string>;
  estimatedCost(inputTokens: number, outputTokens: number): number;
}

// ─── Groq ─────────────────────────────────────────────────────────────────────

class GroqProvider implements AIProvider {
  constructor(public modelId: ModelId) {}

  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is not set");
    const remote = GROQ_REMOTE_MODEL[this.modelId];
    if (!remote) throw new Error(`Unknown Groq model: ${this.modelId}`);

    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey, baseURL: "https://api.groq.com/openai/v1" });

    return withRetry(async () => {
      const res = await client.chat.completions.create({
        model: remote,
        max_tokens: 2000,
        messages: [
          { role: "system", content: enforceJson(systemPrompt) },
          { role: "user", content: prompt },
        ],
      });
      return safeJsonParse(res.choices[0]?.message?.content ?? "{}");
    });
  }

  estimatedCost(inputTokens: number, outputTokens: number): number {
    const rates: Record<string, [number, number]> = {
      "groq-llama-3.1-8b":  [0.00005,  0.00008],
      "groq-llama-3.3-70b": [0.00059,  0.00079],
      "groq-deepseek-r1":   [0.00075,  0.00099],
    };
    const [i, o] = rates[this.modelId] ?? [0.0001, 0.0002];
    return (inputTokens / 1000) * i + (outputTokens / 1000) * o;
  }
}

// ─── OpenRouter ───────────────────────────────────────────────────────────────

class OpenRouterProvider implements AIProvider {
  constructor(public modelId: ModelId) {}

  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");
    const remote = OPENROUTER_REMOTE_MODEL[this.modelId];
    if (!remote) throw new Error(`Unknown OpenRouter model: ${this.modelId}`);

    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "https://rawcv.com",
        "X-Title": "rawcv",
      },
    });

    return withRetry(async () => {
      const res = await client.chat.completions.create({
        model: remote,
        max_tokens: 2000,
        messages: [
          { role: "system", content: enforceJson(systemPrompt) },
          { role: "user", content: prompt },
        ],
      });
      return safeJsonParse(res.choices[0]?.message?.content ?? "{}");
    });
  }

  estimatedCost(inputTokens: number, outputTokens: number): number {
    const rates: Record<string, [number, number]> = {
      "openrouter-gemma-4-27b":      [0,        0],
      "openrouter-qwen-7b":          [0.0001,   0.0001],
      "openrouter-mistral-small":    [0.0001,   0.0003],
      "openrouter-llama-4-maverick": [0.00018,  0.00059],
      "openrouter-deepseek-v3":      [0.00027,  0.0011],
    };
    const [i, o] = rates[this.modelId] ?? [0.0002, 0.0002];
    return (inputTokens / 1000) * i + (outputTokens / 1000) * o;
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createProvider(modelId: ModelId): AIProvider {
  if (modelId.startsWith("groq-")) return new GroqProvider(modelId);
  if (modelId.startsWith("openrouter-")) return new OpenRouterProvider(modelId);
  throw new Error(`Unknown model: ${modelId}`);
}
