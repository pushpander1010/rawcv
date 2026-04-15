import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { ResumeProvider } from "@/context/ResumeContext";
import { ToastProvider } from "@/components/Toast";
import UserNav from "@/components/UserNav";
import CreditBalance from "@/components/CreditBalance";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "rawcv — AI-Powered Resume Builder & ATS Optimizer",
  description:
    "Build, analyze, and optimize your resume with AI. Get ATS scores, match resumes to job descriptions, enhance bullet points, and download polished PDFs. Free to start.",
  keywords: [
    "resume builder", "AI resume", "ATS score", "resume optimizer",
    "job description match", "resume checker", "CV builder", "resume AI",
    "ATS friendly resume", "resume enhancement"
  ],
  authors: [{ name: "rawcv" }],
  creator: "rawcv",
  metadataBase: new URL("https://www.rawcv.com"),
  alternates: { canonical: "https://www.rawcv.com" },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    url: "https://www.rawcv.com",
    title: "rawcv — AI-Powered Resume Builder & ATS Optimizer",
    description:
      "Build, analyze, and optimize your resume with AI. Get ATS scores, match resumes to job descriptions, and download polished PDFs.",
    siteName: "rawcv",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "rawcv — AI Resume Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "rawcv — AI-Powered Resume Builder & ATS Optimizer",
    description: "Build, analyze, and optimize your resume with AI. Free to start.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6216304334889617"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <ResumeProvider>
            <ToastProvider>
              <header className="sticky top-0 z-30 w-full border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                      <img src="/favicon.svg" alt="rawcv logo" width={28} height={28} className="rounded-md" />
                      <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-gray-100">rawcv</span>
                    </Link>
                    <nav className="hidden sm:flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400" aria-label="Main navigation">
                      <Link href="/dashboard" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                        Dashboard
                      </Link>
                      <Link href="/analyze" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                        Analyze
                      </Link>
                      <Link href="/tailor" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                        Tailor
                      </Link>
                      <Link href="/chat" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                        Chat
                      </Link>
                    </nav>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditBalance />
                    <UserNav />
                  </div>
                </div>
              </header>
              {children}
              <Analytics />
            </ToastProvider>
          </ResumeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
