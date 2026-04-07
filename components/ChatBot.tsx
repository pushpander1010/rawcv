"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useResume } from "@/context/ResumeContext";
import type { ParsedResume } from "@/types";
import type { ChatMessage, ChatResponse } from "@/app/api/chat/route";

interface Props {
  mode?: "build" | "customize";
  onComplete?: () => void;
}

const WELCOME_BUILD =
  "Hi! I'm your resume assistant. Let's build your resume together. To get started, what's your full name?";

const WELCOME_CUSTOMIZE =
  "Hi! I can help you customize your resume. What would you like to change or improve? You can also ask me to undo any change I make.";

export default function ChatBot({ mode = "build", onComplete }: Props) {
  const { state, setState } = useResume();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: mode === "build" ? WELCOME_BUILD : WELCOME_CUSTOMIZE,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Per-section undo history: maps section key → value before last change
  const [sectionHistory, setSectionHistory] = useState<Record<string, unknown>>({});

  // Local resume state built up during the chat session
  const [localResume, setLocalResume] = useState<Partial<ParsedResume>>(
    mode === "customize" && state.parsed ? state.parsed : {}
  );

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

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages,
            resumeState: localResume,
            model: state.selectedModel,
            mode,
            sectionHistory,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message ?? "Chat failed");
        }

        const data: ChatResponse = await res.json();

        // Update section history if returned (customize mode)
        if (data.sectionHistory !== undefined) {
          setSectionHistory(data.sectionHistory);
        }

        // Merge resume update into local state
        if (data.resumeUpdate) {
          setLocalResume((prev) => {
            const merged = mergeResumeUpdate(prev, data.resumeUpdate!);
            // Sync to global context so preview updates live
            setState((s) => ({
              ...s,
              parsed: merged as ParsedResume,
            }));
            return merged;
          });
        }

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);

        if (data.isComplete) {
          setIsComplete(true);
          onComplete?.();
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [messages, localResume, loading, mode, state.selectedModel, setState, onComplete, sectionHistory]
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
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
              <span className="flex gap-1 items-center" aria-label="Typing">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </span>
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

      {/* Error */}
      {error && (
        <p className="px-4 py-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
          {error}
        </p>
      )}

      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex gap-2 items-end">
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
          disabled={loading || isComplete}
          aria-label="Chat message input"
          className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading || isComplete}
          aria-label="Send message"
          className="shrink-0 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// Deep-merge a partial resume update into the existing state
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
    } else {
      // For arrays and primitives, replace outright (AI returns full arrays)
      (merged as Record<string, unknown>)[key] = val;
    }
  }

  return merged;
}
