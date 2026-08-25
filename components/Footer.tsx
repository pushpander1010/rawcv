import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-[17px] text-slate-900">raw<span className="text-blue-600">cv</span></span>
            </Link>
            <p className="text-[13.5px] text-slate-500 leading-relaxed max-w-xs">
              Free AI-powered resume builder with ATS scoring, job matching, and instant PDF downloads.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[13px] uppercase tracking-widest text-slate-900 mb-4">Tools</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/build", label: "Resume Builder" },
                { href: "/analyze", label: "ATS Analyzer" },
                { href: "/tailor", label: "Resume Tailor" },
                { href: "/chat", label: "AI Chat" },
                { href: "/cover-letter", label: "Cover Letter" },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-[14px] text-slate-500 hover:text-blue-600 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[13px] uppercase tracking-widest text-slate-900 mb-4">Resources</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/resume-templates", label: "Templates" },
                { href: "/resume-examples/software-engineer", label: "Examples" },
                { href: "/how-to", label: "How-To Guide" },
                { href: "/blog", label: "Blog" },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-[14px] text-slate-500 hover:text-blue-600 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[13px] uppercase tracking-widest text-slate-900 mb-4">Company</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-[14px] text-slate-500 hover:text-blue-600 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12.5px] text-slate-400">© {new Date().getFullYear()} rawcv. All rights reserved.</p>
          <p className="text-[12.5px] text-slate-400">Free AI resume tools for job seekers worldwide</p>
        </div>
      </div>
    </footer>
  );
}
