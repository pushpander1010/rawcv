import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";
import type { ParsedResume, ThemeId } from "@/types";
import { renderThemeBody } from "@/lib/theme-renderer";
import { RESUME_CSS } from "@/lib/resume-styles";

export const metadata: Metadata = {
  title: "Resume Templates — 17 Professional, ATS-Safe Designs | rawcv",
  description:
    "Explore 17 free resume templates — MAANG, Classic, Minimal, Modern, Executive, Atlas, Editorial, Europass, Canadian and more. ATS-safe, typeset for one clean page, and free to download.",
  alternates: { canonical: "https://www.rawcv.com/resume-templates" },
  openGraph: {
    title: "Resume Templates — 17 Professional, ATS-Safe Designs | rawcv",
    description:
      "17 free resume templates, typeset for one clean A4 page. ATS-safe, no watermark, no signup.",
    url: "https://www.rawcv.com/resume-templates",
  },
};

const THEMES: Array<{
  id: ThemeId;
  name: string;
  tagline: string;
  bestFor: string;
}> = [
  { id: "maang", name: "MAANG", tagline: "Dense, plain, ATS-first", bestFor: "Google, Amazon, Meta, Apple, Netflix" },
  { id: "atlas", name: "Atlas", tagline: "Swiss precision", bestFor: "Tech, product, consulting" },
  { id: "editorial", name: "Editorial", tagline: "Warm magazine", bestFor: "Design, writing, creative leads" },
  { id: "classic", name: "Classic", tagline: "Timeless serif", bestFor: "Finance, law, academia" },
  { id: "minimal", name: "Minimal", tagline: "Quiet and airy", bestFor: "Design, research, any industry" },
  { id: "modern", name: "Modern", tagline: "Dark sidebar", bestFor: "Startups, engineering, marketing" },
  { id: "executive", name: "Executive", tagline: "Senior authority", bestFor: "Directors, VPs, C-suite" },
  { id: "navy", name: "Navy", tagline: "Navy + gold", bestFor: "Finance, consulting, management" },
  { id: "creative", name: "Creative", tagline: "Violet timeline", bestFor: "Brand, media, art direction" },
  { id: "enhancv", name: "Enhancv", tagline: "Blue, two column", bestFor: "Product, engineering, growth" },
  { id: "terra", name: "Terra", tagline: "Warm serif", bestFor: "Education, hospitality, publishing" },
  { id: "sharp", name: "Sharp", tagline: "Mono, high contrast", bestFor: "Engineering, data, architecture" },
  { id: "resumeio", name: "Resume.io", tagline: "Soft and friendly", bestFor: "General, early career" },
  { id: "zety", name: "Zety", tagline: "Slate sidebar", bestFor: "Operations, sales, project leads" },
  { id: "fotoram", name: "Fotoram", tagline: "Photo header", bestFor: "Creative, EU markets" },
  { id: "europass", name: "Europass", tagline: "EU format", bestFor: "Europe, public sector, academia" },
  { id: "canadian", name: "Canadian", tagline: "Clean, no photo", bestFor: "Canada, US, conservative fields" },
];

const SAMPLE: ParsedResume = {
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
  projects: [
    {
      name: "Atlas — open-source design system",
      description: "A 40-component accessible React library.",
      technologies: ["React", "TypeScript", "Storybook"],
      link: "github.com/aaravmehta/atlas",
      bullets: ["Reached 2.1k GitHub stars and 12k monthly installs", "Cut consumer bundle size 38% by removing the runtime CSS layer"],
    },
  ],
  awards: ["AWS Certified Solutions Architect – Associate", "Top 5% in BITS ACM coding contest (2,000+ entrants)"],
  sectionOrder: ["summary", "experience", "projects", "education", "skills", "awards", "certifications"],
};

const MAANG_SAMPLE: ParsedResume = {
  ...SAMPLE,
  summary: "",
  sectionOrder: ["education", "experience", "projects", "skills", "awards", "certifications"],
};

const FAQS = [
  {
    q: "Are these templates really free?",
    a: "Yes. Every template, the live preview, and PDF, Word, and text export are free — no watermark, no account, no credits.",
  },
  {
    q: "Are the templates ATS-friendly?",
    a: "Yes. Each design avoids tables, text boxes, and image-based text, exports as selectable text, and normalises dates. We test them against Workday, Greenhouse, Lever, and Taleo parsing.",
  },
  {
    q: "Can I switch templates after I start?",
    a: "Any time. Your content is stored separately from the design, so switching reflows the same resume into a new layout without retyping anything.",
  },
  {
    q: "Which template should I choose?",
    a: "Classic, Minimal, and Canadian are the safest for conservative fields. Atlas and Modern suit tech and product. Editorial, Terra, and Creative are for design-led roles. Europass is built for European applications.",
  },
  {
    q: "Can I change the font and spacing?",
    a: "Yes. Open the builder and use the Text panel to choose a typeface, body size, and line height. The A4 page and the PDF update together.",
  },
];

export default function ResumeTemplatesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Resume Templates",
    description:
      "17 free, ATS-safe resume templates. Typeset for one clean A4 page, with instant PDF download.",
    url: "https://www.rawcv.com/resume-templates",
    numberOfItems: THEMES.length,
    itemListElement: THEMES.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: `${t.name} Resume Template`,
        description: `${t.name} — ${t.tagline}. Best for ${t.bestFor}.`,
        url: `https://www.rawcv.com/build?theme=${t.id}`,
      },
    })),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: RESUME_CSS }} />
      <Script id="resume-templates-collection-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Script id="resume-templates-faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
        {/* Hero */}
        <section className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Resume templates", href: "/resume-templates" }]} />
            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 mb-3">
                  The gallery
                </p>
                <h1 className="text-[32px] sm:text-[44px] font-bold tracking-[-0.03em] leading-[1.05]">
                  17 templates.
                  <br />
                  <span className="font-serif italic font-normal text-blue-600">One clean page.</span>
                </h1>
                <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                  Every design is typeset for A4, tested for ATS parsing, and free to export.
                  Pick one, swap the content, and download a PDF in minutes.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-slate-500 dark:text-slate-400 lg:pb-1">
                <span><strong className="text-slate-900 dark:text-white font-semibold">17</strong> designs</span>
                <span><strong className="text-slate-900 dark:text-white font-semibold">100%</strong> ATS-safe</span>
                <span><strong className="text-slate-900 dark:text-white font-semibold">$0</strong> forever</span>
              </div>
            </div>
          </div>
        </section>


        {/* Featured: MAANG */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10">
          <div className="overflow-hidden rounded-2xl bg-slate-900 text-white">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-center p-6 sm:p-10">
              <div className="max-w-xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
                  Featured · Big-tech layout
                </p>
                <h2 className="text-[26px] sm:text-[32px] font-bold tracking-[-0.025em] leading-[1.05]">
                  MAANG — the resume that gets selected.
                </h2>
                <p className="mt-3 text-[13.5px] leading-relaxed text-slate-300">
                  Modelled on the format behind big-tech callbacks: the Jake’s Resume lineage used
                  for Google, Amazon, Meta, Apple, and Netflix screens. One column, serif type,
                  centered contact, ruled headings, Education/Experience/Projects/Skills — and a
                  full page of measurable work.
                </p>
                <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[12px] text-slate-300">
                  <li>Education first for students &amp; new grads</li>
                  <li>GPA and relevant coursework</li>
                  <li>GitHub plus project links</li>
                  <li>2–4 X-Y-Z bullets per role</li>
                  <li>Serif, single column, one page</li>
                  <li>No photo, color, or decoration</li>
                </ul>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    href="/build?theme=maang"
                    className="inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2.5 text-[12.5px] font-semibold text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    Build with MAANG <span aria-hidden="true">→</span>
                  </Link>
                  <span className="text-[11.5px] text-slate-500">Free · no account · no watermark</span>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[320px]">
                <div className="overflow-hidden rounded-lg bg-white ring-1 ring-white/15 shadow-2xl">
                  <div className="flex h-[360px] justify-center overflow-hidden">
                    <div
                      className="shrink-0"
                      style={{ width: 794, height: 1123, transform: "scale(0.38)", transformOrigin: "top center" }}
                      dangerouslySetInnerHTML={{ __html: renderThemeBody(MAANG_SAMPLE, "maang") }}
                    />
                  </div>
                </div>
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-900 shadow-lg">
                  MAANG
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {THEMES.filter((theme) => theme.id !== "maang").map((theme) => (
              <div
                key={theme.id}
                className="group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.4)] transition-all duration-200"
              >
                <Link
                  href={`/build?theme=${theme.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`Use the ${theme.name} resume template`}
                />
                <div className="relative h-[300px] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <div className="absolute left-1/2 top-4 -translate-x-1/2">
                    <div
                      style={{
                        width: 794,
                        height: 1123,
                        transform: "scale(0.36)",
                        transformOrigin: "top center",
                      }}
                      dangerouslySetInnerHTML={{ __html: renderThemeBody(SAMPLE, theme.id) }}
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-100 dark:from-slate-800 to-transparent" />
                </div>
                <div className="flex items-center justify-between gap-2 px-3.5 py-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">{theme.name}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{theme.tagline}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 transition-colors">
                    Use →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Guidance */}
        <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="max-w-2xl">
              <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight">How to choose</h2>
              <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400">
                Format should signal fit, not fight the parser. When in doubt, choose the quieter design.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { k: "Conservative", t: "Classic · Minimal · Canadian", d: "Finance, law, government, healthcare, and academia. Single column, serif or quiet sans, zero ornament." },
                { k: "Modern", t: "MAANG · Atlas · Modern · Editorial", d: "Tech, product, design, and consulting. MAANG is the plain, dense, ATS-first layout used in big-tech hiring." },
                { k: "Regional", t: "Europass · Canadian", d: "Europe expects languages and sometimes a photo; Canada expects no photo and no personal details." },
              ].map((g) => (
                <div key={g.k} className="border-t-2 border-slate-900 dark:border-white pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">{g.k}</p>
                  <p className="mt-2 text-[14px] font-semibold text-slate-900 dark:text-white">{g.t}</p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500 dark:text-slate-400">{g.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight mb-6">Template questions</h2>
          <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
            {FAQS.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                  <span className="text-[13.5px] font-semibold text-slate-900 dark:text-white">{f.q}</span>
                  <span className="text-slate-400 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="pb-4 pr-8 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-slate-900 px-6 py-6">
            <div>
              <p className="text-[15px] font-semibold text-white">Pick a template and start writing.</p>
              <p className="text-[12.5px] text-slate-400 mt-0.5">Free PDF, Word, and text export. No account.</p>
            </div>
            <Link href="/build" className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2 text-[12.5px] font-semibold text-slate-900 hover:bg-slate-100 transition-colors">
              Open the builder <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
