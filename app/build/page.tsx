import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import FreeBuildClient from "./FreeBuildClient";
import FreePageBanner from "@/components/FreePageBanner";

export const metadata: Metadata = {
  title: "Free Resume Builder - Create & Download | rawcv",
  description:
    "Build a professional resume for free. No login required. Choose from 9 themes, preview live, and download instantly. No watermark.",
  keywords: [
    "free resume builder",
    "resume maker",
    "create resume",
    "resume templates",
    "professional resume",
    "resume download",
  ],
  openGraph: {
    title: "Free Resume Builder - Create & Download | rawcv",
    description:
      "Build a professional resume for free. No login required. Choose from 9 themes, preview live, and download instantly.",
    type: "website",
    url: "https://www.rawcv.com/build",
  },
};

export default function BuildPage() {
  return (
    <main id="main" className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800 bg-gradient-to-br from-violet-50/50 via-white to-gray-50 dark:from-gray-900/50 dark:via-gray-950 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-gradient-to-br from-violet-200/40 to-transparent dark:from-violet-900/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 text-left">
            <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 uppercase">
              100% Free · No Watermarks
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
              Build Your{" "}
              <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
                Professional Resume
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Create and download a polished resume in minutes. Choose from 9 ATS-friendly visual themes, preview in real time, and download completely free without any signup.
            </p>
          </div>
          <div className="md:col-span-4 hidden md:block">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-violet-100 dark:border-violet-900/40 bg-white dark:bg-gray-900 p-1.5 transform hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="/builder_illustration.png" 
                alt="rawcv Resume Builder Illustration" 
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FreePageBanner
          title="🚀 Unlock AI-Powered Resume Features"
          description="Sign up for free to access premium AI features: ATS optimization, JD matching, bullet point enhancement, and personalized suggestions."
          ctaText="Create Free Account"
          ctaHref="/register"
        />
        <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <FreeBuildClient />
        </Suspense>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              ✨ Make Your Resume AI-Ready
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Unlock premium AI features to optimize your resume for ATS systems, match job descriptions, and get personalized suggestions.
            </p>
            <a
              href="/login?redirect=/analyze"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:-translate-y-0.5 transition-all"
            >
              Explore AI Features
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <Script
        id="breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.rawcv.com" },
              { "@type": "ListItem", position: 2, name: "Free Resume Builder", item: "https://www.rawcv.com/build" },
            ],
          }),
        }}
      />
    </main>
  );
}
