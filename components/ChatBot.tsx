"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useResume } from "@/context/ResumeContext";
import AILoader from "@/components/AILoader";
import CreditWarningBanner from "@/components/CreditWarningBanner";
import type { ParsedResume } from "@/types";
import type { ChatMessage, ChatResponse } from "@/app/api/chat/route";

interface Props {
  mode?: "build" | "customize";
  onComplete?: () => void;
  onEnd?: () => void;
}

export default function ChatBot({ mode = "build", onComplete, onEnd }: Props) {
  const { state, setState, refreshCredits, pushUndo, loadChatMessages, saveChatMessages, isHydrated } = useResume();

  // ── Message persistence ───────────────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [outOfCredits, setOutOfCredits] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [sectionHistory, setSectionHistory] = useState<Record<string, unknown>>({});
  const [localResume, setLocalResume] = useState<Partial<ParsedResume>>(state.parsed ?? {});

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialised = useRef(false);
  const greetingInFlight = useRef(false);
  const lastResetSignal = useRef(state.chatResetSignal);

  // ── React to reset signal (user clicked Reset button) ────────────────────
  useEffect(() => {
    if (state.chatResetSignal === lastResetSignal.current) return;
    lastResetSignal.current = state.chatResetSignal;
    // Clear all chat state
    setMessages([]);
    setLocalResume({});
    setIsComplete(false);
    setError(null);
    setSectionHistory({});
    setInput("");
    greetingInFlight.current = false;
    // Trigger fresh AI greeting with empty resume
    triggerGreeting(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.chatResetSignal]);

  // ── Hydrate from localStorage once session is ready ───────────────────────
  useEffect(() => {
    if (!isHydrated) return;       // wait for context to load from localStorage
    if (initialised.current) return;
    initialised.current = true;

    if (state.parsed) {
      setLocalResume(state.parsed);
    }

    const saved = loadChatMessages(mode);
    if (saved.length > 0) {
      setMessages(saved);
      return;
    }

    // No saved chat — trigger AI greeting with the fully-loaded resume state
    triggerGreeting(state.parsed);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, state.parsed]);

  // Persist messages whenever they change (only non-empty to avoid wiping on reset)
  useEffect(() => {
    if (!initialised.current) return;
    if (messages.length === 0) return; // greeting will repopulate shortly
    saveChatMessages(mode, messages);
  }, [messages, mode, saveChatMessages]);

  // Sync localResume if context updates externally (e.g. undo)
  useEffect(() => {
    if (state.parsed) {
      setLocalResume(state.parsed);
    }
  }, [state.parsed]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── AI greeting on first load ─────────────────────────────────────────────
  async function triggerGreeting(parsed: ParsedResume | null) {
    if (greetingInFlight.current) return;
    greetingInFlight.current = true;

    // Send a silent "start" message so the AI greets based on current resume state
    const initMsg: ChatMessage = { role: "user", content: "__init__" };
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [initMsg],
          resumeState: parsed ?? {},
          mode,
          sectionHistory: {},
          isGreeting: true,
        }),
      });

      if (!res.ok) {
        // Fallback to static greeting if API fails
        const fallback = parsed?.contact?.name
          ? `Welcome back, ${parsed.contact.name}! Let's continue building your resume. Where did we leave off?`
          : "Hi! I'm your resume assistant. Let's build your resume together. What's your full name?";
        setMessages([{ role: "assistant", content: fallback }]);
        return;
      }

      const data = await res.json() as ChatResponse;
      setMessages([{ role: "assistant", content: data.message }]);

      if (data.resumeUpdate && Object.keys(data.resumeUpdate).length > 0) {
        const merged = mergeResumeUpdate(parsed ?? {}, data.resumeUpdate);
        setLocalResume(merged);
        setState((s) => ({ ...s, parsed: toFullResume(merged) }));
      }
    } catch {
      const fallback = parsed?.contact?.name
        ? `Welcome back, ${parsed.contact.name}! Let's continue your resume. What would you like to work on?`
        : "Hi! I'm your resume assistant. Let's build your resume together. What's your full name?";
      setMessages([{ role: "assistant", content: fallback }]);
    } finally {
      setLoading(false);
      greetingInFlight.current = false;
    }
  }

  // ── Send message ──────────────────────────────────────────────────────────
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

        if (chatData.sectionHistory !== undefined) {
          setSectionHistory(chatData.sectionHistory);
        }

        // Merge resume update and sync to global context (triggers preview update)
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
    [messages, localResume, loading, mode, setState, onComplete, sectionHistory, refreshCredits, pushUndo]
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

function mergeResumeUpdate(
  current: Partial<ParsedResume>,
  update: Partial<ParsedResume>
): Partial<ParsedResume> {
  const merged = { ...current };

  for (const key of Object.keys(update) as Array<keyof ParsedResume>) {
    const val = update[key];
    if (val === undefined || val === null) continue;

    if (key === "contact" && typeof val === "object" && !Array.isArray(val)) {
      merged.contact = { ...(merged.contact as object), ...(val as object) } as ParsedResume["contact"];
    } else if (Array.isArray(val)) {
      (merged as Record<string, unknown>)[key] = val.filter(
        (item) => item !== null && item !== undefined
      );
    } else {
      (merged as Record<string, unknown>)[key] = val;
    }
  }

  merged.experience = Array.isArray(merged.experience) ? merged.experience : [];
  merged.education  = Array.isArray(merged.education)  ? merged.education  : [];
  merged.skills     = Array.isArray(merged.skills)     ? merged.skills     : [];

  return merged;
}
