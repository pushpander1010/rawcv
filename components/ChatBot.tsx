"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useResume } from "@/context/ResumeContext";
import AILoader from "@/components/AILoader";
import CreditWarningBanner from "@/components/CreditWarningBanner";
import type { ParsedResume, WorkExperience, Education, Project } from "@/types";
import type { ChatMessage, ChatResponse } from "@/app/api/chat/route";
import { fetchWithRetry, safeJsonParse } from "@/lib/fetch-retry";

interface Props {
  mode?: "build" | "customize";
  onComplete?: () => void;
  onEnd?: () => void;
}

export default function ChatBot({ mode = "build", onComplete, onEnd }: Props) {
  const { state, setState, refreshCredits, pushUndo, isHydrated, clearChat } = useResume();

  const [messages, setMessages]           = useState<ChatMessage[]>([]);
  const [loading, setLoading]             = useState(false);
  const [input, setInput]                 = useState("");
  const [error, setError]                 = useState<string | null>(null);
  const [outOfCredits, setOutOfCredits]   = useState(false);
  const [isComplete, setIsComplete]       = useState(false);
  const [sectionHistory, setSectionHistory] = useState<Record<string, unknown>>({});

  // localResumeRef is the single source of truth for resume state inside this component.
  // We never read from state.parsed in sendMessage to avoid stale closure bugs.
  const localResumeRef = useRef<Partial<ParsedResume>>(state.parsed ?? {});
  const isInternalUpdate = useRef(false);

  // Sync localResumeRef AND push to context/preview whenever resume changes
  const applyResumeUpdate = useCallback(
    (update: Partial<ParsedResume>) => {
      const merged = mergeResumeUpdate(localResumeRef.current, update);
      localResumeRef.current = merged;
      // Mark this as an internal update so the sync useEffect doesn't overwrite it
      isInternalUpdate.current = true;
      // Always push to context so the preview refreshes immediately
      setState((s) => ({ ...s, parsed: toFullResume(merged) }));
      // Reset the flag after a tick
      setTimeout(() => { isInternalUpdate.current = false; }, 0);
    },
    [setState]
  );

  // Persist messages to context state so they survive page refresh
  const syncMessages = useCallback(
    (msgs: ChatMessage[]) => {
      setState((s) => ({ ...s, chatMessages: msgs }));
    },
    [setState]
  );

  const bottomRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLTextAreaElement>(null);
  const initialised = useRef(false);
  const greetingInFlight  = useRef(false);
  const lastResetSignal   = useRef(state.chatResetSignal);
  const lastClearSignal   = useRef(state.chatClearSignal);

  // ── Reset signal ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (state.chatResetSignal === lastResetSignal.current) return;
    lastResetSignal.current = state.chatResetSignal;

    setMessages([]);
    syncMessages([]);
    localResumeRef.current = {};
    setIsComplete(false);
    setError(null);
    setSectionHistory({});
    setInput("");
    greetingInFlight.current = false;
    triggerGreeting(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.chatResetSignal]);

  // ── Clear chat signal (messages only — resume data stays intact) ──────────
  useEffect(() => {
    if (state.chatClearSignal === lastClearSignal.current) return;
    lastClearSignal.current = state.chatClearSignal;

    setMessages([]);
    setIsComplete(false);
    setError(null);
    setOutOfCredits(false);
    setInput("");
    // Re-greet with current resume state so the AI knows where we left off
    greetingInFlight.current = false;
    triggerGreeting(localResumeRef.current as ParsedResume | null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.chatClearSignal]);

  // ── Hydrate once session is ready ─────────────────────────────────────────
  useEffect(() => {
    if (!isHydrated) return;
    if (initialised.current) return;
    initialised.current = true;

    // Snapshot once — never re-run on state.parsed change
    const resumeSnapshot = state.parsed ?? null;
    localResumeRef.current = resumeSnapshot ?? {};

    // Restore persisted messages — skip greeting if history already exists
    const persistedMessages = state.chatMessages ?? [];
    if (persistedMessages.length > 0) {
      setMessages(persistedMessages);
      greetingInFlight.current = true; // prevent greeting from firing
    } else {
      triggerGreeting(resumeSnapshot);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  // Sync ref if context updates externally (e.g. undo button)
  // Skip if this was an internal update from applyResumeUpdate
  useEffect(() => {
    if (isInternalUpdate.current) return;
    if (state.parsed) {
      localResumeRef.current = state.parsed;
    }
  }, [state.parsed]);

  // Persist messages to context/localStorage whenever they settle
  // Skip during loading to avoid saving mid-flight partial states
  // Skip empty arrays — never overwrite persisted messages with [] unless
  // the user explicitly cleared chat (handled by the clear/reset signal handlers)
  useEffect(() => {
    if (!initialised.current || loading) return;
    if (messages.length === 0) return; // don't wipe persisted history with an empty array
    syncMessages(messages);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, loading]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Greeting ───────────────────────────────────────────────────────────────
  async function triggerGreeting(parsed: ParsedResume | null) {
    if (greetingInFlight.current) return;
    greetingInFlight.current = true;
    setLoading(true);

    // Build a static fallback that acknowledges existing data
    function buildFallback(r: ParsedResume | null): string {
      if (!r?.contact?.name) {
        return "Hi! I'm your resume assistant. Let's build your resume step by step. What's your full name?";
      }
      const filled: string[] = [];
      if (r.contact.name)       filled.push("your name");
      if (r.contact.email)      filled.push("email");
      if (r.contact.phone)      filled.push("phone");
      if (r.summary)            filled.push("summary");
      if (r.experience?.length) filled.push(`${r.experience.length} job(s)`);
      if (r.education?.length)  filled.push("education");
      if (r.skills?.length)     filled.push("skills");

      const filledStr = filled.join(", ");
      const missing: string[] = [];
      if (!r.contact.email)     missing.push("email");
      if (!r.contact.phone)     missing.push("phone");
      if (!r.summary)           missing.push("summary");
      if (!r.experience?.length) missing.push("work experience");
      if (!r.education?.length)  missing.push("education");
      if (!r.skills?.length)     missing.push("skills");

      if (missing.length === 0) {
        return `Welcome back, ${r.contact.name}! Your resume looks complete. What would you like to improve?`;
      }
      return `Welcome back, ${r.contact.name}! I can see you've already added ${filledStr}. Let's continue — could you tell me your ${missing[0]}?`;
    }

    try {
      const res = await fetchWithRetry("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "__init__" }],
          resumeState: parsed ?? {},
          mode,
          sectionHistory: {},
          isGreeting: true,
        }),
      });

      if (!res.ok) {
        setMessages([{ role: "assistant", content: buildFallback(parsed) }]);
        return;
      }

      const data = await safeJsonParse<ChatResponse>(res).catch((err) => {
        console.error('[ChatBot] Greeting JSON parse error:', err);
        setMessages([{ role: "assistant", content: buildFallback(parsed) }]);
        return null;
      });

      if (!data) return;

      setMessages([{ role: "assistant", content: data.message }]);

      // Apply any resume update that came back with the greeting
      if (data.resumeUpdate && data.resumeUpdate !== null && Object.keys(data.resumeUpdate).length > 0) {
        applyResumeUpdate(data.resumeUpdate);
      }
    } catch (err) {
      console.error('[ChatBot] Greeting error:', err);
      setMessages([{ role: "assistant", content: buildFallback(parsed) }]);
    } finally {
      setLoading(false);
      // greetingInFlight stays true — greeting fires exactly once per session/reset
    }
  }

  // ── Send message ───────────────────────────────────────────────────────────
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
        const res = await fetchWithRetry("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages,
            resumeState: localResumeRef.current,   // always fresh — never stale
            mode,
            sectionHistory,
          }),
        });

        const data = await safeJsonParse<ChatResponse>(res).catch((err) => {
          // Roll back the user message so they can retry
          setMessages((prev) => prev.slice(0, -1));
          setInput(text.trim());
          throw err;
        });

        if (!res.ok) {
          // Roll back the user message so they can retry
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

        // ── Always update the preview, even for small incremental changes ──
        if (chatData.resumeUpdate && chatData.resumeUpdate !== null && Object.keys(chatData.resumeUpdate).length > 0) {
          pushUndo();
          applyResumeUpdate(chatData.resumeUpdate);
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
        // Roll back the user message on error so they can retry
        setMessages((prev) => prev.slice(0, -1));
        setInput(text.trim());
        
        const errorMessage = e instanceof Error ? e.message : "Something went wrong";
        
        // Provide more helpful error messages
        if (errorMessage.includes('timeout') || errorMessage.includes('AbortError')) {
          setError("Request timed out. The server is taking too long to respond. Please try again.");
        } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
          setError("Network error. Please check your connection and try again.");
        } else if (errorMessage.includes('Invalid response')) {
          setError("Server returned an invalid response. Please try again.");
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [messages, loading, mode, sectionHistory, applyResumeUpdate, pushUndo, onComplete, refreshCredits]
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
              ✅ {mode === "build"
                ? "Resume complete! Check the preview on the right."
                : "All done! Your resume has been updated."}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Credit warning */}
      {outOfCredits
        ? <CreditWarningBanner balance={0} />
        : <CreditWarningBanner balance={state.creditBalance} />
      }

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="px-4 py-2 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-t border-red-100 dark:border-red-900"
        >
          <span>⚠</span>
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="shrink-0 underline hover:no-underline">
            Dismiss
          </button>
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
                ? "Ask me to change anything…"
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
        <div className="flex items-center justify-between gap-2">
          {/* Clear chat history — keeps resume data intact */}
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearChat}
              disabled={loading}
              aria-label="Clear chat history"
              title="Clear chat history (resume data is kept)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-200 dark:hover:border-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-40"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear chat
            </button>
          )}
          {onEnd && (
            <button
              type="button"
              onClick={onEnd}
              className="ml-auto px-4 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              End Chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Ensure a partial resume always has required arrays so theme renderers never crash */
function toFullResume(partial: Partial<ParsedResume>): ParsedResume {
  return {
    contact: partial.contact ?? { name: "", email: "" },
    summary: partial.summary ?? "",
    experience: Array.isArray(partial.experience)
      ? partial.experience.map((j) => ({
          company:   j.company   ?? "",
          title:     j.title     ?? "",
          startDate: j.startDate ?? "",
          endDate:   j.endDate   ?? "",
          bullets:   Array.isArray(j.bullets) ? j.bullets : [],
        }))
      : [],
    education:      Array.isArray(partial.education)      ? partial.education      : [],
    skills:         Array.isArray(partial.skills)         ? partial.skills         : [],
    certifications: Array.isArray(partial.certifications) ? partial.certifications : undefined,
    projects:       Array.isArray(partial.projects)       ? partial.projects       : undefined,
  };
}

/** Deep-merge a resumeUpdate patch onto the current resume state */
function mergeResumeUpdate(
  current: Partial<ParsedResume>,
  update: Partial<ParsedResume>
): Partial<ParsedResume> {
  console.log('[ChatBot] mergeResumeUpdate called');
  console.log('[ChatBot] Current state:', JSON.stringify(current, null, 2));
  console.log('[ChatBot] Update received:', JSON.stringify(update, null, 2));
  
  const merged = { ...current };

  for (const key of Object.keys(update) as Array<keyof ParsedResume>) {
    const val = update[key];
    if (val === undefined || val === null) continue;

    if (key === "contact" && typeof val === "object" && !Array.isArray(val)) {
      // Merge contact sub-fields so a partial update (e.g. just phone) doesn't wipe name/email
      merged.contact = {
        ...(merged.contact as object ?? {}),
        ...(val as object),
      } as ParsedResume["contact"];
    } else if (Array.isArray(val)) {
      // For arrays, check if this is a partial update (single item) or complete replacement
      const currentArray = (merged as Record<string, unknown>)[key];
      
      console.log(`[ChatBot] Processing array field: ${key}`);
      console.log(`[ChatBot] Current array length: ${Array.isArray(currentArray) ? currentArray.length : 0}`);
      console.log(`[ChatBot] Update array length: ${val.length}`);
      
      if (Array.isArray(currentArray) && currentArray.length > 0) {
        // If the update array has only 1 item and current has multiple, it's likely a partial update
        // In this case, APPEND the new item instead of replacing
        if (val.length === 1 && currentArray.length > 0) {
          console.log(`[ChatBot] Detected partial update for ${key} - will try to append`);
          
          // Check if this item already exists (by comparing key fields)
          const newItem = val[0];
          let isDuplicate = false;
          
          if (key === "experience" && typeof newItem === "object" && newItem !== null) {
            const exp = newItem as WorkExperience;
            isDuplicate = currentArray.some((item: any) => 
              item.company === exp.company && 
              item.title === exp.title && 
              item.startDate === exp.startDate
            );
          } else if (key === "education" && typeof newItem === "object" && newItem !== null) {
            const edu = newItem as Education;
            isDuplicate = currentArray.some((item: any) => 
              item.institution === edu.institution && 
              item.degree === edu.degree
            );
          } else if (key === "projects" && typeof newItem === "object" && newItem !== null) {
            const proj = newItem as Project;
            isDuplicate = currentArray.some((item: any) => 
              item.name === proj.name
            );
          } else if (typeof newItem === "string") {
            // For string arrays (skills, certifications), check exact match
            isDuplicate = currentArray.includes(newItem);
          }
          
          if (!isDuplicate) {
            console.log(`[ChatBot] Item is new - appending to ${key}`);
            // Append the new item to existing array
            (merged as Record<string, unknown>)[key] = [...currentArray, newItem].filter(
              (item) => item !== null && item !== undefined
            );
          } else {
            console.log(`[ChatBot] Item is duplicate - keeping current ${key}`);
            // Item already exists, keep current array
            (merged as Record<string, unknown>)[key] = currentArray;
          }
        } else {
          console.log(`[ChatBot] Multiple items or special case - replacing ${key}`);
          // Multiple items in update or current is empty - treat as complete replacement
          (merged as Record<string, unknown>)[key] = val.filter(
            (item) => item !== null && item !== undefined
          );
        }
      } else {
        console.log(`[ChatBot] Current ${key} is empty - using update as-is`);
        // Current array is empty, just use the update
        (merged as Record<string, unknown>)[key] = val.filter(
          (item) => item !== null && item !== undefined
        );
      }
    } else {
      (merged as Record<string, unknown>)[key] = val;
    }
  }

  // Ensure required arrays are always present
  merged.experience = Array.isArray(merged.experience) ? merged.experience : [];
  merged.education  = Array.isArray(merged.education)  ? merged.education  : [];
  merged.skills     = Array.isArray(merged.skills)     ? merged.skills     : [];
  
  console.log('[ChatBot] Merged result:', JSON.stringify(merged, null, 2));
  return merged;
}