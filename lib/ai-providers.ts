import type { ModelId } from "@/types";

/** ─────────────────────────────────────────────────────────────
 * Remote model mappings
 * ───────────────────────────────────────────────────────────── */

const GROQ_REMOTE_MODEL: Record<string, string> = {
  "groq-llama-3.1-8b": "llama-3.1-8b-instant",
  "groq-llama-3.3-70b": "llama-3.3-70b-versatile",
};

const OPENROUTER_REMOTE_MODEL: Record<string, string> = {
  "openrouter-qwen-7b": "qwen/qwen-2.5-7b-instruct",
};

/** ─────────────────────────────────────────────────────────────
 * Utils
 * ───────────────────────────────────────────────────────────── */

function safeJsonParse(text: string): string {
  try {
    JSON.parse(text);
    return text;
  } catch {
    return "{}";
  }
}

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

function enforceJson(systemPrompt: string) {
  return `${systemPrompt}\nReturn ONLY valid JSON. No explanation.`;
}

/** ─────────────────────────────────────────────────────────────
 * Interface
 * ───────────────────────────────────────────────────────────── */

export interface AIProvider {
  modelId: ModelId;
  complete(prompt: string, systemPrompt: string): Promise<string>;
  estimatedCost(inputTokens: number, outputTokens: number): number;
}

/** ─────────────────────────────────────────────────────────────
 * OpenAI
 * ───────────────────────────────────────────────────────────── */

class OpenAIProvider implements AIProvider {
  constructor(public modelId: ModelId) {}

  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const { default: OpenAI } = await import("openai");

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    return withRetry(async () => {
      const res = await client.chat.completions.create({
        model: this.modelId,
        max_tokens: 2000,
        messages: [
          { role: "system", content: enforceJson(systemPrompt) },
          { role: "user", content: prompt },
        ],
        ...(this.modelId.includes("gpt-4o")
          ? { response_format: { type: "json_object" } }
          : {}),
      });

      const content = res.choices[0]?.message?.content ?? "{}";
      return safeJsonParse(content);
    });
  }

  estimatedCost(inputTokens: number, outputTokens: number): number {
    const rates: Record<string, [number, number]> = {
      "gpt-4o-mini": [0.00015, 0.0006],
      "gpt-4o": [0.005, 0.015],
    };
    const [inRate, outRate] = rates[this.modelId] ?? [0.005, 0.015];
    return (inputTokens / 1000) * inRate + (outputTokens / 1000) * outRate;
  }
}

/** ─────────────────────────────────────────────────────────────
 * Gemini
 * ───────────────────────────────────────────────────────────── */

class GeminiProvider implements AIProvider {
  constructor(public modelId: ModelId) {}

  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model:
        this.modelId === "gemini-2.5-flash"
          ? "gemini-2.5-flash"
          : "gemini-2.5-pro",
      systemInstruction: enforceJson(systemPrompt),
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    return withRetry(async () => {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return safeJsonParse(text);
    });
  }

  estimatedCost(inputTokens: number, outputTokens: number): number {
    const rates: Record<string, [number, number]> = {
      "gemini-2.5-flash": [0.000075, 0.0003],
      "gemini-2.5-pro": [0.00125, 0.005],
    };
    const [inRate, outRate] = rates[this.modelId] ?? [0.00125, 0.005];
    return (inputTokens / 1000) * inRate + (outputTokens / 1000) * outRate;
  }
}

/** ─────────────────────────────────────────────────────────────
 * Anthropic
 * ───────────────────────────────────────────────────────────── */

class AnthropicProvider implements AIProvider {
  constructor(public modelId: ModelId) {}

  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    return withRetry(async () => {
      const res = await client.messages.create({
        model:
          this.modelId === "claude-haiku"
            ? "claude-3-haiku-20240307"
            : "claude-3-5-sonnet-20241022",
        max_tokens: 2000,
        system: enforceJson(systemPrompt),
        messages: [{ role: "user", content: prompt }],
      });

      const text = res.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("");

      return safeJsonParse(text);
    });
  }

  estimatedCost(inputTokens: number, outputTokens: number): number {
    const rates: Record<string, [number, number]> = {
      "claude-haiku": [0.00025, 0.00125],
      "claude-sonnet": [0.003, 0.015],
    };
    const [inRate, outRate] = rates[this.modelId] ?? [0.003, 0.015];
    return (inputTokens / 1000) * inRate + (outputTokens / 1000) * outRate;
  }
}

/** ─────────────────────────────────────────────────────────────
 * Groq
 * ───────────────────────────────────────────────────────────── */

class GroqProvider implements AIProvider {
  constructor(public modelId: ModelId) {}

  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is not set");

    const remote = GROQ_REMOTE_MODEL[this.modelId];
    if (!remote) throw new Error(`Unknown Groq model: ${this.modelId}`);

    const { default: OpenAI } = await import("openai");

    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
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

      const content = res.choices[0]?.message?.content ?? "{}";
      return safeJsonParse(content);
    });
  }

  estimatedCost(inputTokens: number, outputTokens: number): number {
    const rates: Record<string, [number, number]> = {
      "groq-llama-3.1-8b": [0.00005, 0.00008],
      "groq-llama-3.3-70b": [0.00059, 0.00079],
    };
    const [inRate, outRate] = rates[this.modelId] ?? [0.0001, 0.0002];
    return (inputTokens / 1000) * inRate + (outputTokens / 1000) * outRate;
  }
}

/** ─────────────────────────────────────────────────────────────
 * OpenRouter
 * ───────────────────────────────────────────────────────────── */

class OpenRouterProvider implements AIProvider {
  constructor(public modelId: ModelId) {}

  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

    const remote = OPENROUTER_REMOTE_MODEL[this.modelId];
    if (!remote)
      throw new Error(`Unknown OpenRouter model: ${this.modelId}`);

    const { default: OpenAI } = await import("openai");

    const client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "https://localhost",
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

      const content = res.choices[0]?.message?.content ?? "{}";
      return safeJsonParse(content);
    });
  }

  estimatedCost(inputTokens: number, outputTokens: number): number {
    const rates: Record<string, [number, number]> = {
      "openrouter-qwen-7b": [0.0001, 0.0001],
    };
    const [inRate, outRate] = rates[this.modelId] ?? [0.0002, 0.0002];
    return (inputTokens / 1000) * inRate + (outputTokens / 1000) * outRate;
  }
}

/** ─────────────────────────────────────────────────────────────
 * Factory (IMPROVED)
 * ───────────────────────────────────────────────────────────── */

export function createProvider(modelId: ModelId): AIProvider {
  if (modelId.startsWith("gpt-")) return new OpenAIProvider(modelId);
  if (modelId.startsWith("gemini-")) return new GeminiProvider(modelId);
  if (modelId.startsWith("claude-")) return new AnthropicProvider(modelId);
  if (modelId.startsWith("groq-")) return new GroqProvider(modelId);
  if (modelId.startsWith("openrouter-"))
    return new OpenRouterProvider(modelId);

  throw new Error(`Unknown model: ${modelId}`);
}