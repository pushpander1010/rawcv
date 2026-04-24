import { z } from "zod";

const DefaultSchema = z.any();

// ─── Models ───────────────────────────────────────────────────────────────────
const MODEL_PARSE    = "google/gemini-2.5-flash-lite";           // resume parsing
const MODEL_CHAT     = "amazon/nova-micro-v1"; // chat / build / customize
const MODEL_ANALYSIS = "meta-llama/llama-4-scout";             // ATS, JD relevance, suggestions, enhance

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractJson(text: string): string {
  if (!text?.trim()) throw new Error("Empty response");
  let cleaned = text.trim();
  const block = cleaned.match(/\x60\x60\x60(?:json)?\s*([\s\S]*?)\x60\x60\x60/);
  if (block) cleaned = block[1].trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace  = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  return cleaned;
}

function parseAndValidate<T>(text: string, schema: z.ZodSchema<T>): T {
  try {
    return schema.parse(JSON.parse(extractJson(text)));
  } catch {
    console.error("❌ Invalid JSON Payload Received:\n", text);
    throw new Error("Invalid JSON from model");
  }
}

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i <= retries; i++) {
    try { return await fn(); } catch (e) {
      lastErr = e;
      console.warn(`⚠️ AI Request Retry ${i + 1} failed:`, e instanceof Error ? e.message : String(e));
      if (i < retries) await new Promise((r) => setTimeout(r, 1500));
    }
  }
  throw lastErr;
}

// ─── Core fetch ───────────────────────────────────────────────────────────────

async function callOpenRouter<T>(
  model: string,
  prompt: string,
  systemPrompt: string,
  options?: { maxTokens?: number; schema?: z.ZodSchema<T>; jsonMode?: boolean }
): Promise<T> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

  const schema = options?.schema ?? DefaultSchema;
  const jsonMode = options?.jsonMode !== false; // default true

  const fullSystem = jsonMode
    ? `${systemPrompt}\n\nSTRICT RULES:\n- Return ONLY valid JSON\n- No markdown wrappers\n- No explanation or conversational text\n- Must match the requested schema strictly`
    : systemPrompt;

  return withRetry(async () => {
    const controller = new AbortController();
    const timeoutMs = model === MODEL_ANALYSIS ? 120000 : 45000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const body: Record<string, unknown> = {
        model,
        max_tokens: options?.maxTokens ?? 2500,
        temperature: 0.1,
        messages: [
          { role: "system", content: fullSystem },
          { role: "user",   content: prompt },
        ],
      };
      if (jsonMode) body.response_format = { type: "json_object" };

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "https://rawcv.com",
          "X-Title": "rawcv",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`OpenRouter error (${res.status}): ${err}`);
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty response from model");

      return parseAndValidate(content, schema);
    } finally {
      clearTimeout(timeout);
    }
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Resume parsing — google/gemini-2.5-flash-lite */
export async function complete<T = any>(
  prompt: string,
  systemPrompt: string,
  options?: { maxTokens?: number; schema?: z.ZodSchema<T> }
): Promise<T> {
  return callOpenRouter(MODEL_PARSE, prompt, systemPrompt, options);
}

/** Chat (build / customize) — mistralai/mistral-small-24b-instruct-2501 */
export async function completeChat<T = any>(
  prompt: string,
  systemPrompt: string,
  options?: { maxTokens?: number; schema?: z.ZodSchema<T> }
): Promise<T> {
  return callOpenRouter(MODEL_CHAT, prompt, systemPrompt, options);
}

/** ATS, JD relevance, suggestions, enhancements — google/gemma-4-26b-a4b-it */
export async function completeAnalysis<T = any>(
  prompt: string,
  systemPrompt: string,
  options?: { maxTokens?: number; schema?: z.ZodSchema<T> }
): Promise<T> {
  return callOpenRouter(MODEL_ANALYSIS, prompt, systemPrompt, options);
}
