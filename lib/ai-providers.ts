import type { ModelId } from "@/types";

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
  return `${systemPrompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no explanation, no code blocks.`;
}

export interface AIProvider {
  modelId: ModelId;
  complete(prompt: string, systemPrompt: string): Promise<string>;
  estimatedCost(inputTokens: number, outputTokens: number): number;
}

class GroqProvider implements AIProvider {
  constructor(public modelId: ModelId) {}

  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is not set");

    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey, baseURL: "https://api.groq.com/openai/v1" });

    return withRetry(async () => {
      const res = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
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

export function createProvider(_modelId: ModelId): AIProvider {
  return new GroqProvider("groq-llama-3.1-8b");
}
