import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200/80 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">raw<span className="text-brand-600">cv</span></span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              Free AI-powered resume builder with ATS scoring, job matching, and instant PDF downloads.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-4">Tools</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/build", label: "Resume Builder" },
                { href: "/analyze", label: "ATS Analyzer" },
                { href: "/tailor", label: "Resume Tailor" },
                { href: "/chat", label: "AI Chat" },
                { href: "/cover-letter", label: "Cover Letter" },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-4">Resources</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/resume-templates", label: "Templates" },
                { href: "/resume-examples/software-engineer", label: "Examples" },
                { href: "/how-to", label: "How-To Guide" },
                { href: "/blog", label: "Blog" },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-4">Company</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200/80 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500">© {new Date().getFullYear()} rawcv. All rights reserved.</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Free AI resume tools for job seekers worldwide</p>
        </div>
      </div>
    </footer>
  );
}
