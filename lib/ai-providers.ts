import type { ModelId } from "@/types";

/** Groq OpenAI-compatible model names (see https://console.groq.com/docs/models) */
const GROQ_REMOTE_MODEL: Record<"groq-llama-3.1-8b" | "groq-llama-3.3-70b", string> = {
  "groq-llama-3.1-8b": "llama-3.1-8b-instant",
  "groq-llama-3.3-70b": "llama-3.3-70b-versatile",
};

/** OpenRouter model slugs (OpenAI-compatible API) */
const OPENROUTER_REMOTE_MODEL: Record<"openrouter-qwen-7b", string> = {
  "openrouter-qwen-7b": "qwen/qwen-2.5-7b-instruct",
};

export interface AIProvider {
  modelId: ModelId;
  complete(prompt: string, systemPrompt: string): Promise<string>;
  estimatedCost(inputTokens: number, outputTokens: number): number;
}

// ─── OpenAI ──────────────────────────────────────────────────────────────────

class OpenAIProvider implements AIProvider {
  constructor(public modelId: ModelId) {}

  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const res = await client.chat.completions.create({
      model: this.modelId,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });
    return res.choices[0].message.content ?? "{}";
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

// ─── Gemini ───────────────────────────────────────────────────────────────────

class GeminiProvider implements AIProvider {
  constructor(public modelId: ModelId) {}

  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: this.modelId === "gemini-1.5-flash" ? "gemini-1.5-flash" : "gemini-1.5-pro",
      systemInstruction: systemPrompt,
      generationConfig: { responseMimeType: "application/json" },
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  estimatedCost(inputTokens: number, outputTokens: number): number {
    const rates: Record<string, [number, number]> = {
      "gemini-1.5-flash": [0.000075, 0.0003],
      "gemini-1.5-pro": [0.00125, 0.005],
    };
    const [inRate, outRate] = rates[this.modelId] ?? [0.00125, 0.005];
    return (inputTokens / 1000) * inRate + (outputTokens / 1000) * outRate;
  }
}

// ─── Anthropic ────────────────────────────────────────────────────────────────

class AnthropicProvider implements AIProvider {
  constructor(public modelId: ModelId) {}

  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const res = await client.messages.create({
      model: this.modelId === "claude-haiku" ? "claude-3-haiku-20240307" : "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    });
    const block = res.content[0];
    return block.type === "text" ? block.text : "{}";
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

// ─── Groq (OpenAI-compatible, fast & low cost; needs GROQ_API_KEY) ─────────────

class GroqProvider implements AIProvider {
  constructor(public modelId: ModelId) {}

  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set");
    }
    const remote =
      GROQ_REMOTE_MODEL[this.modelId as keyof typeof GROQ_REMOTE_MODEL];
    if (!remote) {
      throw new Error(`Unknown Groq model id: ${this.modelId}`);
    }
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });
    const res = await client.chat.completions.create({
      model: remote,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });
    return res.choices[0].message.content ?? "{}";
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

// ─── OpenRouter (many models incl. Qwen; needs OPENROUTER_API_KEY) ────────────

class OpenRouterProvider implements AIProvider {
  constructor(public modelId: ModelId) {}

  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not set");
    }
    const remote =
      OPENROUTER_REMOTE_MODEL[this.modelId as keyof typeof OPENROUTER_REMOTE_MODEL];
    if (!remote) {
      throw new Error(`Unknown OpenRouter model id: ${this.modelId}`);
    }
    const { default: OpenAI } = await import("openai");
    const siteUrl = process.env.OPENROUTER_SITE_URL ?? "https://localhost";
    const client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": siteUrl,
        "X-Title": "rawcv",
      },
    });
    const res = await client.chat.completions.create({
      model: remote,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });
    return res.choices[0].message.content ?? "{}";
  }

  estimatedCost(inputTokens: number, outputTokens: number): number {
    const rates: Record<string, [number, number]> = {
      "openrouter-qwen-7b": [0.0001, 0.0001],
    };
    const [inRate, outRate] = rates[this.modelId] ?? [0.0002, 0.0002];
    return (inputTokens / 1000) * inRate + (outputTokens / 1000) * outRate;
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createProvider(modelId: ModelId): AIProvider {
  if (modelId.startsWith("gpt-")) return new OpenAIProvider(modelId);
  if (modelId.startsWith("gemini-")) return new GeminiProvider(modelId);
  if (modelId.startsWith("claude-")) return new AnthropicProvider(modelId);
  if (modelId.startsWith("groq-")) return new GroqProvider(modelId);
  if (modelId.startsWith("openrouter-")) return new OpenRouterProvider(modelId);
  throw new Error(`Unknown model: ${modelId}`);
}
