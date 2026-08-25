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
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[64px] flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm leading-none">R</span>
            </div>
            <span className="text-[18px] font-bold tracking-tight text-slate-900">
              raw<span className="text-blue-600">cv</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-[14px] font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <span className="w-px h-5 bg-slate-200 mx-2" />
            <Link href="/about" className="px-3 py-2 text-[14px] font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors">About</Link>
            <Link href="/contact" className="px-3 py-2 text-[14px] font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/analyze"
              className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold transition-colors"
            >
              Start Free
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
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
          <div className="lg:hidden pb-5 border-t border-slate-100 pt-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-[14px] font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                {item.label}
              </Link>
            ))}
            <div className="border-t border-slate-100 my-2 pt-2 space-y-1">
              <Link href="/about" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-[14px] font-medium text-slate-500 hover:bg-slate-50">About</Link>
              <Link href="/contact" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-[14px] font-medium text-slate-500 hover:bg-slate-50">Contact</Link>
            </div>
            <div className="px-3 pt-2">
              <Link href="/analyze" onClick={() => setOpen(false)} className="block w-full text-center px-4 py-3 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors">
                Start Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
