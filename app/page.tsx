import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { HeroCTA, FooterCTA, PricingCTA, FooterNav } from "@/components/LandingCTA";
import AuthRedirect from "@/components/AuthRedirect";
import { pricingPlans } from "@/data/pricing";

export const metadata: Metadata = {
  title: "rawcv — AI Resume Builder, ATS Score & Job Match Optimizer",
  description:
    "Free AI-powered resume platform. Upload your CV, get an ATS compatibility score, match it to any job description, enhance bullet points with AI, build cover letters, and download a polished PDF resume. Supports international resume formats for EU, Canada, US, and India.",
  alternates: { canonical: "https://www.rawcv.com" },
};

const features = [
  { icon: "📊", title: "ATS Score Analysis", description: "Instantly see how your resume scores against Applicant Tracking Systems with actionable fixes." },
  { icon: "🎯", title: "JD Relevance Match", description: "Paste any job description and get a relevance score with missing keywords and skills highlighted." },
  { icon: "✨", title: "AI Suggestions", description: "Get 3–15 targeted improvements covering action verbs, quantified achievements, and section completeness." },
  { icon: "🔧", title: "Resume Enhancement", description: "Strengthen weak bullet points and your summary with stronger language — no JD required." },
  { icon: "🎨", title: "Visual Themes", description: "Switch between 14 templates including Classic, Modern, Minimal, Executive, and Creative themes with a live preview." },
  { icon: "💬", title: "Chat to Build or Customize", description: "Build a resume from scratch or tweak any section conversationally with an AI chat interface." },
  { icon: "📝", title: "Cover Letter Builder", description: "Generate professional AI cover letters tailored to your resume and job description. Supports EU, Canada, and US formats." },
  { icon: "🌍", title: "International Resume Formats", description: "Choose from EU, Canada, US, and India-specific resume formats with region-appropriate sections and conventions." },
];

const faqs = [
  { q: "Is rawcv free to use?", a: "Yes — every new account gets 20 free credits. Free-tier AI models cost 0.5–1 credit per operation, so you can run many analyses before needing to top up." },
  { q: "What file formats are supported?", a: "rawcv accepts PDF, DOCX, and TXT files up to 5 MB." },
  { q: "How does ATS scoring work?", a: "We run rule-based checks (missing sections, keyword density, date formatting) combined with AI analysis to give you a score out of 100 with specific issues to fix." },
  { q: "Will my resume data be stored?", a: "Resume data is held in your browser session only. We do not permanently store your resume content on our servers." },
  { q: "Can I use rawcv on mobile?", a: "Yes — rawcv is fully responsive. The chat and analysis tools work on any device." },
  { q: "How does rawcv's ATS scoring work in detail?", a: "Our scanner runs over 100 rule-based checks covering section structure, keyword density, date formatting, contact info completeness, and file parseability, then layers an AI model to rate semantic relevance against common job families." },
  { q: "Can I download my resume as PDF?", a: "Yes — after analysis you can pick one of five visual themes and download a polished, ATS-safe PDF with a single click." },
  { q: "Is my resume data safe?", a: "Your resume data is only stored in your browser session. We do not permanently store your full resume content on our servers, and all AI processing is ephemeral." },
  { q: "What AI models does rawcv use?", a: "rawcv uses a mix of open-source and commercial models. Free-tier operations use efficient models, while Pro and Power plans unlock priority access to premium models for higher-quality suggestions." },
  { q: "How many resumes can I analyze with free credits?", a: "With 20 free credits and each basic analysis costing 0.5–1 credit, you can typically analyze 10 to 20 resumes or run 20+ JD matches before needing to top up." },
  { q: "Does rawcv support Indian resume formats?", a: "Absolutely — rawcv is built for Indian job seekers and supports common Indian resume formats including detailed experience sections, project listings, certifications, and technical skill tables." },
  { q: "Can I use rawcv for multiple job applications?", a: "Yes — each job application can be a separate analysis. Use the JD relevance tool with each new job description to tailor your resume without starting from scratch." },
  { q: "How long does a credit last?", a: "Credits never expire. Buy a pack and use them at your own pace — whether that's in one day or spread across several months." },
  { q: "What happens when I run out of credits?", a: "You can still view your dashboard and past analyses, but new AI operations will be blocked. Simply purchase a Starter, Pro, or Power pack to resume." },
  { q: "Can I cancel my subscription anytime?", a: "Yes — there are no long-term contracts. Your credits remain available even after cancelling any recurring plan." },
  { q: "Does rawcv work for freshers?", a: "Yes — freshers and students benefit the most. Upload your first CV, get ATS feedback on sections you may be missing, and use AI to strengthen project descriptions and internship entries." },
  { q: "How is rawcv different from Canva or Zety?", a: "Canva and Zety are design-first tools. rawcv focuses on ATS optimization and job-match analysis — it tells you exactly what keywords and sections are missing so you pass automated screening." },
  { q: "Can I upload a resume from my phone?", a: "Yes — the entire upload, analysis, chat, and download flow works on mobile browsers. No app download needed." },
  { q: "Do you offer bulk pricing for career coaches?", a: "Yes — the Power plan at ₹999 gives 500 credits, ideal for coaches managing multiple clients. Contact us for custom enterprise pricing if you need more." },
  { q: "Can I share my resume for review?", a: "You can download your polished PDF and share it directly. We are working on shareable review links that let others see your ATS score and suggestions without an account." },
  { q: "Does rawcv save my resume history?", a: "Your current session data is preserved in browser storage, so you can refresh the page without losing progress. Clearing browser data will reset your session." },
  { q: "Can I use rawcv without creating an account?", a: "A quick sign-up is required to receive your free credits and track usage. No credit card is needed for the free tier." },
  { q: "What kind of AI suggestions does rawcv provide?", a: "Suggestions range from replacing weak action verbs and adding quantified results to filling missing sections (summary, certifications) and rewording bullets to match job description language." },
  { q: "Does rawcv support languages other than English?", a: "The interface is in English, and the AI models are optimized for English-language resumes. We plan to expand to other languages based on user demand." },
  { q: "Can I edit my resume directly inside rawcv?", a: "Yes — the chat interface lets you modify any section conversationally, and the enhancement tool applies AI suggestions directly to your resume preview." },
  { q: "Does rawcv support international resume formats?", a: "Yes — rawcv supports resume formats for EU (Europass-compatible), Canada, US, and India. Each format adjusts section ordering, required fields, and cultural expectations for recruiters in that region. You can select your preferred format when building or enhancing your resume." },
  { q: "What is the EU resume format?", a: "The EU format follows Europass conventions with a clear reverse-chronological structure, personal information section, language proficiency levels (CEFR), and optional photo placement. It is widely accepted across EU member states." },
  { q: "What is the Canada resume format?", a: "The Canadian resume format emphasizes a professional summary, key achievements with quantifiable results, and excludes personal details like age, marital status, or photo. It typically runs 1-2 pages and follows strict anti-discrimination hiring norms." },
  { q: "What is the US resume format?", a: "The US resume format focuses on measurable achievements, action verbs, and is typically one page for early-to-mid career. It avoids personal information and uses a reverse-chronological structure optimized for both recruiters and ATS software." },
  { q: "Does rawcv have a cover letter builder?", a: "Yes — you can generate professional AI cover letters tailored to your resume and the specific job description. Choose from General, EU, Canada, and US format options, then edit, save, and export as PDF. The cover letter builder is included with your credits." },
];

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.rawcv.com/#website",
        "url": "https://www.rawcv.com",
        "name": "rawcv",
        "description": "AI-powered resume builder, ATS scorer, job match optimizer, and cover letter generator with international resume formats",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.rawcv.com/analyze",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.rawcv.com/#app",
        "name": "rawcv",
        "url": "https://www.rawcv.com",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": [
          { "@type": "Offer", "name": "Starter", "price": "99", "priceCurrency": "INR" },
          { "@type": "Offer", "name": "Pro", "price": "499", "priceCurrency": "INR" },
          { "@type": "Offer", "name": "Power", "price": "999", "priceCurrency": "INR" }
        ],
        "description": "Free AI-powered resume platform. Upload your CV, get an ATS compatibility score, match it to any job description, enhance bullet points with AI, build cover letters, and download a polished PDF resume. Supports international resume formats for EU, Canada, US, and India.",
        "screenshot": "https://www.rawcv.com/og-image.png",
        "featureList": [
          "ATS Score Analysis",
          "Job Description Relevance Match",
          "AI Resume Suggestions",
          "Resume Enhancement",
          "Visual Themes",
          "Chat-based Resume Building",
          "Cover Letter Builder",
          "International Resume Formats"
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://www.rawcv.com/#org",
        "name": "rawcv",
        "url": "https://www.rawcv.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.rawcv.com/logo.png",
          "width": 512,
          "height": 512
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <AuthRedirect />
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 px-6">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-br from-violet-200/60 via-blue-100/40 to-transparent dark:from-violet-900/30 dark:via-blue-900/20 blur-3xl" />
        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 uppercase">
              AI-Powered Resume Platform
            </span>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              Land more interviews
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-blue-500 text-violet-700 dark:text-violet-300">
                with a smarter resume
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 mb-10">
              Upload your CV, get an ATS score, match it to any job description, enhance it with AI,
              and download a polished PDF — all in minutes.
            </p>
            <div className="flex justify-center lg:justify-start">
              <HeroCTA />
            </div>
          </div>
          <div className="lg:col-span-5 relative w-full aspect-square max-w-[450px] mx-auto lg:max-w-none">
            {/* Stunning image frame with neon border and shadow */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-violet-100 dark:border-violet-800/50 bg-white dark:bg-gray-900 p-2 transform hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="/hero_illustration.png" 
                alt="rawcv AI Resume Builder Illustration" 
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hero resume mockup */}
      <section className="pb-16 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 h-6 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center px-3">
                <span className="text-xs text-gray-600">rawcv.com/analyze</span>
              </div>
            </div>
            {/* App UI mockup */}
            <div className="flex h-72 overflow-hidden">
              {/* Left panel — tools */}
              <div className="w-64 border-r border-gray-100 dark:border-gray-800 p-4 flex flex-col gap-3 bg-white dark:bg-gray-900">
                <div className="h-6 w-24 rounded-lg bg-violet-100 dark:bg-violet-900/40" />
                <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-4 w-5/6 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-4 w-4/6 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="mt-2 h-10 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-80" />
                <div className="mt-auto flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-emerald-600 text-lg">📊</span>
                  <div>
                    <div className="h-3 w-16 rounded bg-emerald-200 dark:bg-emerald-800 mb-1" />
                    <div className="text-xs font-bold text-emerald-600">ATS Score: 92</div>
                  </div>
                </div>
              </div>
              {/* Right panel — resume preview */}
              <div className="flex-1 p-5 bg-gray-50 dark:bg-gray-950 overflow-hidden">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 h-full">
                  {/* Resume header */}
                  <div className="border-b-2 border-gray-800 dark:border-gray-200 pb-3 mb-3">
                    <div className="h-5 w-40 rounded bg-gray-800 dark:bg-gray-200 mb-2" />
                    <div className="flex gap-3">
                      <div className="h-3 w-24 rounded bg-gray-300 dark:bg-gray-600" />
                      <div className="h-3 w-20 rounded bg-gray-300 dark:bg-gray-600" />
                      <div className="h-3 w-28 rounded bg-gray-300 dark:bg-gray-600" />
                    </div>
                  </div>
                  {/* Experience section */}
                  <div className="mb-3">
                    <div className="h-3 w-20 rounded bg-gray-400 dark:bg-gray-500 mb-2" />
                    <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700 mb-1" />
                    <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-700 mb-1" />
                    <div className="h-3 w-4/6 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  {/* Skills */}
                  <div className="flex gap-2 flex-wrap">
                    {["React", "TypeScript", "Node.js", "Python", "AWS"].map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-gray-600 mt-3">Live preview updates as you chat or apply suggestions</p>
        </div>
      </section>

      {/* ATS Check Section */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900/30 border-t border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative w-full aspect-square max-w-[450px] mx-auto lg:max-w-none order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-emerald-100 dark:border-emerald-800/50 bg-white dark:bg-gray-900 p-2 transform hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="/ats_illustration.png" 
                alt="rawcv ATS Scanner & Keyword Matcher" 
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7 text-center lg:text-left order-1 lg:order-2">
            <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 uppercase">
              ATS Score & JD Optimizer
            </span>
            <h2 className="text-4xl font-bold tracking-tight mb-6">
              Beat the bots with our
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 text-violet-700 dark:text-violet-300">
                ATS Compatibility Checker
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
              Our advanced scanning engine parses your resume and runs hundreds of checks. From section layout, contact details, date formatting, and keyword density to job description semantic matching.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              <div className="flex gap-3">
                <span className="text-emerald-600 dark:text-emerald-400 text-xl font-bold">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-950 dark:text-gray-100 text-sm">Targeted Keyword Density</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Automatically identifies and highlights crucial industry terms missing from your profile.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-600 dark:text-emerald-400 text-xl font-bold">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-950 dark:text-gray-100 text-sm">Semantic JD Matching</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Uses contextual AI models to match your experience details directly against the job requirements.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50" aria-labelledby="features-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="features-heading" className="text-3xl font-bold text-center mb-3">
            Everything you need to get hired
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            rawcv combines rule-based ATS checks with the best AI models so you always know exactly what to fix.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                <span className="text-3xl mb-4 block" aria-hidden="true">{f.icon}</span>
                <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6" aria-labelledby="how-heading">
        <div className="max-w-3xl mx-auto text-center">
          <h2 id="how-heading" className="text-3xl font-bold mb-12">Three steps to a better resume</h2>
          <ol className="flex flex-col sm:flex-row gap-8 text-left" itemScope itemType="https://schema.org/HowTo">
            {[
              { step: "1", title: "Upload your resume", body: "Drag and drop a PDF, DOCX, or TXT file. We parse it into structured data in seconds." },
              { step: "2", title: "Analyze & improve", body: "Run ATS scoring, paste a job description for relevance analysis, and apply AI suggestions." },
              { step: "3", title: "Download your PDF", body: "Pick a theme, accept the changes you like, and download a polished, ATS-safe PDF." },
            ].map((item) => (
              <li key={item.step} className="flex-1 flex gap-4" itemProp="step" itemScope itemType="https://schema.org/HowToStep">
                <span aria-hidden="true" className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold flex items-center justify-center shadow-md shadow-violet-500/10">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-semibold mb-1" itemProp="name">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed" itemProp="text">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Resume tips — replaces broken YouTube embed */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50" aria-labelledby="tips-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="tips-heading" className="text-3xl font-bold text-center mb-3">
            Quick resume tips that actually work
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            Small changes that move the needle on ATS scores and recruiter callbacks.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Mirror the job description",
                body: "Copy exact phrases from the job posting into your resume. ATS systems match keywords literally — synonyms don't count.",
              },
              {
                num: "02",
                title: "Quantify every bullet point",
                body: 'Replace "managed a team" with "managed a team of 8 engineers, reducing deploy time by 40%." Numbers stand out to both ATS and humans.',
              },
              {
                num: "03",
                title: "Use a single-column layout",
                body: "Multi-column resumes confuse most ATS parsers. A clean single-column format ensures every word gets read correctly.",
              },
              {
                num: "04",
                title: "Name your sections clearly",
                body: 'Use standard headings: "Work Experience", "Education", "Skills". Creative labels like "My Journey" are invisible to ATS.',
              },
              {
                num: "05",
                title: "Keep it to one or two pages",
                body: "Recruiters spend ~7 seconds on a first pass. One page for under 5 years of experience; two pages maximum for senior roles.",
              },
              {
                num: "06",
                title: "Save as PDF, not DOCX",
                body: "PDFs preserve your formatting across every system. DOCX files can reflow unpredictably depending on the recruiter's Word version.",
              },
            ].map((tip) => (
              <div
                key={tip.num}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
              >
                <span className="text-xs font-bold text-violet-500 tracking-widest mb-3 block">
                  {tip.num}
                </span>
                <h3 className="font-semibold text-base mb-2">{tip.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why rawcv — keyword-rich content for SEO */}
      <section className="py-20 px-6" aria-labelledby="why-heading">
        <div className="max-w-3xl mx-auto">
          <h2 id="why-heading" className="text-3xl font-bold text-center mb-10">Why use an AI resume builder?</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              Over <strong>75% of resumes are rejected by Applicant Tracking Systems (ATS)</strong> before a human ever reads them.
              ATS software scans for keywords, formatting, and section completeness — and most resumes fail silently.
              rawcv&apos;s free ATS resume checker gives you a score out of 100 with specific, actionable fixes so you know exactly what to change.
            </p>
            <p>
              A <strong>job description resume matcher</strong> is equally critical. Recruiters spend an average of 7 seconds on a resume.
              If your skills and experience don&apos;t mirror the language in the job posting, you&apos;re invisible.
              rawcv&apos;s JD relevance tool highlights missing keywords and suggests where to add them naturally.
            </p>
            <p>
              Our <strong>AI resume enhancer</strong> rewrites weak bullet points using strong action verbs and quantified achievements —
              the two things that most consistently improve callback rates. You stay in control: accept, reject, or tweak every suggestion.
            </p>
            <p>
              Whether you&apos;re a <strong>fresher building your first CV</strong>, a mid-career professional switching industries,
              or a career coach helping clients, rawcv gives you professional-grade tools for free.
              Start with 20 free credits — no credit card required.
            </p>
          </div>

        </div>
      </section>

      {/* Pricing */}      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50" aria-labelledby="pricing-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="pricing-heading" className="text-3xl font-bold text-center mb-3">Pay only for what you use</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            Credits are consumed per AI operation. Every new account starts with 20 free credits.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl p-6 border flex flex-col ${plan.highlight ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30 shadow-lg" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"}`}>
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold bg-violet-600 text-white">Most popular</span>
                )}
                <div className="mb-4">
                  <p className="font-semibold text-base">{plan.name}</p>
                  <p className="text-3xl font-extrabold mt-1">{plan.price}<span className="text-sm font-normal text-gray-600 ml-1">/ {plan.credits}</span></p>
                  <p className="text-xs text-gray-600 mt-0.5">{plan.priceUsd} USD</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.description}</p>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 text-violet-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <PricingCTA highlight={plan.highlight} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — structured data for Google */}
      <section className="py-20 px-6" aria-labelledby="faq-heading">
        <div className="max-w-2xl mx-auto">
          <h2 id="faq-heading" className="text-3xl font-bold text-center mb-10">Frequently asked questions</h2>
          <dl className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
            {faqs.map((faq) => (
              <div key={faq.q} itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
                <dt className="font-semibold text-gray-900 dark:text-gray-100 mb-1" itemProp="name">{faq.q}</dt>
                <dd className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                  <span itemProp="text">{faq.a}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* International Resume Formats — SEO internal links */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50" aria-labelledby="formats-heading">
        <div className="max-w-5xl mx-auto text-center">
          <h2 id="formats-heading" className="text-3xl font-bold mb-3">Resume formats for every country</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            Different countries have different rules for photos, personal details, page length, and section order. Choose the right format for your target market.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { href: "/international/us", icon: "🇺🇸", label: "US Format", desc: "1-page, achievement-first" },
              { href: "/international/eu", icon: "🇪🇺", label: "EU / Europass", desc: "Photo, CEFR levels, 3 pages" },
              { href: "/international/canada", icon: "🇨🇦", label: "Canada Format", desc: "No photo, anti-discrimination" },
              { href: "/resume-formats", icon: "🌍", label: "All Formats", desc: "8+ countries compared" },
            ].map((fmt) => (
              <Link
                key={fmt.href}
                href={fmt.href}
                className="group bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition-all"
              >
                <span className="text-3xl block mb-2">{fmt.icon}</span>
                <p className="font-semibold text-sm group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{fmt.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{fmt.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FooterCTA />

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span className="font-bold text-gray-700 dark:text-gray-300">rawcv</span>
          <FooterNav />
          <p>© {new Date().getFullYear()} rawcv. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
