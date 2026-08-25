import { z } from "zod";

const DefaultSchema = z.any();

// ─── Models ───────────────────────────────────────────────────────────────────
const MODEL_PARSE    = "google/gemini-2.5-flash-lite";       // resume parsing — gemini light (fast)
const MODEL_CHAT     = "meta/muse-spark-1.2-contributor";    // chat / build / customize — Muse contrib
const MODEL_ANALYSIS = "meta/muse-spark-1.2-contributor";    // ATS, JD, suggestions — Muse contrib
const MODEL_FAST     = "meta/muse-spark-1.2-contributor";    // cover letters — Muse contrib
const MODEL_FALLBACK = "xiaomi/mimo-v2.5";                   // fast, reliable fallback (no mandatory reasoning)

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
      if (i < retries) await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw lastErr;
}

// ─── Core fetch ───────────────────────────────────────────────────────────────

interface CallOptions<T> {
  maxTokens?: number;
  schema?: z.ZodSchema<T>;
  jsonMode?: boolean;
  temperature?: number;
  timeoutMs?: number;
  /** Secondary model to try if the primary fails or times out. */
  fallbackModel?: string;
}

async function callOpenRouter<T>(
  model: string,
  prompt: string,
  systemPrompt: string,
  options?: CallOptions<T>
): Promise<T> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

  const schema = options?.schema ?? DefaultSchema;
  const jsonMode = options?.jsonMode !== false; // default true

  const fullSystem = jsonMode
    ? `${systemPrompt}\n\nSTRICT RULES:\n- Return ONLY valid JSON\n- No markdown wrappers\n- No explanation or conversational text\n- Must match the requested schema strictly`
    : systemPrompt;

  const callOnce = async (m: string): Promise<T> => {
    const controller = new AbortController();
    // Muse is slow + reasoning-heavy; give it a bounded window so the fallback
    // model has time to run inside the route's maxDuration budget.
    const timeoutMs = options?.timeoutMs ?? (m.includes("muse-spark") ? 45000 : 60000);
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const isMuse = m.includes("muse-spark");
      const body: Record<string, unknown> = {
        model: m,
        max_tokens: options?.maxTokens ?? 2500,
        temperature: options?.temperature ?? 0.1,
        ...(m.startsWith("xiaomi/") ? { reasoning: { exclude: true } } : {}),
        ...(isMuse ? { reasoning: { effort: "low" }, include_reasoning: false } : {}),
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
  };

  // Muse is slow + occasionally flaky. Give it a single shot, then fall back to
  // the fast deterministic model rather than burning the route's time budget on retries.
  const primaryRetries = model.includes("muse-spark") ? 0 : 2;
  try {
    return await withRetry(() => callOnce(model), primaryRetries);
  } catch (primaryErr) {
    if (options?.fallbackModel && options.fallbackModel !== model) {
      console.warn(
        `⚠️ ${model} failed — falling back to ${options.fallbackModel}:`,
        primaryErr instanceof Error ? primaryErr.message : String(primaryErr)
      );
      return await withRetry(() => callOnce(options.fallbackModel!), 0);
    }
    throw primaryErr;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Resume parsing — gemini-lite */
export async function complete<T = any>(
  prompt: string,
  systemPrompt: string,
  options?: { maxTokens?: number; schema?: z.ZodSchema<T> }
): Promise<T> {
  return callOpenRouter(MODEL_PARSE, prompt, systemPrompt, options);
}

/** Chat (build / customize) — muse with mimo fallback */
export async function completeChat<T = any>(
  prompt: string,
  systemPrompt: string,
  options?: { maxTokens?: number; schema?: z.ZodSchema<T> }
): Promise<T> {
  return callOpenRouter(MODEL_CHAT, prompt, systemPrompt, { ...options, fallbackModel: MODEL_FALLBACK });
}

/** ATS, JD relevance, suggestions, enhancements, tailor — muse with mimo fallback */
export async function completeAnalysis<T = any>(
  prompt: string,
  systemPrompt: string,
  options?: { maxTokens?: number; schema?: z.ZodSchema<T> }
): Promise<T> {
  return callOpenRouter(MODEL_ANALYSIS, prompt, systemPrompt, { ...options, fallbackModel: MODEL_FALLBACK });
}

/** Fast generation (cover letters, etc.) — muse with mimo fallback */
export async function completeFast<T = any>(
  prompt: string,
  systemPrompt: string,
  options?: { maxTokens?: number; schema?: z.ZodSchema<T> }
): Promise<T> {
  return callOpenRouter(MODEL_FAST, prompt, systemPrompt, { ...options, timeoutMs: 30000, fallbackModel: MODEL_FALLBACK });
}
