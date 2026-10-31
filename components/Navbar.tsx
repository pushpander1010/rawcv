"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { href: "/build", label: "Builder" },
  { href: "/analyze", label: "Analyze" },
  { href: "/tailor", label: "Tailor" },
  { href: "/cover-letter", label: "Cover letter" },
  { href: "/resume-templates", label: "Templates" },
  { href: "/international", label: "Formats" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="rawcv home">
            <div className="w-7 h-7 rounded-md bg-slate-900 dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-slate-900 font-bold text-[13px] leading-none">R</span>
            </div>
            <span className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-white">
              raw<span className="text-blue-600">cv</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-[13.5px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <ThemeToggle />
            <Link
              href="/build"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[13px] font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              Build resume
              <span aria-hidden="true">→</span>
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Menu"
              aria-expanded={open}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden pb-4 border-t border-slate-100 dark:border-slate-800 pt-2 space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-md text-[14px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2 space-y-0.5">
              <Link href="/about" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-md text-[14px] font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">About</Link>
              <Link href="/contact" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-md text-[14px] font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Contact</Link>
            </div>
            <Link
              href="/build"
              onClick={() => setOpen(false)}
              className="mt-2 block text-center px-4 py-2.5 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-[13.5px]"
            >
              Build my resume
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
