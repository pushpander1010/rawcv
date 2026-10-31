import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Icon, { type IconName } from "@/components/Icon";
import HowToSchema from "@/components/HowToSchema";
import { renderThemeBody } from "@/lib/theme-renderer";
import { RESUME_CSS } from "@/lib/resume-styles";
import type { ParsedResume } from "@/types";

export const metadata: Metadata = {
  title: "rawcv — Free AI Resume Builder & ATS Score Checker",
  description:
    "Build, analyze, and optimize your resume with AI — 100% free. Get instant ATS scores, match resumes to job descriptions, and download polished PDFs. No signup required.",
  alternates: { canonical: "https://www.rawcv.com" },
};

const features: { icon: IconName; title: string; desc: string }[] = [
  { icon: "score", title: "ATS score", desc: "100+ rule-based checks, a score out of 100, and the exact fixes that matter." },
  { icon: "target", title: "Job match", desc: "Paste a job description and see which keywords and skills are missing." },
  { icon: "sparkles", title: "AI suggestions", desc: "Stronger action verbs, quantified results, and tighter section structure." },
  { icon: "trend", title: "Bullet rewrite", desc: "Turn weak duties into results-focused achievements in one click." },
  { icon: "layers", title: "17 themes", desc: "MAANG, editorial, Swiss, classic, sidebars, and region-specific formats." },
  { icon: "globe", title: "International", desc: "EU, Canada, US, and India formats with the right sections and conventions." },
];

const faqs = [
  { q: "Is rawcv really free?", a: "Yes — 100% free. ATS scoring, JD matching, AI suggestions, cover letters, and PDF downloads are all available without an account or payment." },
  { q: "What file formats are supported?", a: "rawcv accepts PDF, DOCX, and TXT files up to 5 MB." },
  { q: "How does ATS scoring work?", a: "We run 100+ rule-based checks (missing sections, keyword density, date formatting) combined with AI analysis to give you a score out of 100 with specific issues to fix." },
  { q: "Will my resume data be stored?", a: "No. Resume data stays in your browser session. We do not permanently store resume content on our servers." },
  { q: "Can I use rawcv on mobile?", a: "Yes — the builder, chat, analysis, and downloads all work on mobile browsers." },
  { q: "Do I need to create an account?", a: "No. Open the builder or upload a resume and start — no sign-up, no credit card." },
];

const designerSample: ParsedResume = {
  contact: {
    name: "Maya Chen",
    email: "maya@mayachen.design",
    phone: "+1 (415) 555-0198",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/mayachen",
    github: "github.com/mayachen",
    website: "mayachen.design",
  },
  summary:
    "Product designer with 7 years shaping consumer and fintech products. Built design systems used by 40+ engineers, led research that lifted activation 24%, and shipped work featured in Fast Company.",
  experience: [
    {
      company: "Stripe",
      title: "Staff Product Designer",
      startDate: "2022-02",
      endDate: "Present",
      bullets: [
        "Redesigned onboarding for 1.2M merchants, lifting completed setup by 24% in two quarters.",
        "Built the design system foundations now used by 40+ engineers across six product teams.",
        "Ran 60+ research sessions and turned findings into a quarterly roadmap adopted by leadership.",
      ],
    },
    {
      company: "Airbnb",
      title: "Senior Product Designer",
      startDate: "2018-06",
      endDate: "2022-01",
      bullets: [
        "Shipped a host analytics suite that increased repeat listings by 13%.",
        "Partnered with accessibility to bring core flows to WCAG 2.1 AA.",
      ],
    },
  ],
  education: [{ institution: "Rhode Island School of Design", degree: "BFA", field: "Graphic Design", graduationYear: "2017", gpa: "3.9/4.0", coursework: ["Typography", "Interaction Design", "Design Systems"] }],
  skills: ["Product strategy", "Interaction design", "Design systems", "Figma", "Prototyping", "User research", "Accessibility"],
  certifications: [],
  projects: [{ name: "Field Notes", description: "A free interview-notes template used by 12,000 designers.", technologies: ["Figma", "Notion"], link: "github.com/mayachen/field-notes", bullets: ["Reached 12,000 active designers and 4.8/5 rating"] }],
  awards: ["AIGA Design Scholar, 2017"],
  sectionOrder: ["summary", "experience", "projects", "education", "skills", "awards", "certifications"],
};

const engineerSample: ParsedResume = {
  contact: {
    name: "Aarav Mehta",
    email: "aarav.mehta@gmail.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    linkedin: "linkedin.com/in/aaravmehta",
    github: "github.com/aaravmehta",
    website: "aaravmehta.dev",
  },
  summary:
    "Senior frontend engineer with 8 years building high-traffic consumer products. Led platform migrations for 4M+ users, cut load times 62%, and mentored teams of six.",
  experience: [
    {
      company: "Razorpay",
      title: "Senior Frontend Engineer",
      startDate: "2021-04",
      endDate: "Present",
      bullets: [
        "Led a six-person team rebuilding the merchant dashboard in Next.js, cutting p95 load time from 4.8s to 1.8s.",
        "Designed a shared component library adopted by nine product squads, reducing UI build time 40%.",
        "Introduced performance budgets and CI checks, preventing 30+ regressions per quarter.",
      ],
    },
    {
      company: "Swiggy",
      title: "Frontend Engineer",
      startDate: "2018-06",
      endDate: "2021-03",
      bullets: [
        "Rewrote checkout and lifted conversion 12% across 2M weekly orders.",
        "Built A/B testing tooling used in 140 experiments, tripling experiment velocity.",
      ],
    },
  ],
  education: [{ institution: "BITS Pilani", degree: "B.E.", field: "Computer Science", graduationYear: "2018", gpa: "8.7/10", coursework: ["Data Structures", "Operating Systems", "DBMS", "Computer Networks"] }],
  skills: ["React", "TypeScript", "Next.js", "Node.js", "GraphQL", "PostgreSQL", "AWS", "Design systems", "Performance"],
  certifications: ["AWS Certified Solutions Architect – Associate"],
  projects: [{ name: "Atlas", description: "An accessible 40-component React library.", technologies: ["React", "TypeScript", "Storybook"], link: "github.com/aaravmehta/atlas", bullets: ["Reached 2.1k GitHub stars and 12k monthly installs", "Cut consumer bundle size 38% by removing the runtime CSS layer"] }],
  awards: ["AWS Certified Solutions Architect – Associate", "Top 5% in BITS ACM coding contest (2,000+ entrants)"],
  sectionOrder: ["summary", "experience", "projects", "education", "skills", "awards", "certifications"],
};

const managerSample: ParsedResume = {
  contact: {
    name: "Sofia Rossi",
    email: "sofia.rossi@pm.me",
    phone: "+44 7700 900123",
    location: "London, UK",
    linkedin: "linkedin.com/in/sofiarossi",
    github: "github.com/sofiarossi",
    website: "sofiarossi.co",
  },
  summary:
    "Product manager with 9 years taking B2B platforms from zero to scale. Led a payments product to £18M ARR, built a 14-person org, and shipped research-led roadmaps across three markets.",
  experience: [
    {
      company: "Monzo",
      title: "Director of Product",
      startDate: "2021-09",
      endDate: "Present",
      bullets: [
        "Grew business banking from £2M to £18M ARR in 30 months with a 14-person product org.",
        "Launched invoicing and VAT tools adopted by 38% of eligible business customers.",
        "Introduced discovery and pricing experiments that lifted trial-to-paid conversion 19%.",
      ],
    },
    {
      company: "Revolut",
      title: "Senior Product Manager",
      startDate: "2017-03",
      endDate: "2021-08",
      bullets: [
        "Led the cards platform across three markets, shipping eight releases per quarter.",
        "Built the first pricing model for premium tiers, adding £4.2M annual revenue.",
      ],
    },
  ],
  education: [{ institution: "London School of Economics", degree: "MSc", field: "Management", graduationYear: "2015", gpa: "Distinction", coursework: ["Corporate Finance", "Strategy", "Econometrics"] }],
  skills: ["Product strategy", "Pricing", "B2B SaaS", "Discovery", "Analytics", "Team leadership", "Fintech", "Roadmapping"],
  certifications: [],
  projects: [{ name: "Pricing Playbook", description: "An open B2B pricing teardown library.", technologies: ["Notion", "SQL"], link: "github.com/sofiarossi/pricing-playbook", bullets: ["Used by 3,000+ operators; featured in Lenny's Newsletter"] }],
  awards: ["Monzo CEO Award for Business Banking, 2023"],
  sectionOrder: ["summary", "experience", "projects", "education", "skills", "awards", "certifications"],
};

const maangSample: ParsedResume = {
  ...managerSample,
  summary: "",
  sectionOrder: ["education", "experience", "projects", "skills", "awards", "certifications"],
};

const showcase = [
  { theme: "editorial" as const, label: "Editorial", sample: designerSample },
  { theme: "atlas" as const, label: "Atlas", sample: engineerSample },
  { theme: "maang" as const, label: "MAANG", sample: maangSample },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <style dangerouslySetInnerHTML={{ __html: RESUME_CSS }} />
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://www.rawcv.com/#website",
                url: "https://www.rawcv.com",
                name: "rawcv",
                description: "Free AI-powered resume builder with ATS scoring, job matching, and PDF downloads.",
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://www.rawcv.com/#app",
                name: "rawcv",
                url: "https://www.rawcv.com",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
            ],
          }),
        }}
      />
      <HowToSchema
        name="How to use rawcv"
        description="Build, analyze, and optimize your resume in four steps."
        steps={[
          { name: "Upload your resume", text: "Upload your resume as a PDF, DOCX, or TXT file — no signup required." },
          { name: "Get your ATS score", text: "Get an instant ATS score out of 100 with specific fixes to pass applicant tracking systems." },
          { name: "Match a job description", text: "Paste any job description to see exactly which keywords and skills are missing." },
          { name: "Download a polished PDF", text: "Apply AI suggestions, choose a theme, and download a polished ATS-safe PDF." },
        ]}
      />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden px-4 sm:px-6 pt-14 sm:pt-20 pb-10 sm:pb-14">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(37,99,235,0.08),transparent_70%)] dark:bg-[radial-gradient(60%_100%_at_50%_0%,rgba(59,130,246,0.12),transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 px-3 py-1 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11.5px] font-semibold text-slate-600 dark:text-slate-300">
              Free forever · no account · no watermark
            </span>
          </div>

          <h1 className="text-[36px] sm:text-[54px] lg:text-[62px] font-bold tracking-[-0.035em] leading-[0.98] text-slate-900 dark:text-white">
            A resume that
            <br />
            <span className="font-serif italic font-normal text-blue-600">earns the interview.</span>
          </h1>

          <p className="mt-5 text-[15px] sm:text-[17px] text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Build a typeset, ATS-safe resume in minutes — then score it, match it to a job,
            and rewrite weak bullets with AI. All free.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link
              href="/build"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[14px] font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              Build my resume
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[14px] font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              Check my ATS score
            </Link>
          </div>

          <div className="mt-7 flex items-center justify-center gap-6 sm:gap-10 text-[11.5px] text-slate-400 dark:text-slate-500">
            <span><strong className="text-slate-700 dark:text-slate-200 font-semibold">100+</strong> ATS checks</span>
            <span className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
            <span><strong className="text-slate-700 dark:text-slate-200 font-semibold">17</strong> themes</span>
            <span className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
            <span><strong className="text-slate-700 dark:text-slate-200 font-semibold">$0</strong> forever</span>
          </div>
        </div>
      </section>

      {/* ═══════════ REAL RESUME SHOWCASE ═══════════ */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4 mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Actual output · three of seventeen themes
            </p>
            <Link href="/resume-templates" className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400">
              See all themes →
            </Link>
          </div>

          <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex min-w-max justify-center gap-4 sm:gap-6">
              {showcase.map(({ theme, label, sample }, i) => (
                <figure key={theme} className="shrink-0">
                  <div className="rounded-lg bg-white ring-1 ring-slate-900/10 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.35)] overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                    <div className="h-[392px] w-[278px] overflow-hidden">
                      <div
                        style={{ width: 794, height: 1123, transform: "scale(0.35)", transformOrigin: "top left" }}
                        dangerouslySetInnerHTML={{ __html: renderThemeBody(sample, theme) }}
                      />
                    </div>
                  </div>
                  <figcaption className="mt-2.5 flex items-center justify-between text-[11.5px]">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{label}</span>
                    <span className="text-slate-400 dark:text-slate-500">{i === 0 ? "Warm serif" : i === 1 ? "Swiss grid" : "Jake’s-style · ATS"}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
          <p className="text-center text-[12px] text-slate-400 dark:text-slate-500 mt-1">
            Typography, spacing, and page breaks are tuned to fit one clean A4 page.
          </p>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <div className="max-w-xl mb-9">
            <h2 className="text-[24px] sm:text-[30px] font-bold tracking-tight text-slate-900 dark:text-white">
              Everything you need to get hired.
            </h2>
            <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400">
              Professional-grade tools, no paywall in the middle of the flow.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7">
            {features.map((f) => (
              <div key={f.title} className="flex gap-3.5">
                <div className="w-9 h-9 shrink-0 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 flex items-center justify-center">
                  <Icon name={f.icon} size={16} />
                </div>
                <div>
                  <h3 className="text-[13.5px] font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <h2 className="text-[24px] sm:text-[30px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Three steps, one clean page.
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-slate-500 dark:text-slate-400">
                No onboarding wizard, no bloated dashboard. Write, preview, export.
              </p>
              <Link href="/build" className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Open the builder <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { step: "01", title: "Write or import", desc: "Start from a blank page or upload a PDF/DOCX at /analyze and edit the parsed sections." },
                { step: "02", title: "Tune the page", desc: "Switch themes, adjust type size and spacing, and watch a true A4 page update live." },
                { step: "03", title: "Export anywhere", desc: "Download a selectable-text PDF, an editable Word file, or plain text for job portals." },
              ].map((item) => (
                <div key={item.step} className="border-t-2 border-slate-900 dark:border-white pt-4">
                  <span className="text-[11px] font-bold tracking-[0.16em] text-slate-400 dark:text-slate-500">{item.step}</span>
                  <h3 className="mt-2 text-[14.5px] font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="px-4 sm:px-6 pb-14 sm:pb-20">
        <div className="max-w-5xl mx-auto rounded-2xl bg-slate-900 dark:bg-slate-900 overflow-hidden">
          <div className="px-6 sm:px-12 py-10 sm:py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-[24px] sm:text-[30px] font-bold text-white leading-tight tracking-tight">
                Ready to land more interviews?
              </h2>
              <p className="mt-2 text-[13.5px] text-slate-400 max-w-md">
                Upload a resume for instant AI analysis, or build a new one from scratch. Free, no account.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Link href="/build" className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-md bg-white text-slate-900 text-[13px] font-semibold hover:bg-slate-100 transition-colors">
                Build resume <span aria-hidden="true">→</span>
              </Link>
              <Link href="/analyze" className="inline-flex items-center justify-center h-10 px-5 rounded-md border border-white/20 text-white text-[13px] font-semibold hover:bg-white/10 transition-colors">
                Analyze a resume
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 px-4 sm:px-6 py-14 sm:py-16" id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Frequently asked questions
          </h2>
          <dl className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800" itemScope itemType="https://schema.org/FAQPage">
            {faqs.map((faq) => (
              <div key={faq.q} itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="py-4">
                <dt className="font-semibold text-[13.5px] text-slate-900 dark:text-white" itemProp="name">{faq.q}</dt>
                <dd className="mt-1 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                  <span itemProp="text">{faq.a}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
