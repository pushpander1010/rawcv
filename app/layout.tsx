import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Lora } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
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
  title: {
    default: "rawcv — Free AI Resume Builder, ATS Score Checker & Job Match Tool",
    template: "%s | rawcv",
  },
  description:
    "Build, analyze, and optimize your resume with AI — 100% free. Get instant ATS scores, match resumes to job descriptions, enhance bullet points, generate cover letters, and download polished PDFs. No signup required.",
  keywords: [
    "free resume builder", "AI resume builder", "ATS score checker", "resume optimizer",
    "job description match", "resume checker", "CV builder", "resume AI",
    "ATS friendly resume", "resume enhancement", "cover letter generator",
    "resume templates", "resume analyzer", "AI resume writer", "resume scorer",
    "job match tool", "resume PDF download", "international resume format",
    "resume builder free", "ATS resume checker free", "AI CV builder"
  ],
  authors: [{ name: "rawcv", url: "https://www.rawcv.com" }],
  creator: "rawcv",
  publisher: "rawcv",
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
    title: "rawcv — Free AI Resume Builder & ATS Score Checker",
    description:
      "Build, analyze, and optimize your resume with AI — 100% free. Get ATS scores, job matching, AI suggestions, and polished PDF downloads.",
    siteName: "rawcv",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "rawcv — Free AI Resume Builder" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "rawcv — Free AI Resume Builder & ATS Score Checker",
    description: "Build, analyze, and optimize your resume with AI — 100% free. No signup required.",
    images: ["/og-image.png"],
    creator: "@rawcv",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="json-ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "rawcv",
              url: "https://www.rawcv.com",
              logo: "https://www.rawcv.com/favicon.svg",
              description: "Free AI-powered resume builder with ATS scoring, job matching, and instant PDF downloads.",
              sameAs: [],
            }),
          }}
        />
        <Script
          id="json-ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "rawcv",
              url: "https://www.rawcv.com",
              description: "Free AI-powered resume builder, ATS score checker, and job match optimizer.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.rawcv.com/analyze",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <Script
          id="json-ld-app"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "rawcv",
              url: "https://www.rawcv.com",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              description: "Free AI-powered resume builder with ATS scoring, job description matching, AI suggestions, and PDF downloads.",
            }),
          }}
        />
      </head>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6216304334889617"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${lora.variable} antialiased`}
      >
        <ResumeProvider>
          <ToastProvider>
            <Navbar />
            {children}
            <Analytics />
          </ToastProvider>
        </ResumeProvider>
      </body>
    </html>
  );
}
