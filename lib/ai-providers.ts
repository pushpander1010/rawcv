import type { ModelId } from "@/types";

const GROQ_REMOTE_MODEL: Record<string, string> = {
  "groq-llama-3.1-8b":  "llama-3.1-8b-instant"
};

const OPENROUTER_REMOTE_MODEL: Record<string, string> = {
  "openrouter-nvidia-30b":       "nvidia/nemotron-3-nano-30b-a3b:free",
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
        temperature: 0.7,
        messages: [
          { role: "system", content: enforceJson(systemPrompt) },
          { role: "user", content: prompt },
        ],
      });
      return safeJsonParse(res.choices[0]?.message?.content ?? "{}");
    });
  }

  estimatedCost(): number { return 0; }
}

// ─── OpenRouter ───────────────────────────────────────────────────────────────

class OpenRouterProvider implements AIProvider {
  constructor(public modelId: ModelId) {}

  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");
    const remote = OPENROUTER_REMOTE_MODEL[this.modelId];
    if (!remote) throw new Error(`Unknown OpenRouter model: ${this.modelId}`);

    const isFree = remote.endsWith(":free");
    const messages = isFree
      ? [{ role: "user", content: `${enforceJson(systemPrompt)}\n\n${prompt}` }]
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
      return safeJsonParse(data?.choices?.[0]?.message?.content ?? "{}");
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
  if (modelId.startsWith("groq-")) return new GroqProvider(modelId);
  if (modelId.startsWith("openrouter-")) return new OpenRouterProvider(modelId);
  if (modelId.startsWith("together-")) return new TogetherProvider(modelId);
  throw new Error(`Unknown model: ${modelId}`);
}
