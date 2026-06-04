"use client";

import { useSession } from "next-auth/react";

export default function DashboardSeoBanner() {
  const { status } = useSession();

  if (status === "authenticated") return null;

  return (
    <section className="bg-white dark:bg-gray-950 py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          Your Resume Dashboard
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
          Your rawcv dashboard is the command center for your entire resume workflow. From here you
          can manage all the resumes you&apos;ve created or uploaded, track your analysis history, monitor
          your credit usage, and pick up exactly where you left off. Whether you&apos;re targeting multiple
          roles at once or iterating on a single application, the dashboard keeps everything organized
          in one place so you never lose progress.
        </p>

        <h2 className="mt-12 text-2xl font-semibold text-gray-900 dark:text-white">
          Resume Management &amp; History
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Every resume you build or upload is saved and accessible from your dashboard. You can
          create multiple versions tailored to different job applications, duplicate an existing
          resume as a starting point for a new one, or delete outdated drafts. The dashboard
          displays the last modified date, ATS score (if analyzed), and current status for each
          resume, giving you a snapshot view of your entire portfolio. Click on any entry to jump
          directly into editing, analysis, or chat mode.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-gray-900 dark:text-white">
          Analysis History &amp; Score Tracking
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          View a chronological log of every ATS analysis you&apos;ve run, complete with the score,
          matched job description title, and date. This history helps you track improvement over
          time — see how applying the AI&apos;s suggestions moved the needle on your compatibility score.
          Each entry is clickable, letting you revisit the full analysis report, compare different
          versions side by side, and export results if needed. The dashboard also highlights your
          highest and most recent scores so you can gauge your progress at a glance.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-gray-900 dark:text-white">
          Credits, Plans &amp; Purchases
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Your credit balance is displayed prominently at the top of the dashboard. Each analysis,
          chat session, or export action consumes a configurable number of credits, and the
          dashboard shows your remaining balance alongside a usage breakdown. When you&apos;re running
          low, you can purchase credit bundles directly from the dashboard — options range from
          pay-as-you-go packs to subscription plans for frequent users. A transaction history tab
          logs every purchase, refund, and credit adjustment so you always know where your credits
          went.
        </p>
      </div>
    </section>
  );
}