import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200/60 dark:border-gray-800/60 bg-white/30 dark:bg-gray-950/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M4 4h16v16H4V4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 8h8M8 12h6M8 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-black text-lg text-gray-900 dark:text-white">raw<span className="text-violet-600">cv</span></span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Free AI-powered resume builder with ATS scoring, job matching, and instant PDF downloads.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-4">Tools</h3>
            <ul className="space-y-3">
              {[
                { href: "/build", label: "Resume Builder" },
                { href: "/analyze", label: "ATS Analyzer" },
                { href: "/tailor", label: "Resume Tailor" },
                { href: "/chat", label: "AI Chat" },
                { href: "/cover-letter", label: "Cover Letter" },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-4">Resources</h3>
            <ul className="space-y-3">
              {[
                { href: "/resume-templates", label: "Templates" },
                { href: "/resume-examples/software-engineer", label: "Examples" },
                { href: "/how-to", label: "How-To Guide" },
                { href: "/blog", label: "Blog" },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-4">Company</h3>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200/60 dark:border-gray-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">© {new Date().getFullYear()} rawcv. All rights reserved.</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Free AI resume tools for job seekers worldwide</p>
        </div>
      </div>
    </footer>
  );
}
