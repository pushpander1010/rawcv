import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { ResumeProvider } from "@/context/ResumeContext";
import { ToastProvider } from "@/components/Toast";
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
  title: "rawcv — AI-Powered Resume Platform",
  description:
    "Upload your resume, get an ATS score, match it to any job description, enhance it with AI, and download a polished PDF.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <ResumeProvider>
            <ToastProvider>
              <header className="sticky top-0 z-30 w-full border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <Link href="/" className="font-bold text-lg tracking-tight text-gray-900 dark:text-gray-100">
                      rawcv
                    </Link>
                    <nav className="hidden sm:flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400" aria-label="Main navigation">
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
                    <Link
                      href="/login"
                      className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </header>
              {children}
            </ToastProvider>
          </ResumeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
