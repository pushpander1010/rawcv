import type { ModelId } from "@/types";

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

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createProvider(modelId: ModelId): AIProvider {
  if (modelId.startsWith("gpt-")) return new OpenAIProvider(modelId);
  if (modelId.startsWith("gemini-")) return new GeminiProvider(modelId);
  if (modelId.startsWith("claude-")) return new AnthropicProvider(modelId);
  throw new Error(`Unknown model: ${modelId}`);
}
