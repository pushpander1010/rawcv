"use client";

import Link from "next/link";
import { useState } from "react";

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
    <nav className="sticky top-0 z-50 w-full bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-200/80 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm group-hover:shadow-brand transition-shadow">
              <span className="text-white font-bold text-sm leading-none">R</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              raw<span className="text-brand-600">cv</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100/70 dark:hover:bg-gray-800/60 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <span className="w-px h-5 bg-gray-200 dark:bg-gray-800 mx-2" />
            <Link href="/about" className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100/70 dark:hover:bg-gray-800/60 transition-colors">About</Link>
            <Link href="/contact" className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100/70 dark:hover:bg-gray-800/60 transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/analyze"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-sm hover:shadow-brand transition-all"
            >
              Start Free
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
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
          <div className="lg:hidden pb-5 space-y-1 border-t border-gray-100 dark:border-gray-800 pt-3">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-2">
              <Link href="/about" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900">About</Link>
              <Link href="/contact" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900">Contact</Link>
            </div>
            <div className="px-3 pt-2">
              <Link href="/analyze" onClick={() => setOpen(false)} className="block w-full text-center px-4 py-3 rounded-lg bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors">
                Start Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
