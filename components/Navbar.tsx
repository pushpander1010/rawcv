"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

function Dropdown({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {label}
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {children}
        </div>
      )}
    </div>
  );
}

function DropLink({ href, icon, label, desc, onClick }: { href: string; icon: string; label: string; desc?: string; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <span className="text-lg mt-0.5">{icon}</span>
      <div>
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</div>
        {desc && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</div>}
      </div>
    </Link>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:shadow-violet-500/30 transition-shadow">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-gray-900 dark:text-gray-100">
              raw<span className="text-violet-600">cv</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            <Link href="/build" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">Builder</Link>
            <Link href="/analyze" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">Analyze</Link>

            <Dropdown label="Tools">
              <DropLink href="/tailor" icon="✂️" label="Tailor Resume" desc="Match your resume to a job description" />
              <DropLink href="/chat" icon="💬" label="AI Chat" desc="Build or customize with AI conversation" />
              <DropLink href="/cover-letter" icon="📝" label="Cover Letter" desc="Generate tailored cover letters" />
              <DropLink href="/international" icon="🌍" label="International Formats" desc="EU, Canada, US, India formats" />
            </Dropdown>

            <Dropdown label="Resources">
              <DropLink href="/resume-templates" icon="🎨" label="Templates" desc="Browse professional resume themes" />
              <DropLink href="/resume-examples/software-engineer" icon="📄" label="Resume Examples" desc="See examples by role" />
              <DropLink href="/how-to" icon="📖" label="How-To Guide" desc="Step-by-step resume guide" />
              <DropLink href="/blog" icon="✍️" label="Blog" desc="Resume tips and career advice" />
            </Dropdown>

            <Link href="/about" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">About</Link>
          </nav>

          {/* CTA + Mobile menu */}
          <div className="flex items-center gap-3">
            <Link href="/analyze" className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md shadow-violet-500/20 hover:shadow-violet-500/30 transition-all">
              Get Started Free
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-1 border-t border-gray-100 dark:border-gray-800">
            <Link href="/build" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20">🆓 Free Builder</Link>
            <Link href="/analyze" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20">📈 Analyze Resume</Link>
            <Link href="/tailor" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20">✂️ Tailor to Job</Link>
            <Link href="/chat" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20">💬 AI Chat Builder</Link>
            <Link href="/cover-letter" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20">📝 Cover Letter</Link>
            <Link href="/international" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20">🌍 International Formats</Link>
            <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-2">
              <Link href="/resume-templates" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">Templates</Link>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">Blog</Link>
              <Link href="/how-to" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">How-To Guide</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">About</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">Contact</Link>
            </div>
            <div className="px-4 pt-2">
              <Link href="/analyze" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-md">
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
