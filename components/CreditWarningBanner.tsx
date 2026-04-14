"use client";

import Link from "next/link";

interface Props {
  balance: number | null;
}

const LOW_THRESHOLD = 10;

export default function CreditWarningBanner({ balance }: Props) {
  if (balance === null || balance > LOW_THRESHOLD) return null;

  const empty = balance <= 0;

  return (
    <div
      role="alert"
      className={`flex items-center gap-3 px-4 py-2.5 text-sm border-b ${
        empty
          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
          : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200"
      }`}
    >
      <span className="text-base" aria-hidden="true">{empty ? "💳" : "⚠"}</span>
      <span className="flex-1">
        {empty
          ? "You're out of credits."
          : `You have ${balance} credit${balance !== 1 ? "s" : ""} left — running low.`}
      </span>
      <Link
        href="/credits"
        className={`shrink-0 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
          empty
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-amber-500 hover:bg-amber-600 text-white"
        }`}
      >
        Buy credits
      </Link>
    </div>
  );
}
