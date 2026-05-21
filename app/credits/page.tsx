"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useResume } from "@/context/ResumeContext";
import type { CreditTransaction } from "@/lib/user-store";

// ─── Bundle definitions (mirrored from API) ───────────────────────────────────

const BUNDLES = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 50,
    priceInr: 99,
    description: "Great for a few analyses",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 250,
    priceInr: 499,
    description: "Best value for active job seekers",
    highlight: true,
  },
  {
    id: "power",
    name: "Power Pack",
    credits: 500,
    priceInr: 999,
    description: "For power users and career coaches",
    highlight: false,
  },
];

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;

  return await new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

function CreditsPageContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "1";
  const cancelled = searchParams.get("cancelled") === "1";

  const { state, refreshCredits } = useResume();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
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

  useEffect(() => {
    fetchTransactions();
    refreshCredits();
  }, [fetchTransactions, refreshCredits]);

  async function handlePurchase(bundleId: string) {
    setPurchasing(bundleId);
    setPurchaseError(null);
    try {
      const ok = await loadRazorpayScript();
      if (!ok) {
        setPurchaseError("Could not load Razorpay. Please disable ad blockers and try again.");
        return;
      }

      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundleId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPurchaseError(data.message ?? "Purchase failed. Please try again.");
        return;
      }

      if (!window.Razorpay) {
        setPurchaseError("Razorpay is not available. Please refresh and try again.");
        return;
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "rawcv",
        description: data.description ?? "Buy credits",
        order_id: data.orderId,
        prefill: data.prefill ?? undefined,
        theme: { color: "#7c3aed" },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          // Optional immediate verification to show success; credits are added by webhook.
          await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          }).catch(() => null);
          window.location.href = "/credits?success=1";
        },
        modal: {
          ondismiss: () => {
            window.location.href = "/credits?cancelled=1";
          },
        },
      });

      rzp.open();
    } catch {
      setPurchaseError("Something went wrong. Please try again.");
    } finally {
      setPurchasing(null);
    }
  }

  return (
    <main className="min-h-screen py-12 px-6 max-w-5xl mx-auto">
      {/* Header with image */}
      <div className="flex flex-col md:flex-row gap-8 items-center mb-12 bg-gradient-to-br from-violet-50/50 via-white to-gray-50 dark:from-gray-900/50 dark:via-gray-950 dark:to-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800/80 shadow-md relative overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />
        
        <div className="flex-1 text-center md:text-left relative z-10">
          <span className="inline-block mb-3 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/40 dark:to-indigo-900/40 text-violet-700 dark:text-violet-300 uppercase shadow-sm">
            Pricing Plans
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mb-3 bg-gradient-to-r from-gray-900 via-violet-950 to-gray-900 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text">
            AI Credits &amp; Packages
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
            Credits power your AI resume enhancements, ATS checks, and tailored matching. Recharge whenever you run low. Simple, pay-as-you-go pricing.
          </p>
        </div>
        <div className="w-40 h-40 shrink-0 relative rounded-2xl overflow-hidden border border-violet-100 dark:border-violet-900/30 p-1.5 bg-white dark:bg-gray-900 shadow-xl transform hover:scale-[1.03] transition-transform duration-300">
          <img
            src="/pricing_illustration.png"
            alt="Pricing Illustration"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Success / cancel banners */}
      {success && (
        <div
          role="alert"
          className="mb-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-800/80 px-5 py-4 text-sm text-emerald-800 dark:text-emerald-300 shadow-md shadow-emerald-500/5 animate-fade-in flex items-center gap-3"
        >
          <span className="text-lg">✅</span>
          <span className="font-medium">Payment successful — your credits have been added to your account.</span>
        </div>
      )}
      {cancelled && (
        <div
          role="alert"
          className="mb-8 rounded-2xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-255 dark:border-yellow-800/80 px-5 py-4 text-sm text-yellow-800 dark:text-yellow-350 shadow-md shadow-yellow-500/5 animate-fade-in flex items-center gap-3"
        >
          <span className="text-lg">ℹ️</span>
          <span className="font-medium">Payment cancelled — your balance was not changed.</span>
        </div>
      )}

      {/* Current balance */}
      <div className="mb-10 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md shadow-gray-100/50 dark:shadow-none relative overflow-hidden group">
        <div aria-hidden="true" className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-violet-500 to-indigo-600" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
              Current balance
            </p>
            {loadingData ? (
              <div className="h-9 w-28 bg-gray-100 dark:bg-gray-850 rounded-xl animate-pulse" />
            ) : (
              <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight flex items-baseline gap-2">
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {state.creditBalance ?? 0}
                </span>
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-normal">credits available</span>
              </p>
            )}
          </div>
          <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center text-2xl shadow-inner border border-violet-100/30 dark:border-violet-900/10 group-hover:scale-110 transition-transform duration-300">
            💳
          </div>
        </div>
      </div>

      {/* Bundle options */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Select a bundle</h2>
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Each operation costs 2 credits</span>
      </div>

      {purchaseError && (
        <div className="mb-6 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/80 px-5 py-4 text-sm text-red-800 dark:text-red-300 shadow-md shadow-red-500/5 flex items-start gap-3" role="alert">
          <span className="text-lg">⚠️</span>
          <span className="font-medium">{purchaseError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {BUNDLES.map((bundle) => (
          <div
            key={bundle.id}
            className={`relative rounded-3xl border p-6 flex flex-col gap-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.99]
              ${bundle.highlight
                ? "border-violet-500 shadow-lg shadow-violet-100 dark:shadow-none bg-gradient-to-b from-violet-50/50 via-white to-white dark:from-violet-950/20 dark:via-gray-900 dark:to-gray-900"
                : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-violet-200 dark:hover:border-violet-900/50"
              }`}
          >
            {bundle.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-md shadow-violet-500/25 tracking-wide uppercase">
                Most popular
              </span>
            )}
            
            <div className="flex flex-col gap-1">
              <p className="font-extrabold text-lg text-gray-900 dark:text-gray-100 tracking-tight">{bundle.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{bundle.description}</p>
            </div>
            
            <div className="my-2 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/60 shadow-inner flex flex-col gap-1">
              <p className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                {bundle.credits}{" "}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">credits</span>
              </p>
              <p className="text-2xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">₹{bundle.priceInr.toLocaleString("en-IN")}</p>
            </div>

            <button
              type="button"
              onClick={() => handlePurchase(bundle.id)}
              disabled={purchasing !== null}
              className={`mt-auto w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-md
                ${bundle.highlight
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-violet-500/20 hover:shadow-violet-500/35"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 shadow-sm"
                }`}
              aria-label={`Buy ${bundle.name} for ₹${bundle.priceInr.toLocaleString("en-IN")}`}
            >
              {purchasing === bundle.id ? "Redirecting…" : "Buy now"}
            </button>
          </div>
        ))}
      </div>

      {/* Transaction history */}
      <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 tracking-tight">Transaction history</h2>

      {loadingData ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-gray-100 dark:bg-gray-850 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-8 text-center bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-400 dark:text-gray-500">No transactions recorded yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-850 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left" aria-label="Credit transaction history">
              <thead>
                <tr className="bg-gray-55 dark:bg-gray-800/40 text-left border-b border-gray-100 dark:border-gray-800">
                  <th className="px-5 py-3.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Description</th>
                  <th className="px-5 py-3.5 font-bold text-gray-500 dark:text-gray-400 text-right uppercase tracking-wider text-xs">Credits</th>
                  <th className="px-5 py-3.5 font-bold text-gray-500 dark:text-gray-400 text-right hidden sm:table-cell uppercase tracking-wider text-xs">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50/50 dark:hover:bg-gray-850/30 transition-colors">
                    <td className="px-5 py-3.5 text-gray-800 dark:text-gray-200 font-medium">{tx.description}</td>
                    <td
                      className={`px-5 py-3.5 text-right font-bold tabular-nums ${
                        tx.amount > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-450"
                      }`}
                    >
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                    </td>
                    <td className="px-5 py-3.5 text-right text-gray-400 dark:text-gray-500 hidden sm:table-cell">
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
    </main>
  );
}

export default function CreditsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen p-8 max-w-3xl mx-auto" />}>
      <CreditsPageContent />
    </Suspense>
  );
}
