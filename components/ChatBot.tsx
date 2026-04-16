"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useResume } from "@/context/ResumeContext";
import AILoader from "@/components/AILoader";
import CreditWarningBanner from "@/components/CreditWarningBanner";
import type { ParsedResume } from "@/types";
import type { ChatMessage, ChatResponse } from "@/app/api/chat/route";

function chatStorageKey(userId: string | undefined, mode: string) {
  return userId ? `rawcv_chat_${mode}_${userId}` : null;
}

function loadChatMessages(userId: string | undefined, mode: string): ChatMessage[] | null {
  try {
    const key = chatStorageKey(userId, mode);
    if (!key) return null;
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : null;
  } catch {
    return null;
  }
}

function saveChatMessages(messages: ChatMessage[], userId: string | undefined, mode: string) {
  try {
    const key = chatStorageKey(userId, mode);
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(messages));
  } catch { /* ignore */ }
}

interface Props {
  mode?: "build" | "customize";
  onComplete?: () => void;
  onEnd?: () => void;
}

export default function ChatBot({ mode = "build", onComplete, onEnd }: Props) {
  const { state, setState, refreshCredits, pushUndo } = useResume();
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  // Always seed localResume from existing state — so chat knows what's already filled
  const existingResume = state.parsed ?? null;

  function buildWelcome(parsed: typeof existingResume = existingResume): string {
    if (!parsed) {
      return "Hi! I'm your resume assistant. Let's build your resume together. To get started, what's your full name?";
    }

    const filled: string[] = [];
    const missing: string[] = [];

    if (parsed.contact?.name) filled.push("name"); else missing.push("name");
    if (parsed.contact?.email) filled.push("email"); else missing.push("email");
    if (parsed.summary) filled.push("summary"); else missing.push("summary");
    if (parsed.experience?.length) filled.push(`${parsed.experience.length} job${parsed.experience.length > 1 ? "s" : ""}`); else missing.push("work experience");
    if (parsed.education?.length) filled.push("education"); else missing.push("education");
    if (parsed.skills?.length) filled.push("skills"); else missing.push("skills");

    if (mode === "customize") {
      return `Hi! I can see your resume for ${parsed.contact?.name || "you"} is loaded with ${filled.join(", ")}. What would you like to change or improve?`;
    }

    if (missing.length === 0) {
      return `Hi! Your resume looks complete with ${filled.join(", ")}. Would you like to improve anything, or shall I mark it as done?`;
    }

    return `Hi! I can see your resume already has ${filled.join(", ")}. Let's fill in the missing parts — starting with ${missing[0]}. ${
      missing[0] === "name" ? "What's your full name?" :
      missing[0] === "email" ? "What's your email address?" :
      missing[0] === "summary" ? "Can you write a 2–3 sentence professional summary?" :
      missing[0] === "work experience" ? "Tell me about your most recent job — company name, title, and dates?" :
      missing[0] === "education" ? "Where did you study? Tell me your institution, degree, and graduation year." :
      "What are your key skills? List them separated by commas."
    }`;
  }

  // Start with empty — will be populated after hydration to avoid stale welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatHydrated = useRef(false);
  const contextReady = useRef(false);
  // Keep latest values accessible in effects without stale closures
  const latestParsed = useRef(state.parsed);
  const latestUserId = useRef(userId);
  useEffect(() => { latestParsed.current = state.parsed; }, [state.parsed]);
  useEffect(() => { latestUserId.current = userId; }, [userId]);

  const trySetWelcome = useCallback(() => {
    const uid = latestUserId.current;
    if (!uid || !contextReady.current || chatHydrated.current) return;
    chatHydrated.current = true;
    const saved = loadChatMessages(uid, mode);
    if (saved && saved.length > 0) {
      setMessages(saved);
    } else {
      setMessages([{ role: "assistant", content: buildWelcome(latestParsed.current) }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Fire trySetWelcome whenever context hydrates
  useEffect(() => {
    contextReady.current = true;
    trySetWelcome();
  }, [state.parsed, trySetWelcome]);

  // Fire trySetWelcome whenever userId becomes known
  useEffect(() => {
    if (!userId) return;
    trySetWelcome();
  }, [userId, trySetWelcome]);

  // Persist messages whenever they change (only for logged-in users)
  useEffect(() => {
    if (!userId || !chatHydrated.current || messages.length === 0) return;
    saveChatMessages(messages, userId, mode);
  }, [messages, userId, mode]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outOfCredits, setOutOfCredits] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [sectionHistory, setSectionHistory] = useState<Record<string, unknown>>({});

  // Always start from existing resume data so the AI knows what's already filled
  const [localResume, setLocalResume] = useState<Partial<ParsedResume>>(
    existingResume ?? {}
  );

  // Sync localResume when context hydrates from localStorage (state.parsed goes null → data)
  const localResumeHydrated = useRef(false);
  useEffect(() => {
    if (localResumeHydrated.current) return;
    if (state.parsed) {
      localResumeHydrated.current = true;
      setLocalResume(state.parsed);
    }
  }, [state.parsed]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: ChatMessage = { role: "user", content: text.trim() };
      const nextMessages: ChatMessage[] = [...messages, userMsg];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);
      setError(null);
      setOutOfCredits(false);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages,
            resumeState: localResume,
            mode,
            sectionHistory,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          // Roll back the user message so they can retry after fixing the issue
          setMessages((prev) => prev.slice(0, -1));
          setInput(text.trim());
          if (res.status === 402) {
            setOutOfCredits(true);
          } else {
            throw new Error(data.message ?? `Request failed (${res.status})`);
          }
          return;
        }

        const chatData = data as ChatResponse;

        // Update section history if returned (customize mode)
        if (chatData.sectionHistory !== undefined) {
          setSectionHistory(chatData.sectionHistory);
        }

        // Merge resume update into local state and sync to global context
        if (chatData.resumeUpdate && Object.keys(chatData.resumeUpdate).length > 0) {
          pushUndo();
          const merged = mergeResumeUpdate(localResume, chatData.resumeUpdate);
          setLocalResume(merged);
          setState((s) => ({ ...s, parsed: toFullResume(merged) }));
        }

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: chatData.message },
        ]);

        if (chatData.isComplete) {
          setIsComplete(true);
          onComplete?.();
        }
        refreshCredits();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [messages, localResume, loading, mode, setState, onComplete, sectionHistory, refreshCredits]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* Message list */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        aria-live="polite"
        aria-label="Chat conversation"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start w-full">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-2 w-full max-w-xs">
              <AILoader type="chat" interval={1400} />
            </div>
          </div>
        )}

        {isComplete && (
          <div className="flex justify-center">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-xl px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300 text-center">
              ✅ {mode === "build" ? "Resume complete! Check the preview on the right." : "All done! Your resume has been updated."}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Out of credits banner */}
      {outOfCredits
        ? <CreditWarningBanner balance={0} />
        : <CreditWarningBanner balance={state.creditBalance} />
      }

      {/* Error */}
      {error && (
        <div role="alert" className="px-4 py-2 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-t border-red-100 dark:border-red-900">
          <span>⚠</span>
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="shrink-0 underline hover:no-underline">Dismiss</button>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex flex-col gap-2">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === "customize"
                ? "Ask me to change anything, or say 'undo'…"
                : "Type a message… (Enter to send)"
            }
            rows={2}
            disabled={loading || isComplete || outOfCredits}
            aria-label="Chat message input"
            className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading || isComplete || outOfCredits}
            aria-label="Send message"
            className="shrink-0 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
        {onEnd && (
          <button
            type="button"
            onClick={onEnd}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            End Chat
          </button>
        )}
      </div>
    </div>
  );
}

/** Ensure a partial resume always has the required arrays so theme renderers never crash */
function toFullResume(partial: Partial<ParsedResume>): ParsedResume {
  return {
    contact: partial.contact ?? { name: "", email: "" },
    summary: partial.summary ?? "",
    experience: Array.isArray(partial.experience) ? partial.experience.map(j => ({
      company: j.company ?? "", title: j.title ?? "",
      startDate: j.startDate ?? "", endDate: j.endDate ?? "",
      bullets: Array.isArray(j.bullets) ? j.bullets : [],
    })) : [],
    education: Array.isArray(partial.education) ? partial.education : [],
    skills: Array.isArray(partial.skills) ? partial.skills : [],
    certifications: Array.isArray(partial.certifications) ? partial.certifications : undefined,
    projects: Array.isArray(partial.projects) ? partial.projects : undefined,
  };
}

// Deep-merge a partial resume update into the existing state
function mergeResumeUpdate(
  current: Partial<ParsedResume>,
  update: Partial<ParsedResume>
): Partial<ParsedResume> {
  const merged = { ...current };

  for (const key of Object.keys(update) as Array<keyof ParsedResume>) {
    const val = update[key];
    // Skip null/undefined — never overwrite existing data with nothing
    if (val === undefined || val === null) continue;

    if (key === "contact" && typeof val === "object" && !Array.isArray(val)) {
      // Shallow-merge contact fields
      merged.contact = { ...(merged.contact as object), ...(val as object) } as ParsedResume["contact"];
    } else if (Array.isArray(val)) {
      // Ensure every array item is a valid object before storing
      (merged as Record<string, unknown>)[key] = val.filter(
        (item) => item !== null && item !== undefined
      );
    } else {
      (merged as Record<string, unknown>)[key] = val;
    }
  }

  // Guarantee required arrays are never undefined so theme renderers don't crash
  merged.experience = Array.isArray(merged.experience) ? merged.experience : [];
  merged.education  = Array.isArray(merged.education)  ? merged.education  : [];
  merged.skills     = Array.isArray(merged.skills)     ? merged.skills     : [];

  return merged;
}
