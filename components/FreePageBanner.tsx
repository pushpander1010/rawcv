"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

interface Props {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function FreePageBanner({
  title = "🚀 Unlock AI-Powered Features",
  description = "Create an account to access premium AI features: ATS optimization, JD matching, bullet point enhancement, and more.",
  ctaText = "Create Free Account",
  ctaHref = "/register",
}: Props) {
  const { data: session } = useSession();

  // Don't show banner if user is logged in
  if (session?.user) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-6 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg border border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/30 font-medium text-sm transition-colors"
          >
            🔑 Login
          </Link>
          <Link
            href={ctaHref}
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition-colors"
          >
            ✨ {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
}
