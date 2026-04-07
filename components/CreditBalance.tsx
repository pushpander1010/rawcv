"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CreditTransaction } from "@/lib/user-store";

interface CreditsData {
  balance: number;
  transactions: CreditTransaction[];
}

export default function CreditBalance() {
  const [data, setData] = useState<CreditsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/credits")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-gray-400 animate-pulse">
        <span className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  if (!data) return null;

  const isLow = data.balance <= 5;

  return (
    <Link
      href="/credits"
      className="flex items-center gap-1.5 text-sm font-medium rounded-lg px-3 py-1.5 border transition-colors
        border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500
        text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
      aria-label={`${data.balance} credits remaining — click to buy more`}
    >
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          isLow ? "bg-red-500" : "bg-emerald-500"
        }`}
        aria-hidden="true"
      />
      <span>
        {data.balance} credit{data.balance !== 1 ? "s" : ""}
      </span>
      {isLow && (
        <span className="text-xs text-red-500 font-normal">— low</span>
      )}
    </Link>
  );
}
