"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useResume } from "@/context/ResumeContext";
import type { CreditTransaction } from "@/lib/user-store";

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
  { href: "/analyze", icon: "📊", label: "Analyze Resume",   desc: "ATS score & suggestions" },
  { href: "/tailor",  icon: "🎯", label: "Tailor to JD",     desc: "Match a job description"  },
  { href: "/chat",    icon: "💬", label: "Chat Builder",      desc: "Build or customize via AI" },
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
    <div className="space-y-8">
      {success && (
        <div role="alert" className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
          Payment successful — your credits have been added.
        </div>
      )}
      {cancelled && (
        <div role="alert" className="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-300">
          Payment cancelled — your balance was not changed.
        </div>
      )}

      {/* Balance card */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Current balance</p>
          {loadingData
            ? <div className="h-8 w-24 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            : <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{state.creditBalance ?? 0} <span className="text-base font-normal text-gray-500">credits</span></p>
          }
        </div>
        <span className="text-4xl" aria-hidden="true">💳</span>
      </div>

      {/* Buy credits */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Buy credits</h2>
        {purchaseError && <p className="mb-4 text-sm text-red-600 dark:text-red-400" role="alert">{purchaseError}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BUNDLES.map((b) => (
            <div key={b.id} className={`relative rounded-2xl border p-5 flex flex-col gap-3 transition-shadow
              ${b.highlight
                ? "border-violet-500 shadow-md shadow-violet-100 dark:shadow-violet-900/20 bg-violet-50 dark:bg-violet-950/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"}`}>
              {b.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-semibold px-3 py-0.5 rounded-full">Most popular</span>
              )}
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{b.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{b.description}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{b.credits} <span className="text-sm font-normal text-gray-500">credits</span></p>
              <p className="text-sm text-gray-600 dark:text-gray-300">₹{b.priceInr.toLocaleString("en-IN")}</p>
              <button
                type="button"
                onClick={() => handlePurchase(b.id)}
                disabled={purchasing !== null}
                aria-label={`Buy ${b.name} for ₹${b.priceInr}`}
                className={`mt-auto w-full py-2.5 rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50
                  ${b.highlight
                    ? "bg-violet-600 hover:bg-violet-700 text-white"
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"}`}
              >
                {purchasing === b.id ? "Redirecting…" : "Buy now"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Transaction history</h2>
        {loadingData ? (
          <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}</div>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No transactions yet.</p>
        ) : (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm" aria-label="Credit transaction history">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Description</th>
                  <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-right">Credits</th>
                  <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-right hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="bg-white dark:bg-gray-900">
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{tx.description}</td>
                    <td className={`px-4 py-3 text-right font-medium tabular-nums ${tx.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-400 dark:text-gray-500 hidden sm:table-cell">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  const { state } = useResume();
  const isLow = (state.creditBalance ?? 0) <= 5;

  return (
    <div className="space-y-8">
      {/* Credit nudge */}
      {isLow && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-4 py-3 text-sm text-amber-700 dark:text-amber-300 flex items-center justify-between gap-4">
          <span>You're running low on credits ({state.creditBalance ?? 0} left).</span>
          <button
            type="button"
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set("tab", "credits");
              window.history.pushState({}, "", url);
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            className="shrink-0 text-xs font-semibold underline hover:no-underline"
          >
            Top up →
          </button>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 flex items-start gap-4 hover:border-violet-400 dark:hover:border-violet-500 hover:shadow-md transition-all"
            >
              <span className="text-3xl" aria-hidden="true">{t.icon}</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{t.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Credit summary */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Credit balance</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {state.creditBalance ?? 0} <span className="text-base font-normal text-gray-500">credits</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const url = new URL(window.location.href);
            url.searchParams.set("tab", "credits");
            window.history.pushState({}, "", url);
            window.dispatchEvent(new PopStateEvent("popstate"));
          }}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          Buy credits
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard shell ──────────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Overview" },
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
    if (t && TABS.some(x => x.id === t)) setTab(t);
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
      <main className="min-h-screen p-8 max-w-3xl mx-auto">
        <div className="h-8 w-48 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-8" />
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}</div>
      </main>
    );
  }

  if (!session) return null;

  const name = session.user?.name ?? session.user?.email ?? "there";

  return (
    <main className="min-h-screen p-6 sm:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Hey, {name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your resume tools and credits from here.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-8 border-b border-gray-200 dark:border-gray-700">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => switchTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500
              ${tab === t.id
                ? "text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400 -mb-px bg-transparent"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"}`}
            aria-selected={tab === t.id}
            role="tab"
          >
            {t.label}
            {t.id === "credits" && (
              <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 tabular-nums">
                {/* balance shown inline so user sees it on the tab */}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && <OverviewTab />}
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
