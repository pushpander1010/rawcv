"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { CreditTransaction } from "@/lib/user-store";

// ─── Bundle definitions (mirrored from API) ───────────────────────────────────

const BUNDLES = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 50,
    priceUsd: 4.99,
    description: "Great for a few analyses",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 150,
    priceUsd: 9.99,
    description: "Best value for active job seekers",
    highlight: true,
  },
  {
    id: "power",
    name: "Power Pack",
    credits: 400,
    priceUsd: 19.99,
    description: "For power users and career coaches",
    highlight: false,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

function CreditsPageContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "1";
  const cancelled = searchParams.get("cancelled") === "1";

  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    try {
      const res = await fetch("/api/credits");
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
        setTransactions(data.transactions);
      }
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  async function handlePurchase(bundleId: string) {
    setPurchasing(bundleId);
    setPurchaseError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundleId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPurchaseError(data.message ?? "Purchase failed. Please try again.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setPurchaseError("Something went wrong. Please try again.");
    } finally {
      setPurchasing(null);
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Credits</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Credits are consumed when you run AI-powered operations. Choose a model with fewer credits for lighter usage.
      </p>

      {/* Success / cancel banners */}
      {success && (
        <div
          role="alert"
          className="mb-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300"
        >
          Payment successful — your credits have been added to your account.
        </div>
      )}
      {cancelled && (
        <div
          role="alert"
          className="mb-6 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-300"
        >
          Payment cancelled — your balance was not changed.
        </div>
      )}

      {/* Current balance */}
      <div className="mb-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          Current balance
        </p>
        {loadingData ? (
          <div className="h-8 w-24 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        ) : (
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {balance ?? 0}{" "}
            <span className="text-base font-normal text-gray-500 dark:text-gray-400">credits</span>
          </p>
        )}
      </div>

      {/* Bundle options */}
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Buy credits</h2>

      {purchaseError && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400" role="alert">
          {purchaseError}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {BUNDLES.map((bundle) => (
          <div
            key={bundle.id}
            className={`relative rounded-2xl border p-5 flex flex-col gap-3 transition-shadow
              ${bundle.highlight
                ? "border-blue-500 shadow-md shadow-blue-100 dark:shadow-blue-900/20 bg-blue-50 dark:bg-blue-950/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              }`}
          >
            {bundle.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-0.5 rounded-full">
                Most popular
              </span>
            )}
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{bundle.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{bundle.description}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {bundle.credits}{" "}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">credits</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">${bundle.priceUsd.toFixed(2)}</p>
            <button
              type="button"
              onClick={() => handlePurchase(bundle.id)}
              disabled={purchasing !== null}
              className={`mt-auto w-full py-2.5 rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                ${bundle.highlight
                  ? "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 disabled:opacity-50"
                }`}
              aria-label={`Buy ${bundle.name} for $${bundle.priceUsd.toFixed(2)}`}
            >
              {purchasing === bundle.id ? "Redirecting…" : "Buy now"}
            </button>
          </div>
        ))}
      </div>

      {/* Transaction history */}
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Transaction history</h2>

      {loadingData ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
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
                  <td
                    className={`px-4 py-3 text-right font-medium tabular-nums ${
                      tx.amount > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
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
