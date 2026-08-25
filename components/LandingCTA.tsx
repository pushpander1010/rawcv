"use client";

import Link from "next/link";
import ResumeUploader from "@/components/ResumeUploader";

export function HeroCTA() {
  return (
    <div className="max-w-lg mx-auto">
      <p className="text-sm text-gray-400 mb-4">
        Drop your resume below or{" "}
        <Link href="/chat" className="text-brand-600 hover:underline">build from scratch</Link>.
      </p>
      <ResumeUploader />
      <div className="mt-4 flex gap-3 justify-center">
        <Link href="/analyze" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all duration-200">
          Analyze resume →
        </Link>
        <Link href="/chat" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-white hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm">
          💬 Build from scratch
        </Link>
      </div>
    </div>
  );
}

export function FooterCTA() {
  return (
    <section className="py-20 px-6 text-center">
      <h2 className="text-3xl font-bold mb-4">
        Ready to upgrade your resume?
      </h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Upload your resume and get instant AI-powered analysis, ATS scores, and improvement suggestions — completely free.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/analyze" className="inline-flex items-center px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all duration-200">Analyze resume →</Link>
        <Link href="/chat" className="inline-flex items-center px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium bg-white hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm">💬 Build from scratch</Link>
      </div>
    </section>
  );
}

export function PricingCTA({ highlight }: { highlight: boolean }) {
  return (
    <Link
      href="/analyze"
      className={`block text-center py-2.5 rounded-xl text-sm font-medium hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all duration-200 ${highlight ? "bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/10 hover:shadow-brand-500/20" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm"}`}
    >
      Get started — it&apos;s free
    </Link>
  );
}

export function FooterNav() {
  return (
    <nav className="flex gap-6 flex-wrap" aria-label="Footer navigation">
      <Link href="/about" className="hover:text-gray-700 transition-colors">About</Link>
      <Link href="/blog" className="hover:text-gray-700 transition-colors">Blog</Link>
      <Link href="/analyze" className="hover:text-gray-700 transition-colors">Analyze</Link>
      <Link href="/privacy" className="hover:text-gray-700 transition-colors">Privacy</Link>
      <Link href="/terms" className="hover:text-gray-700 transition-colors">Terms</Link>
    </nav>
  );
}
