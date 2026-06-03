import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Templates — 9 Professional Themes for Your CV | rawcv",
  description:
    "Explore 9 professionally designed resume templates: Classic, Modern, Minimal, Executive, Creative, Professional, Simple, Bold, and Elegant. Find the perfect ATS-friendly theme for your job search. Free to use.",
  alternates: { canonical: "https://www.rawcv.com/resume-templates" },
  openGraph: {
    title: "Resume Templates — 9 Professional Themes for Your CV | rawcv",
    description:
      "Explore 9 professionally designed resume templates: Classic, Modern, Minimal, Executive, Creative, Professional, Simple, Bold, and Elegant. ATS-friendly, AI-optimized, and free to use.",
    url: "https://www.rawcv.com/resume-templates",
  },
};

/* ── Template data ── */

interface ThemeInfo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  previewColors: string;
  previewClass: string;
  bestFor: string;
}

const themes: ThemeInfo[] = [
  {
    id: "classic",
    name: "Classic",
    tagline: "Timeless & Trusted",
    description:
      "A traditional two-column layout with serif headings and a clean, conservative structure. Ideal for finance, law, government, and academia where traditional formatting is expected.",
    features: [
      "Serif heading font (Lora)",
      "Two-column section layout",
      "Reverse-chronological experience",
      "Traditional date placement",
    ],
    previewColors: "from-amber-800 to-yellow-700",
    previewClass: "bg-gradient-to-br",
    bestFor: "Finance, Law, Government, Academia",
  },
  {
    id: "modern",
    name: "Modern",
    tagline: "Clean & Contemporary",
    description:
      "A sleek, single-column layout with sans-serif typography, ample whitespace, and subtle accent borders. Optimized for modern applicant tracking systems while maintaining visual appeal.",
    features: [
      "Sans-serif font (Inter)",
      "Single-column flow",
      "Skill-bar visual indicators",
      "Accent color section headers",
    ],
    previewColors: "from-violet-600 to-blue-500",
    previewClass: "bg-gradient-to-br",
    bestFor: "Tech, Startups, Marketing, Consulting",
  },
  {
    id: "minimal",
    name: "Minimal",
    tagline: "Less Is More",
    description:
      "A stripped-back, ultra-clean design with maximum whitespace and minimal visual ornamentation. Lets your content speak without distraction.",
    features: [
      "Maximal whitespace",
      "No decorative borders",
      "Compact experience lines",
      "Subtle thin separator lines",
    ],
    previewColors: "from-gray-400 to-gray-300",
    previewClass: "bg-gradient-to-br",
    bestFor: "Design, UX, Writing, Research",
  },
  {
    id: "executive",
    name: "Executive",
    tagline: "Command Authority",
    description:
      "A premium, high-impact layout designed for senior professionals and C-level executives. Features a bold top profile bar, achievement callouts, and strategic content hierarchy.",
    features: [
      "Bold top profile summary bar",
      "Achievement callout boxes",
      "Strategic content hierarchy",
      "Executive summary section",
    ],
    previewColors: "from-slate-900 to-slate-700",
    previewClass: "bg-gradient-to-br",
    bestFor: "C-Suite, Directors, Senior Management",
  },
  {
    id: "creative",
    name: "Creative",
    tagline: "Stand Out From the Crowd",
    description:
      "An expressive layout with accent colour blocks, icon-driven sections, and non-standard content arrangement. Built for roles where visual creativity is valued.",
    features: [
      "Colour block accents",
      "Icon-driven section headers",
      "Non-standard content arrangement",
      "Portfolio / project highlight area",
    ],
    previewColors: "from-pink-500 to-orange-400",
    previewClass: "bg-gradient-to-br",
    bestFor: "Graphic Design, Art Direction, Media, Advertising",
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Polished & Polished",
    description:
      "A versatile, mid-weight layout that balances visual polish with strict ATS compatibility. Understated elegance with clear content tiers and refined spacing.",
    features: [
      "Refined spacing tiers",
      "Understated accent elements",
      "Clear visual hierarchy",
      "ATS-optimised structure",
    ],
    previewColors: "from-blue-700 to-blue-500",
    previewClass: "bg-gradient-to-br",
    bestFor: "Engineering, Healthcare, Education, General Management",
  },
  {
    id: "simple",
    name: "Simple",
    tagline: "Straight to the Point",
    description:
      "A no-frills, one-column layout with the smallest possible file footprint. Everything is text-based with zero images or decorative elements for maximum ATS parseability.",
    features: [
      "Pure text — no icons or images",
      "One-column single pass",
      "Smallest file footprint",
      "Maximum ATS parseability",
    ],
    previewColors: "from-emerald-600 to-teal-500",
    previewClass: "bg-gradient-to-br",
    bestFor: "ATS-heavy screenings, Volume applications, Recent graduates",
  },
  {
    id: "bold",
    name: "Bold",
    tagline: "Make a Statement",
    description:
      "A high-contrast layout with oversized headings, strong colour blocks, and prominent call-to-action sections. Designed to grab a recruiter's attention within seconds.",
    features: [
      "Oversized headings (2x standard)",
      "High-contrast colour blocks",
      "Prominent CTA sections",
      "Large skill-highlight badges",
    ],
    previewColors: "from-red-600 to-rose-500",
    previewClass: "bg-gradient-to-br",
    bestFor: "Sales, Business Development, Entrepreneurship, Leadership roles",
  },
  {
    id: "elegant",
    name: "Elegant",
    tagline: "Refined Sophistication",
    description:
      "A refined, editorial-inspired layout that uses serif body text, subtle decorative rules, and a sophisticated colour palette of deep navy and gold accents.",
    features: [
      "Serif body text (Lora)",
      "Decorative rule dividers",
      "Navy + gold colour palette",
      "Editorial-inspired layout",
    ],
    previewColors: "from-indigo-900 to-indigo-600",
    previewClass: "bg-gradient-to-br",
    bestFor: "Luxury, Fashion, Hospitality, Publishing, PM roles",
  },
];

/* ── Card component ── */

function TemplateCard({ theme }: { theme: ThemeInfo }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Preview area */}
      <Link
        href={`/build?theme=${theme.id}`}
        className="block aspect-[4/3] relative overflow-hidden"
        aria-label={`Preview ${theme.name} template`}
      >
        <div
          className={`absolute inset-0 ${theme.previewClass} ${theme.previewColors} opacity-90`}
        />
        {/* Simulated template preview */}
        <div className="absolute inset-x-4 top-4 bottom-4 rounded-lg bg-white/90 dark:bg-gray-950/80 p-3 shadow-inner flex flex-col gap-1.5 text-[10px]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded-full bg-black/10 dark:bg-white/10" />
            <div className="h-2 w-16 rounded bg-gray-300 dark:bg-gray-700" />
          </div>
          <div className="h-1.5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-1.5 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-1 border-t border-gray-200 dark:border-gray-700 pt-1 space-y-1">
            <div className="flex gap-2">
              <div className="w-6 h-1 rounded bg-gray-300 dark:bg-gray-600" />
              <div className="flex-1 space-y-0.5">
                <div className="h-1 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-1 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
            <div className="h-1 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        {/* Theme name badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-bold text-gray-900 dark:text-white shadow-sm">
          {theme.name}
        </div>
      </Link>

      {/* Info area */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {theme.name}
            </h3>
            <p className="text-xs text-violet-600 dark:text-violet-400 font-semibold uppercase tracking-wide">
              {theme.tagline}
            </p>
          </div>
          <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
            FREE
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
          {theme.description}
        </p>

        {/* Features list */}
        <ul className="space-y-1 mb-3">
          {theme.features.map((f) => (
            <li
              key={f}
              className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
            >
              <span className="w-1 h-1 rounded-full bg-violet-500 flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-3">
          Best for:{" "}
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {theme.bestFor}
          </span>
        </p>

        <Link
          href={`/build?theme=${theme.id}`}
          className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold rounded-xl bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white transition-colors"
        >
          Use {theme.name} Template
        </Link>
      </div>
    </div>
  );
}

/* ── FAQ component ── */

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border-b border-gray-200 dark:border-gray-800 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-semibold text-gray-900 dark:text-gray-100 py-2 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
        {question}
        <span className="text-gray-400 dark:text-gray-500 group-open:rotate-45 transition-transform text-lg leading-none">
          +
        </span>
      </summary>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pt-1">
        {answer}
      </p>
    </details>
  );
}

/* ── Page ── */

export default function ResumeTemplatesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Resume Templates Gallery",
    description:
      "9 professionally designed resume templates — Classic, Modern, Minimal, Executive, Creative, Professional, Simple, Bold, and Elegant.",
    url: "https://www.rawcv.com/resume-templates",
    numberOfItems: themes.length,
    itemListElement: themes.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: `${t.name} Resume Template`,
        description: t.description,
        url: `https://www.rawcv.com/build?theme=${t.id}`,
      },
    })),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are your resume templates ATS-friendly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, every template at rawcv is designed with ATS parsing in mind. We avoid tables, columns that confuse parsers, embedded images, and non-standard fonts. Each template generates clean HTML that converts to text-based PDFs compatible with nearly all applicant tracking systems including Workday, Greenhouse, Lever, Taleo, and SAP SuccessFactors.",
        },
      },
      {
        "@type": "Question",
        name: "Can I switch templates after I start building my resume?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. You can switch between any of the 9 templates at any time without losing your content. Each template uses the same data model — your experience, education, skills, and custom sections are preserved and automatically reformatted to match the new theme's layout and styling.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need design skills to use these templates?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not at all. Our AI-powered builder handles all the formatting, spacing, and styling automatically. You simply fill in your content through a guided interface, and the template applies professional typography, consistent alignment, and proper hierarchy. Every template is pre-configured with optimal margins, font sizes, and spacing ratios.",
        },
      },
      {
        "@type": "Question",
        name: "How do I choose the right template for my industry?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Consider your industry norms and the role you are targeting. For traditional fields like finance, law, and academia, our Classic or Professional templates are safest. For tech and startups, Modern or Minimal work well. Creative roles benefit from the Creative template's expressive layout, while senior executives should choose Executive for its authority-focused structure. Each template card includes a 'Best for' recommendation.",
        },
      },
      {
        "@type": "Question",
        name: "Are the templates free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all 9 resume templates are free to use. You can build, preview, and switch between templates without any cost. Exporting your finished resume as a PDF uses credits — new users receive 20 free credits upon sign-up, which covers multiple exports. There are no hidden fees or subscription requirements for template access.",
        },
      },
    ],
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <Script
        id="resume-templates-collection-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="resume-templates-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-20">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden pt-20 pb-16 px-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-br from-violet-200/40 via-blue-100/20 to-transparent dark:from-violet-900/20 dark:via-blue-900/10 blur-3xl"
          />
          <div className="relative max-w-4xl mx-auto">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Resume Templates", href: "/resume-templates" },
              ]}
            />
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wide mb-4">
                Resume Templates
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
                9 Professional Resume Templates
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                Choose from 9 expertly crafted templates, each optimised for ATS
                compatibility and recruiter appeal. Preview, switch, and build
                your perfect resume in minutes — no design skills required.
              </p>
            </div>
            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span className="text-violet-500 font-bold">9</span> Templates
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span className="text-violet-500 font-bold">100%</span>{" "}
                ATS-Friendly
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span className="text-violet-500 font-bold">Free</span> to Use
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span className="text-violet-500 font-bold">AI</span> Optimized
              </div>
            </div>
          </div>
        </section>

        {/* ── Template Grid ── */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {themes.map((theme) => (
              <TemplateCard key={theme.id} theme={theme} />
            ))}
          </div>
        </section>

        {/* ── SEO Content Section ── */}
        <section className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="max-w-4xl mx-auto px-6 py-16 space-y-8 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Why the Right Resume Template Matters
            </h2>
            <p>
              Your resume template is the first impression you make on a
              recruiter or hiring manager. Studies show that recruiters spend an
              average of just 7.4 seconds scanning a resume before deciding
              whether to move forward. The layout, typography, spacing, and
              visual hierarchy of your chosen template directly influence that
              critical first impression. A well-designed template guides the
              reader's eye to your most important achievements, while a cluttered
              or poorly structured template can bury your strongest qualifications
              beneath visual noise.
            </p>
            <p>
              At rawcv, every template is built on a foundation of readability
              and ATS compatibility. Applicant Tracking Systems parse resumes
              into structured data before a human ever sees them. Templates with
              complex tables, text boxes, graphics, or non-standard section
              headings frequently break during parsing, resulting in garbled or
              incomplete data reaching the recruiter. Our templates use clean,
              semantic HTML that produces text-based PDFs parsers handle
              reliably. We test each template against major ATS platforms
              including Workday, Greenhouse, Lever, Taleo, iCIMS, and SAP
              SuccessFactors.
            </p>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Choosing the Right Template for Your Career Stage
            </h3>
            <p>
              Early-career professionals and recent graduates often benefit from
              the Simple or Minimal templates, which keep the focus on education,
              internships, and transferable skills without excessive formatting.
              Mid-career professionals with 5-15 years of experience typically
              find the Modern, Professional, or Classic templates strike the right
              balance between showcasing a growing list of accomplishments and
              maintaining concise scannability. Senior executives and
              C-suite candidates should consider the Executive or Bold templates,
              which provide dedicated space for strategic achievements, board
              memberships, and high-level impact statements.
            </p>
            <p>
              Industry norms also play a significant role. Creative industries
              such as graphic design, advertising, and media welcome expressive
              layouts and the Creative template is designed specifically for these
              fields. Technology, startups, and consulting firms tend to prefer
              clean, modern aesthetics — the Modern and Minimal templates perform
              well here. Traditional sectors like finance, law, and government
              still favour conservative layouts, making Classic, Professional, and
              Elegant the safest choices. When in doubt, the Professional template
              is a universally safe option that works across industries without
              appearing either too flashy or too plain.
            </p>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Template Features That Boost Your Chances
            </h3>
            <p>
              Beyond aesthetics, certain template features directly impact your
              interview callback rate. Clear content hierarchy — achieved through
              distinct heading sizes, consistent spacing, and strategic use of
              bold text — helps recruiters quickly locate your current role,
              key achievements, and education. Reverse-chronological experience
              ordering remains the gold standard and all our templates follow this
              convention. Skill highlight sections, achievement callout boxes, and
              summary profiles give you dedicated spaces to emphasise your
              strongest selling points, and each template positions these elements
              differently to suit various narrative strategies.
            </p>
            <p>
              All 9 templates are available immediately, free of charge. You can
              preview, select, and switch between templates at any point during
              the building process without losing your content. Our AI-powered
              builder also provides real-time suggestions for bullet point
              improvement, skill gap analysis, and job description alignment —
              but the template you choose is entirely up to you. Explore the
              gallery above, preview the themes, and start building your best
              resume today.
            </p>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section className="max-w-3xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Everything you need to know about our resume templates.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <FAQ
              question="Are your resume templates ATS-friendly?"
              answer="Yes, every template at rawcv is designed with ATS parsing in mind. We avoid tables, columns that confuse parsers, embedded images, and non-standard fonts. Each template generates clean HTML that converts to text-based PDFs compatible with nearly all applicant tracking systems including Workday, Greenhouse, Lever, Taleo, and SAP SuccessFactors."
            />
            <FAQ
              question="Can I switch templates after I start building my resume?"
              answer="Absolutely. You can switch between any of the 9 templates at any time without losing your content. Each template uses the same data model — your experience, education, skills, and custom sections are preserved and automatically reformatted to match the new theme's layout and styling."
            />
            <FAQ
              question="Do I need design skills to use these templates?"
              answer="Not at all. Our AI-powered builder handles all the formatting, spacing, and styling automatically. You simply fill in your content through a guided interface, and the template applies professional typography, consistent alignment, and proper hierarchy. Every template is pre-configured with optimal margins, font sizes, and spacing ratios."
            />
            <FAQ
              question="How do I choose the right template for my industry?"
              answer="Consider your industry norms and the role you are targeting. For traditional fields like finance, law, and academia, our Classic or Professional templates are safest. For tech and startups, Modern or Minimal work well. Creative roles benefit from the Creative template's expressive layout, while senior executives should choose Executive for its authority-focused structure. Each template card includes a 'Best for' recommendation."
            />
            <FAQ
              question="Are the templates free to use?"
              answer="Yes, all 9 resume templates are free to use. You can build, preview, and switch between templates without any cost. Exporting your finished resume as a PDF uses credits — new users receive 20 free credits upon sign-up, which covers multiple exports. There are no hidden fees or subscription requirements for template access."
            />
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-3xl mx-auto px-6 text-center">
          <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-10 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Start Building Your Resume
            </h2>
            <p className="text-violet-100 text-sm mb-6 max-w-lg mx-auto">
              Pick a template, add your details, and let AI optimise every
              section. Free to start — no credit card required.
            </p>
            <Link
              href="/build"
              className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold rounded-xl bg-white text-violet-700 hover:bg-violet-50 transition-colors shadow-lg"
            >
              Build Your Resume Now
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}