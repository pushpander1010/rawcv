"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import ResumeUploader from "@/components/ResumeUploader";

export function HeroCTA() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  if (isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto">
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
          Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}! Drop your resume below or{" "}
          <Link href="/chat" className="text-violet-600 hover:underline">build from scratch</Link>.
        </p>
        <ResumeUploader />
        <div className="mt-4 flex gap-3 justify-center">
          <Link href="/analyze" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors">
            Go to dashboard →
          </Link>
          <Link href="/chat" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            💬 Build from scratch
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
      <Link href="/register" className="inline-flex items-center justify-center px-7 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors">
        Get started free
      </Link>
      <Link href="/login" className="inline-flex items-center justify-center px-7 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        Sign in
      </Link>
    </div>
  );
}

export function FooterCTA() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <section className="py-20 px-6 text-center">
      <h2 className="text-3xl font-bold mb-4">
        {isLoggedIn ? "Ready to analyze your resume?" : "Ready to upgrade your resume?"}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
        {isLoggedIn
          ? "Head to your dashboard to run ATS analysis, get AI suggestions, and download a polished PDF."
          : "Create a free account and get started in under a minute."}
      </p>
      {isLoggedIn ? (
        <div className="flex gap-4 justify-center">
          <Link href="/analyze" className="inline-flex items-center px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors">Go to dashboard →</Link>
          <Link href="/chat" className="inline-flex items-center px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">💬 Build from scratch</Link>
        </div>
      ) : (
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="inline-flex items-center px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors">Create free account</Link>
          <Link href="/login" className="inline-flex items-center px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Sign in</Link>
        </div>
      )}
    </section>
  );
}

export function PricingCTA({ highlight }: { highlight: boolean }) {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  return (
    <Link
      href={isLoggedIn ? "/credits" : "/register"}
      className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-colors ${highlight ? "bg-violet-600 hover:bg-violet-700 text-white" : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
    >
      Get started
    </Link>
  );
}

export function FooterNav() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  return (
    <nav className="flex gap-6" aria-label="Footer navigation">
      <Link href="/credits" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Pricing</Link>
      {isLoggedIn
        ? <Link href="/analyze" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Dashboard</Link>
        : <Link href="/register" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Sign up</Link>
      }
      <Link href="/login" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Sign in</Link>
    </nav>
  );
}
