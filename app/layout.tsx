import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Lora } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { ResumeProvider } from "@/context/ResumeContext";
import { ToastProvider } from "@/components/Toast";
import Navbar from "@/components/Navbar";

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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
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
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "rawcv — AI Resume Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "rawcv — AI-Powered Resume Builder & ATS Optimizer",
    description: "Build, analyze, and optimize your resume with AI. Free to start.",
    images: ["/og-image.png"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${lora.variable} antialiased`}
      >
        <SessionProvider>
          <ResumeProvider>
            <ToastProvider>
              <Navbar />
              {children}
              <Analytics />
            </ToastProvider>
          </ResumeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
