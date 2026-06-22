"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useResume } from "@/context/ResumeContext";
import ResumeUploader from "@/components/ResumeUploader";
import PhotoUpload from "@/components/PhotoUpload";
import type { CreditTransaction } from "@/lib/user-store";
import { RESUME_FORMAT_INFO } from "@/types";
import type { ResumeFormat } from "@/types";

// ─── Bundle definitions ───────────────────────────────────────────────────────

const BUNDLES = [
  { id: "starter", name: "Starter Pack", credits: 50,  priceInr: 99,  description: "Great for a few analyses",           highlight: false },
  { id: "pro",     name: "Pro Pack",     credits: 250, priceInr: 499, description: "Best value for active job seekers",  highlight: true  },
  { id: "power",   name: "Power Pack",   credits: 500, priceInr: 999, description: "For power users and career coaches", highlight: false },
];

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

async function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// ─── Quick-action cards ───────────────────────────────────────────────────────

const TOOLS = [
  { href: "/analyze", icon: "📊", label: "Analyze Resume",   desc: "ATS score & suggestions",   color: "violet" },
  { href: "/tailor",  icon: "🎯", label: "Tailor to JD",     desc: "Match a job description",    color: "blue"   },
  { href: "/chat",    icon: "💬", label: "Chat Builder",      desc: "Build or customize via AI",  color: "emerald"},
];

const TIPS = [
  { icon: "📤", title: "Upload your resume", desc: "Start by uploading a PDF or DOCX — we'll parse it instantly." },
  { icon: "📊", title: "Run an ATS check",   desc: "See how your resume scores against applicant tracking systems." },
  { icon: "🎯", title: "Tailor to a job",    desc: "Paste a job description and get a tailored version in seconds." },
  { icon: "💬", title: "Chat to refine",     desc: "Use the AI chat builder to tweak wording, tone, and structure." },
];

// ─── Credits tab ─────────────────────────────────────────────────────────────

function CreditsTab() {
  const searchParams = useSearchParams();
  const success   = searchParams.get("success")   === "1";
  const cancelled = searchParams.get("cancelled") === "1";

  const { state, refreshCredits } = useResume();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loadingData, setLoadingData]   = useState(true);
  const [purchasing, setPurchasing]     = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/credits");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions ?? []);
      }
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => { fetchData(); refreshCredits(); }, [fetchData, refreshCredits]);

  async function handlePurchase(bundleId: string) {
    setPurchasing(bundleId);
    setPurchaseError(null);
    try {
      const ok = await loadRazorpay();
      if (!ok) { setPurchaseError("Could not load Razorpay. Disable ad blockers and try again."); return; }

      const res  = await fetch("/api/razorpay/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bundleId }) });
      const data = await res.json();
      if (!res.ok) { setPurchaseError(data.message ?? "Purchase failed. Please try again."); return; }
      if (!window.Razorpay) { setPurchaseError("Razorpay unavailable. Please refresh."); return; }

      const rzp = new window.Razorpay({
        key: data.keyId, amount: data.amount, currency: data.currency,
        name: "rawcv", description: data.description ?? "Buy credits",
        order_id: data.orderId, prefill: data.prefill ?? undefined,
        theme: { color: "#7c3aed" },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          await fetch("/api/razorpay/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(response) }).catch(() => null);
          window.location.href = "/dashboard?tab=credits&success=1";
        },
        modal: { ondismiss: () => { window.location.href = "/dashboard?tab=credits&cancelled=1"; } },
      });
      rzp.open();
    } catch { setPurchaseError("Something went wrong. Please try again."); }
    finally { setPurchasing(null); }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {success && (
        <div role="alert" className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-800/80 px-5 py-4 text-sm text-emerald-800 dark:text-emerald-350 shadow-md shadow-emerald-500/5 flex items-center gap-3">
          <span className="text-lg">✅</span>
          <span className="font-semibold">Payment successful — your credits have been added.</span>
        </div>
      )}
      {cancelled && (
        <div role="alert" className="rounded-2xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-255 dark:border-yellow-800/80 px-5 py-4 text-sm text-yellow-800 dark:text-yellow-350 shadow-md shadow-yellow-500/5 flex items-center gap-3">
          <span className="text-lg">ℹ️</span>
          <span className="font-semibold">Payment cancelled — your balance was not changed.</span>
        </div>
      )}

      {/* Header banner */}
      <div className="flex flex-col md:flex-row gap-6 items-center bg-gradient-to-br from-violet-50/50 via-white to-gray-50 dark:from-gray-900/50 dark:via-gray-950 dark:to-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800/80 shadow-md relative overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-violet-500/10 blur-2xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-indigo-500/10 blur-2xl" />
        
        <div className="flex-1 text-center md:text-left relative z-10">
          <span className="inline-block mb-2.5 px-3 py-0.5 rounded-full text-xs font-bold tracking-wide bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/40 dark:to-indigo-900/40 text-violet-700 dark:text-violet-300 uppercase shadow-sm">
            Credits Management
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mb-1">
            Top Up Your Account
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
            Credits power your AI resume actions, ATS scans, and JD matching. Select a bundle below to recharge.
          </p>
        </div>
        <div className="w-24 h-24 shrink-0 relative rounded-2xl overflow-hidden border border-violet-100 dark:border-violet-900/30 p-1 bg-white dark:bg-gray-900 shadow-md transform hover:scale-[1.03] transition-transform duration-300">
          <img
            src="/pricing_illustration.png"
            alt="Pricing Illustration"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Balance card */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md relative overflow-hidden group">
        <div aria-hidden="true" className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-violet-500 to-indigo-650" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1.5">Current balance</p>
            {loadingData ? (
              <div className="h-9 w-28 bg-gray-100 dark:bg-gray-850 rounded-xl animate-pulse" />
            ) : (
              <p className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight flex items-baseline gap-2">
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {state.creditBalance ?? 0}
                </span>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 tracking-normal">credits available</span>
              </p>
            )}
          </div>
          <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center text-2xl shadow-inner border border-violet-100/30 dark:border-violet-900/10 group-hover:scale-110 transition-transform duration-300">
            💳
          </div>
        </div>
      </div>

      {/* Buy credits */}
      <div>
        <h3 className="text-sm font-bold text-gray-950 dark:text-gray-150 uppercase tracking-widest mb-4">Select a Bundle</h3>
        {purchaseError && (
          <div className="mb-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/80 px-5 py-4 text-sm text-red-850 dark:text-red-300 shadow-md flex items-start gap-3" role="alert">
            <span className="text-lg">⚠️</span>
            <span className="font-semibold">{purchaseError}</span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BUNDLES.map((b) => (
            <div key={b.id} className={`relative rounded-3xl border p-5 flex flex-col gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.99]
              ${b.highlight
                ? "border-violet-500 shadow-lg shadow-violet-100 dark:shadow-none bg-gradient-to-b from-violet-50/50 via-white to-white dark:from-violet-950/20 dark:via-gray-900 dark:to-gray-900"
                : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-violet-250 dark:hover:border-violet-900/50"}`}>
              {b.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-650 text-white text-xxs font-extrabold px-3 py-1 rounded-full shadow-md shadow-violet-550/25 tracking-wider uppercase">Most popular</span>
              )}
              <div>
                <p className="font-extrabold text-gray-950 dark:text-gray-100 tracking-tight">{b.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-normal">{b.description}</p>
              </div>
              
              <div className="my-1 p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-850/40 border border-gray-100 dark:border-gray-800/60 shadow-inner flex flex-col gap-1">
                <p className="text-2xl font-black text-gray-950 dark:text-gray-100 tracking-tight">{b.credits} <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">credits</span></p>
                <p className="text-lg font-extrabold text-violet-700 dark:text-violet-300">₹{b.priceInr.toLocaleString("en-IN")}</p>
              </div>

              <button
                type="button"
                onClick={() => handlePurchase(b.id)}
                disabled={purchasing !== null}
                aria-label={`Buy ${b.name} for ₹${b.priceInr}`}
                className={`mt-auto w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none hover:scale-[1.02] active:scale-[0.98] shadow-sm
                  ${b.highlight
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-750 hover:to-indigo-750 text-white shadow-violet-500/20"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750"}`}
              >
                {purchasing === b.id ? "Redirecting…" : "Buy now"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div>
        <h3 className="text-sm font-bold text-gray-950 dark:text-gray-150 uppercase tracking-widest mb-4">Transaction history</h3>
        {loadingData ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 dark:bg-gray-850 rounded-2xl animate-pulse" />)}</div>
        ) : transactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-255 dark:border-gray-800 p-8 text-center bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">No transactions recorded yet.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-850 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left" aria-label="Credit transaction history">
                <thead>
                  <tr className="bg-gray-55 dark:bg-gray-800/40 text-left border-b border-gray-100 dark:border-gray-800">
                    <th className="px-5 py-3 font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">Description</th>
                    <th className="px-5 py-3 font-bold text-gray-500 dark:text-gray-400 text-right uppercase tracking-wider text-xs">Credits</th>
                    <th className="px-5 py-3 font-bold text-gray-500 dark:text-gray-400 text-right hidden sm:table-cell uppercase tracking-wider text-xs">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50/50 dark:hover:bg-gray-850/30 transition-colors">
                      <td className="px-5 py-3 text-gray-900 dark:text-gray-100 font-medium">{tx.description}</td>
                      <td className={`px-5 py-3 text-right font-bold tabular-nums ${tx.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-450"}`}>
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                      </td>
                      <td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                        {new Date(tx.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function ScoreBadge({ score, label }: { score: number; label: string }) {
  const color =
    score >= 75 ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/80"
    : score >= 50 ? "text-amber-600 dark:text-amber-400 bg-amber-50/70 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/80"
    : "text-rose-600 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-800/80";
  return (
    <div className={`rounded-2xl border px-5 py-3.5 flex flex-col items-center justify-center gap-0.5 shadow-sm transform hover:scale-[1.03] transition-transform duration-250 min-w-[90px] ${color}`}>
      <span className="text-3xl font-black tracking-tight tabular-nums">{score}</span>
      <span className="text-xxs font-bold uppercase tracking-wider opacity-90">{label}</span>
    </div>
  );
}

function OverviewTab({ onSwitchTab }: { onSwitchTab: (id: TabId) => void }) {
  const { state } = useResume();
  const isLow = (state.creditBalance ?? 0) <= 5;
  const hasResume = !!state.parsed;
  const hasAts = !!state.atsResult;
  const hasRelevance = !!state.relevanceResult;
  const hasTailored = !!state.tailoredResume;
  const hasSuggestions = state.suggestions.length > 0;
  const hasActivity = hasAts || hasRelevance || hasTailored || hasSuggestions;

  // Credit bar: cap at 100 for display
  const balance = state.creditBalance ?? 0;
  const barPct = Math.min(100, Math.round((balance / 100) * 100));
  const barColor =
    balance <= 5 ? "bg-gradient-to-r from-rose-500 to-red-650"
    : balance <= 20 ? "bg-gradient-to-r from-amber-500 to-orange-550"
    : "bg-gradient-to-r from-violet-500 to-indigo-600";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Low-credit nudge */}
      {isLow && (
        <div
          role="alert"
          className="rounded-2xl bg-amber-50 dark:bg-amber-955/20 border border-amber-250 dark:border-amber-800/80 px-5 py-3.5 text-sm text-amber-800 dark:text-amber-300 flex items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span className="font-semibold">You&apos;re running low on credits ({balance} left).</span>
          </div>
          <button
            type="button"
            onClick={() => onSwitchTab("credits")}
            className="shrink-0 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-850 dark:text-amber-300 hover:scale-[1.03] active:scale-[0.97] transition-transform duration-200"
          >
            Top up →
          </button>
        </div>
      )}

      {/* Resume status + credit balance — two-column on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Resume status card */}
        <div className="rounded-3xl border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 flex flex-col gap-4 hover:border-violet-300 dark:hover:border-violet-800/80 transition-all duration-300 shadow-md hover:shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Resume</p>
            <span
              className={`inline-flex items-center gap-1.5 text-xxs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                hasResume
                  ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/30"
                  : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-150 dark:border-gray-700"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${hasResume ? "bg-emerald-500" : "bg-gray-400"}`} aria-hidden="true" />
              {hasResume ? "Loaded" : "Not loaded"}
            </span>
          </div>
          {hasResume ? (
            <div className="flex-1">
              <p className="font-extrabold text-gray-950 dark:text-gray-100 truncate text-base tracking-tight">
                {state.parsed?.contact?.name ?? "Your resume"}
              </p>
              {state.parsed?.contact?.email && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 truncate">{state.parsed.contact.email}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {state.parsed?.skills?.slice(0, 3).map((s) => (
                  <span key={s} className="text-xxs font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-750 dark:text-violet-300 border border-violet-100 dark:border-violet-900/40 rounded-lg px-2.5 py-1">
                    {s}
                  </span>
                ))}
                {(state.parsed?.skills?.length ?? 0) > 3 && (
                  <span className="text-xxs text-gray-500 dark:text-gray-550 font-bold self-center ml-1">+{(state.parsed?.skills?.length ?? 0) - 3} more</span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
              <ResumeUploader />
            </div>
          )}
          {hasResume ? (
            <div className="flex gap-2">
              <Link
                href="/analyze"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-violet-500/10 hover:shadow-violet-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Re-analyze →
              </Link>
              <Link
                href="/chat"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm"
              >
                ✏️ Edit
              </Link>
            </div>
          ) : null}
        </div>

        {/* Credit balance card */}
        <div className="rounded-3xl border border-gray-255 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 flex flex-col gap-4 hover:border-violet-300 dark:hover:border-violet-800/80 transition-all duration-300 shadow-md hover:shadow-lg">
          <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Credits</p>
          <div className="flex items-end justify-between gap-2">
            <p className="text-3xl font-black text-gray-950 dark:text-gray-100 tracking-tight tabular-nums">
              {balance}
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1.5">left</span>
            </p>
            <span className="text-3xl" aria-hidden="true">💳</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden" role="progressbar" aria-valuenow={balance} aria-valuemin={0} aria-valuemax={100} aria-label="Credit balance">
            <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${barPct}%` }} />
          </div>
          <p className="text-xxs text-gray-600 dark:text-gray-400 font-medium">Each AI operation costs 2 credits.</p>
          <button
            type="button"
            onClick={() => onSwitchTab("credits")}
            className="mt-auto w-full py-3 rounded-xl text-sm font-bold bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-850 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Buy more credits
          </button>
        </div>
      </div>

      {/* Recent activity */}
      {hasActivity && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-950 dark:text-gray-150 uppercase tracking-widest">Last session</h3>
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-5 shadow-md">
            {/* Score row */}
            {(hasAts || hasRelevance) && (
              <div className="flex flex-wrap gap-4">
                {hasAts && state.atsResult && (
                  <ScoreBadge score={state.atsResult.score} label="ATS score" />
                )}
                {hasRelevance && state.relevanceResult && (
                  <ScoreBadge score={state.relevanceResult.score} label="JD match" />
                )}
              </div>
            )}

            {/* Status pills */}
            <div className="flex flex-wrap gap-2">
              {hasSuggestions && (
                <span className="inline-flex items-center gap-1.5 text-xxs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 text-blue-750 dark:text-blue-300 border border-blue-100/80 dark:border-blue-900/30">
                  ✨ {state.suggestions.length} suggestion{state.suggestions.length !== 1 ? "s" : ""} generated
                </span>
              )}
              {hasTailored && (
                <span className="inline-flex items-center gap-1.5 text-xxs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-750 dark:text-emerald-350 border border-emerald-100/80 dark:border-emerald-900/30">
                  🎯 Resume tailored to JD
                </span>
              )}
              {state.enhancements.length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xxs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl bg-violet-50/60 dark:bg-violet-950/20 text-violet-750 dark:text-violet-300 border border-violet-100/80 dark:border-violet-900/30">
                  🚀 {state.enhancements.length} enhancement{state.enhancements.length !== 1 ? "s" : ""} applied
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-4 pt-1 border-t border-gray-100 dark:border-gray-800/85">
              <Link href="/analyze" className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
                View analysis <span className="text-sm">→</span>
              </Link>
              {hasTailored && (
                <Link href="/tailor" className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
                  View tailored resume <span className="text-sm">→</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-950 dark:text-gray-150 uppercase tracking-widest">Quick actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TOOLS.map((t) => {
            const colorMap = {
              violet: "bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 border-violet-100/50 dark:border-violet-900/20 group-hover:border-violet-400",
              blue: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-100/50 dark:border-blue-900/20 group-hover:border-blue-400",
              emerald: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/20 group-hover:border-emerald-400",
            };
            const activeColor = colorMap[t.color as "violet" | "blue" | "emerald"] || colorMap.violet;
            return (
              <Link
                key={t.href}
                href={t.href}
                className="group rounded-3xl border border-gray-150 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 flex items-start gap-4 hover:-translate-y-1 hover:shadow-lg hover:scale-[1.02] active:scale-[0.99] transition-all duration-300"
              >
                <span className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl ${activeColor} border text-2xl transition-transform duration-300 group-hover:scale-110`} aria-hidden="true">
                  {t.icon}
                </span>
                <div>
                  <p className="font-bold text-gray-950 dark:text-gray-100 tracking-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{t.label}</p>
                  <p className="text-xxs text-gray-500 dark:text-gray-500 mt-1 leading-relaxed font-medium">{t.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Getting started tips — only shown when no resume loaded */}
      {!hasResume && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-950 dark:text-gray-150 uppercase tracking-widest">How it works</h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <ol className="md:col-span-7 grid grid-cols-1 gap-3" aria-label="Getting started steps">
              {TIPS.map((tip, i) => (
                <li key={tip.title} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex items-start gap-3 shadow-sm hover:shadow transition-shadow duration-250">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/35 text-violet-750 dark:text-violet-300 text-xs font-black flex items-center justify-center shadow-sm" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-gray-955 dark:text-gray-100 flex items-center gap-1.5 tracking-tight">
                      <span aria-hidden="true">{tip.icon}</span> {tip.title}
                    </p>
                    <p className="text-xs text-gray-450 dark:text-gray-500 mt-1 leading-relaxed font-medium">{tip.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="md:col-span-5 hidden md:block">
              <div className="relative rounded-3xl overflow-hidden border border-violet-100 dark:border-violet-900/30 p-1.5 bg-gradient-to-b from-violet-50/50 to-white dark:from-violet-950/20 dark:to-gray-900 shadow-lg transform hover:scale-[1.02] transition-all duration-300">
                <img
                  src="/ats_illustration.png"
                  alt="Getting Started Illustration"
                  className="w-full h-auto rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Profile tab ──────────────────────────────────────────────────────────────



function ProfileTab() {
  const { state, setState } = useResume();

  function deleteCoverLetter(id: string) {
    setState((prev) => ({
      ...prev,
      coverLetters: prev.coverLetters.filter((cl) => cl.id !== id),
    }));
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Photo upload */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md hover:border-violet-300 dark:hover:border-violet-800/80 transition-all duration-300">
        <h3 className="text-sm font-bold text-gray-950 dark:text-gray-150 uppercase tracking-widest mb-4">Profile Photo</h3>
        <PhotoUpload />
        <p className="mt-3 text-xs text-violet-600 dark:text-violet-400 font-semibold">
          This will be used in resumes
        </p>
      </div>

      {/* International resume formats & languages — now on /international */}
      <Link
        href="/international"
        className="block rounded-3xl border border-violet-200 dark:border-violet-800/60 bg-gradient-to-br from-violet-50/80 to-white dark:from-violet-950/30 dark:to-gray-900 p-6 shadow-md hover:shadow-lg hover:border-violet-400 dark:hover:border-violet-700 transition-all duration-300 group"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-950 dark:text-gray-150 uppercase tracking-widest mb-2">
              International Resumes
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage resume formats, languages, and localization settings
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform">
            Open
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>

      {/* Cover letters */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md hover:border-violet-300 dark:hover:border-violet-800/80 transition-all duration-300">
        <h3 className="text-sm font-bold text-gray-950 dark:text-gray-150 uppercase tracking-widest mb-4">Cover Letters</h3>
        {state.coverLetters.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-500">No saved cover letters yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.coverLetters.map((cl) => (
              <div
                key={cl.id}
                className="rounded-2xl border border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/30 p-4 flex items-start justify-between gap-3 hover:bg-gray-50 dark:hover:bg-gray-850/60 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                      {cl.recipientCompany
                        ? `Cover letter — ${cl.recipientCompany}${cl.recipientName ? ` (${cl.recipientName})` : ""}`
                        : "Cover letter"}
                    </span>
                    <span className="text-xxs font-semibold uppercase px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-900/30">
                      {RESUME_FORMAT_INFO[cl.format]?.label ?? cl.format}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-2">{cl.opening}</p>
                  <p className="text-xxs text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(cl.createdAt).toLocaleDateString(undefined, {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteCoverLetter(cl.id)}
                  className="shrink-0 p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  aria-label="Delete cover letter"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard shell ──────────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "profile",  label: "Profile"  },
  { id: "credits",  label: "Credits"  },
] as const;

type TabId = typeof TABS[number]["id"];

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<TabId>((searchParams.get("tab") as TabId) ?? "overview");

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  // Sync tab from URL (handles back/forward and direct links)
  useEffect(() => {
    const t = searchParams.get("tab") as TabId | null;
    if (t && TABS.some(x => x.id === t)) {
      // Use setTimeout to avoid cascading renders
      setTimeout(() => setTab(t), 0);
    }
  }, [searchParams]);

  function switchTab(id: TabId) {
    setTab(id);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", id);
    // Clear payment status params when switching tabs
    url.searchParams.delete("success");
    url.searchParams.delete("cancelled");
    window.history.pushState({}, "", url);
  }

  if (status === "loading") {
    return (
      <main className="min-h-screen p-8 max-w-3xl mx-auto flex flex-col justify-center items-center">
        <div className="h-8 w-48 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-8" />
        <div className="space-y-4 w-full">{[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />)}</div>
      </main>
    );
  }

  if (!session) return null;

  const name = session.user?.name ?? session.user?.email ?? "there";

  return (
    <main className="min-h-screen p-6 sm:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-905 dark:text-gray-100 tracking-tight">
          Hey, {name.split(" ")[0]} 👋
        </h1>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1.5 p-1 mb-8 rounded-2xl bg-gray-100/80 dark:bg-gray-900/60 border border-gray-200/50 dark:border-gray-800/80 max-w-xs shadow-inner">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => switchTab(t.id)}
            className={`flex-1 px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 focus:outline-none hover:scale-[1.02] active:scale-[0.98]
              ${tab === t.id
                ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-850 dark:hover:text-gray-250"}`}
            aria-selected={tab === t.id}
            role="tab"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && <OverviewTab onSwitchTab={switchTab} />}
      {tab === "profile"  && <ProfileTab />}
      {tab === "credits"  && <CreditsTab />}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<main className="min-h-screen p-8 max-w-3xl mx-auto" />}>
      <DashboardContent />
    </Suspense>
  );
}
