"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { href: "/build", label: "Builder" },
  { href: "/analyze", label: "Analyze" },
  { href: "/tailor", label: "Tailor" },
  { href: "/chat", label: "AI Chat" },
  { href: "/cover-letter", label: "Cover Letter" },
  { href: "/international", label: "Formats" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[64px] flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm leading-none">R</span>
            </div>
            <span className="text-[18px] font-bold tracking-tight text-slate-900 dark:text-white">
              raw<span className="text-blue-600">cv</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-[14px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <span className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-2" />
            <Link href="/about" className="px-3 py-2 text-[14px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800 transition-colors">About</Link>
            <Link href="/contact" className="px-3 py-2 text-[14px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800 transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <Link
              href="/analyze"
              className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold transition-colors"
            >
              Start Free
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Menu"
              aria-expanded={open}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden pb-5 border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-[14px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800 transition-colors">
                {item.label}
              </Link>
            ))}
            <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2 space-y-1">
              <Link href="/about" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-[14px] font-medium text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800">About</Link>
              <Link href="/contact" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-[14px] font-medium text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800">Contact</Link>
            </div>
            <div className="px-3 pt-2 flex items-center gap-2">
              <Link href="/analyze" onClick={() => setOpen(false)} className="flex-1 text-center px-4 py-3 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors">
                Start Free
              </Link>
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}