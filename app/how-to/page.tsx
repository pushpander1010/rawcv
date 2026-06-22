import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Use rawcv — AI Resume Builder Guide",
  description: "Step-by-step guide to building, analyzing, and optimizing your resume with rawcv. Learn ATS scoring, JD matching, AI suggestions, and PDF download.",
  alternates: { canonical: "https://www.rawcv.com/how-to" },
};

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5 mb-10">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-600 text-white text-sm font-bold flex items-center justify-center mt-0.5">
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-3">{children}</div>
      </div>
    </div>
  );
}

function Callout({ type = "tip", children }: { type?: "tip" | "note" | "warning"; children: React.ReactNode }) {
  const styles = {
    tip:     "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300",
    note:    "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300",
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300",
  };
  const icons = { tip: "Tip", note: "Note", warning: "Warning" };
  return (
    <div className={`flex gap-3 rounded-xl border px-4 py-3 text-sm ${styles[type]}`}>
      <span className="flex-shrink-0 font-semibold mt-0.5">{icons[type]}:</span>
      <div>{children}</div>
    </div>
  );
}

function DocSection({ id, badge, title, subtitle, children }: {
  id: string; badge: string; title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 mb-20">
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-block px-2.5 py-1 rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wide">
          {badge}
        </span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">{subtitle}</p>
      <div className="border-t border-gray-100 dark:border-gray-800 pt-8">{children}</div>
    </section>
  );
}

const TOC = [
  { id: "getting-started", label: "Getting started" },
  { id: "upload-resume",   label: "Upload a resume" },
  { id: "build-resume",    label: "Build from scratch" },
  { id: "ats-score",       label: "ATS score check" },
  { id: "ai-suggestions",  label: "AI suggestions" },
  { id: "enhance",         label: "Enhance resume" },
  { id: "jd-relevance",    label: "JD relevance check" },
  { id: "tailor",          label: "Tailor to a job" },
  { id: "themes",          label: "Themes and download" },
  { id: "credits",         label: "Credits and pricing" },
  { id: "faq",             label: "FAQ" },
];

export default function HowToPage() {
  const jsonLd = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to use rawcv - AI Resume Builder",
      "description": "Step-by-step guide to building, analyzing, and optimizing your resume with rawcv. Learn ATS scoring, JD matching, AI suggestions, and PDF download.",
      "url": "https://www.rawcv.com/how-to",
      "totalTime": "PT15M",
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": "0"
      },
      "supply": ["20 free credits on signup"],
      "tool": ["Web browser", "Resume file (PDF/DOCX/TXT)"],
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Create a free account",
          "text": "Go to rawcv.com/register and sign up with your email address. Once registered you receive 20 free credits instantly. Credits are consumed per AI operation so you can run several analyses before needing to top up."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Upload or build your resume",
          "text": "Drag and drop a PDF, DOCX, or TXT file onto the upload zone, or use the AI Chat tool to build a resume section by section through a conversation. Supported formats: .pdf, .docx, .txt up to 5 MB."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Run ATS analysis",
          "text": "Go to the Analyze page and click the ATS Score tab. Click Run ATS Analysis to get a score out of 100 with specific issues grouped into Critical, Warnings, and Suggestions categories."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Get AI suggestions",
          "text": "Open the Suggestions tab on the Analyze page and click Get AI Suggestions. The AI reads your entire resume and generates 3-15 targeted improvements covering action verbs, quantified achievements, and section completeness."
        },
        {
          "@type": "HowToStep",
          "position": 5,
          "name": "Enhance your resume",
          "text": "Open the Enhance tab on the Analyze page and click Enhance Resume. The AI rewrites your bullet points and summary with stronger action verbs and more professional tone while keeping your facts intact."
        },
        {
          "@type": "HowToStep",
          "position": 6,
          "name": "Match to a job description",
          "text": "Open the JD Match tab on the Analyze page. Paste the full job description and click Analyze Relevance. You will see a relevance score out of 100 along with missing keywords and skills."
        },
        {
          "@type": "HowToStep",
          "position": 7,
          "name": "Tailor your resume to a job",
          "text": "Go to the Tailor page, paste the job description, and click Tailor Resume. The AI rewrites multiple sections to incorporate the right keywords and reframe your experience in the employer's language. Review a diff view showing every change."
        },
        {
          "@type": "HowToStep",
          "position": 8,
          "name": "Choose a theme and download PDF",
          "text": "Open the Theme tab on the Analyze page and pick from 8 professionally designed themes including Classic, Modern, Minimal, Executive, Creative, Navy, Sharp, and Terra. Each previews in real time. Click Download PDF — PDF downloads are free and do not consume credits."
        }
      ]
    };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Script id="how-to-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "How to use rawcv", href: "/how-to" }]} />
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-violet-50 dark:from-violet-950/30 to-white dark:to-gray-950 border-b border-gray-100 dark:border-gray-800 px-6 py-16">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-br from-violet-200/40 via-blue-100/20 to-transparent dark:from-violet-900/20 dark:via-blue-900/10 blur-3xl" />
        <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 text-center md:text-left space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 uppercase tracking-wide">
              Documentation
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 leading-tight">How to use rawcv</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto md:mx-0 text-lg">
              Everything you need to go from a blank page to a polished, ATS-optimized resume.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
              <Link href="/register" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:-translate-y-0.5 transition-all duration-200">
                Get started free
              </Link>
              <Link href="#getting-started" className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200">
                Read the guide
              </Link>
            </div>
          </div>
          <div className="md:col-span-4 hidden md:block">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-violet-100 dark:border-violet-900/40 bg-white dark:bg-gray-900 p-1.5 transform hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="/resume_guide_illustration.png" 
                alt="rawcv Builder Guide Illustration" 
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 flex gap-12">

        {/* Sticky sidebar TOC */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-4">On this page</p>
            <nav aria-label="Table of contents">
              <ul className="space-y-1">
                {TOC.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-8 p-4 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900">
              <p className="text-xs text-violet-700 dark:text-violet-300 font-medium mb-1">Need help?</p>
              <a href="mailto:support@rawcv.com" className="text-xs text-violet-600 dark:text-violet-400 underline hover:no-underline">
                support@rawcv.com
              </a>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">

          {/* GETTING STARTED */}
          <DocSection id="getting-started" badge="Start here" title="Getting started" subtitle="Create your free account and understand how rawcv works before you dive in.">

            <Step number={1} title="Create a free account">
              <p>Go to <Link href="/register" className="text-violet-600 hover:underline font-medium">rawcv.com/register</Link> and sign up with your email address. No credit card required.</p>
              <p>Once registered you receive <strong className="text-gray-800 dark:text-gray-200">20 free credits</strong> instantly. Credits are consumed per AI operation so you can run several analyses before needing to top up.</p>
              <img src="/register_screen.jpg" alt="Registration page showing email and password fields with Sign up button" className="w-full rounded-2xl my-6 border border-gray-200 dark:border-gray-700" />
            </Step>

            <Step number={2} title="Understand the credit system">
              <p>rawcv uses a credit-based model so you only pay for what you use. Here is what each action costs:</p>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="text-left px-4 py-2 font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Action</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Credits used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Parse / upload resume",     "0.5 - 1"],
                      ["ATS score analysis",        "1"],
                      ["JD relevance check",        "1"],
                      ["AI suggestions",            "1 - 2"],
                      ["Resume enhancement",        "1 - 2"],
                      ["Tailor resume to JD",       "2"],
                      ["Chat message (build/edit)", "0.5 - 1"],
                      ["PDF download",              "Free"],
                    ].map(([action, cost]) => (
                      <tr key={action} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">{action}</td>
                        <td className="px-4 py-2 border border-gray-200 dark:border-gray-700 font-medium text-violet-600 dark:text-violet-400">{cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Callout type="tip">Your current credit balance is always visible in the top-right corner of the header. Click it to go to the credits page and top up.</Callout>
            </Step>

            <Step number={3} title="Navigate the app">
              <p>The top navigation bar gives you access to all tools:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong className="text-gray-800 dark:text-gray-200">Dashboard</strong> - overview of your resume and quick actions</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Analyze</strong> - ATS score, JD match, AI suggestions, enhancement, and theme picker</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Tailor</strong> - rewrite your resume for a specific job description</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Chat</strong> - build or edit your resume conversationally with AI</li>
              </ul>
              <img src="/navigation_screen.jpg" alt="Top navigation bar showing Dashboard, Analyze, Tailor, Chat, How to links and credit balance badge" className="w-full rounded-2xl my-6 border border-gray-200 dark:border-gray-700" />
            </Step>
          </DocSection>


          {/* UPLOAD RESUME */}
          <DocSection id="upload-resume" badge="Step 1" title="Upload a resume" subtitle="The fastest way to get started - upload your existing PDF or DOCX and rawcv parses it instantly.">

            <Step number={1} title="Go to the home page or dashboard">
              <p>From the home page, scroll to the upload area in the hero section. If you are already logged in, the uploader appears immediately after the welcome message.</p>
              <img src="/resume_upload_screen.jpg" alt="Home page hero with drag-and-drop upload zone" className="w-full rounded-2xl my-6 border border-gray-200 dark:border-gray-700" />
            </Step>

            <Step number={2} title="Drag and drop or click to browse">
              <p>Drag your resume file directly onto the upload zone, or click <strong className="text-gray-800 dark:text-gray-200">Browse files</strong> to open a file picker.</p>
              <p>Supported formats: <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">.pdf</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">.docx</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">.txt</code> up to <strong className="text-gray-800 dark:text-gray-200">5 MB</strong>.</p>
              <Callout type="tip">For best parsing results use a single-column PDF without tables or text boxes. Multi-column layouts can confuse the parser.</Callout>
            </Step>

            <Step number={3} title="Wait for parsing to complete">
              <p>rawcv extracts your contact info, work experience, education, skills, and summary automatically. This takes 3-10 seconds depending on file complexity.</p>
            </Step>

            <Step number={4} title="Review the parsed resume">
              <p>Once parsed you are redirected to the <strong className="text-gray-800 dark:text-gray-200">Analyze</strong> page. The right panel shows a live preview of your resume rendered in the selected theme.</p>
              <p>Check that your name, contact details, and work history look correct. If anything is missing or wrong, use the Chat tool to fix it.</p>
              <Callout type="note">rawcv does not permanently store your resume content. Data lives in your browser session. If you refresh or close the tab you will need to re-upload.</Callout>
            </Step>

          </DocSection>


          {/* BUILD FROM SCRATCH */}
          <DocSection id="build-resume" badge="Step 1 alt" title="Build a resume from scratch" subtitle="No existing resume? Use the AI chat interface to build one section by section through a conversation.">

            <Step number={1} title="Open the Chat tool">
              <p>Click <strong className="text-gray-800 dark:text-gray-200">Chat</strong> in the top navigation, or click <strong className="text-gray-800 dark:text-gray-200">Build from scratch</strong> on the home page.</p>
              <p>The chat interface opens in build mode - the AI will guide you through creating each section of your resume.</p>
            </Step>

            <Step number={2} title="Answer the AI's questions">
              <p>The AI starts by asking for your name and contact details, then walks you through:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Professional summary or objective</li>
                <li>Work experience (company, role, dates, responsibilities)</li>
                <li>Education (degree, institution, graduation year)</li>
                <li>Skills (technical and soft skills)</li>
                <li>Optional: certifications, projects, languages, awards</li>
              </ul>
              <p className="mt-2">Type naturally - you do not need to follow a rigid format. The AI extracts structured data from your answers.</p>
            </Step>

            <Step number={3} title="Watch the live preview update">
              <p>As you provide information the resume preview on the right updates in real time. You can see exactly how your resume will look as you build it.</p>
              <Callout type="tip">You can switch themes at any time using the Change theme button above the preview panel. This does not affect your content.</Callout>
            </Step>

            <Step number={4} title="Edit any section mid-conversation">
              <p>Made a mistake? Just tell the AI: <em className="text-gray-700 dark:text-gray-300">&quot;Change my job title at Acme Corp to Senior Engineer&quot;</em> or <em className="text-gray-700 dark:text-gray-300">&quot;Remove the Python skill&quot;</em>. It will update the resume immediately.</p>
            </Step>

            <Step number={5} title="Finish and go to Analyze">
              <p>When you are happy with the content click <strong className="text-gray-800 dark:text-gray-200">View Analysis</strong> in the header. You will be taken to the Analyze page where you can run ATS scoring and get AI suggestions.</p>
            </Step>

          </DocSection>


          {/* ATS SCORE */}
          <DocSection id="ats-score" badge="Analyze" title="ATS score check" subtitle="Find out how well your resume passes Applicant Tracking Systems and exactly what to fix.">

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              Over 75% of resumes are rejected by ATS software before a human ever reads them. rawcv runs the same checks that enterprise ATS platforms use and gives you a score out of 100 with specific, actionable issues.
            </p>

            <Step number={1} title="Open the ATS Score tab">
              <p>From the <Link href="/analyze" className="text-violet-600 hover:underline">Analyze page</Link>, click the <strong className="text-gray-800 dark:text-gray-200">ATS Score</strong> tab (the first tab, marked with a chart icon).</p>
            </Step>

            <Step number={2} title="Click Run ATS Analysis">
              <p>Click the blue <strong className="text-gray-800 dark:text-gray-200">Run ATS Analysis</strong> button. The analysis takes 5-15 seconds.</p>
            </Step>

            <Step number={3} title="Read your score and issues">
              <p>You will see a score out of 100 with a colour-coded breakdown. Issues are grouped into categories:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong className="text-red-600 dark:text-red-400">Critical</strong> - missing sections (contact info, work experience, education)</li>
                <li><strong className="text-amber-600 dark:text-amber-400">Warnings</strong> - weak formatting, missing dates, vague bullet points</li>
                <li><strong className="text-blue-600 dark:text-blue-400">Suggestions</strong> - keyword density, action verb usage, quantified achievements</li>
              </ul>
            </Step>

            <Step number={4} title="Fix the issues and re-run">
              <p>Each issue includes a plain-English explanation of what is wrong and how to fix it. Common fixes include:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Adding a professional summary section</li>
                <li>Including start and end dates for every job</li>
                <li>Starting bullet points with strong action verbs (Led, Built, Increased)</li>
                <li>Adding measurable results such as &quot;Reduced load time by 40%&quot;</li>
              </ul>
              <p className="mt-2">Use the Chat tool or the Enhance tool to apply fixes, then click <strong className="text-gray-800 dark:text-gray-200">Re-run analysis</strong> to see your updated score.</p>
              <Callout type="tip">Aim for a score above 80 before applying to competitive roles. Scores above 90 are excellent.</Callout>
            </Step>

          </DocSection>


          {/* AI SUGGESTIONS */}
          <DocSection id="ai-suggestions" badge="Analyze" title="AI suggestions" subtitle="Get 3-15 targeted improvements covering action verbs, quantified achievements, and section completeness.">

            <Step number={1} title="Open the Suggestions tab">
              <p>On the <Link href="/analyze" className="text-violet-600 hover:underline">Analyze page</Link>, click the <strong className="text-gray-800 dark:text-gray-200">Suggestions</strong> tab.</p>
            </Step>

            <Step number={2} title="Click Get AI Suggestions">
              <p>Click the violet <strong className="text-gray-800 dark:text-gray-200">Get AI Suggestions</strong> button. The AI reads your entire resume and generates targeted improvements in 5-20 seconds.</p>
            </Step>

            <Step number={3} title="Review each suggestion">
              <p>Suggestions appear as cards. Each card shows:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>The <strong className="text-gray-800 dark:text-gray-200">section</strong> it applies to (e.g. Work Experience, Summary)</li>
                <li>The <strong className="text-gray-800 dark:text-gray-200">original text</strong> with the problem highlighted</li>
                <li>The <strong className="text-gray-800 dark:text-gray-200">suggested replacement</strong></li>
                <li>A brief <strong className="text-gray-800 dark:text-gray-200">reason</strong> explaining why the change improves your resume</li>
              </ul>
            </Step>

            <Step number={4} title="Accept or reject suggestions">
              <p>Click <strong className="text-gray-800 dark:text-gray-200">Accept</strong> to apply a suggestion. The live preview on the right updates immediately.</p>
              <p>Click <strong className="text-gray-800 dark:text-gray-200">Reject</strong> to dismiss a suggestion you disagree with. You can always re-run to get a fresh set.</p>
              <Callout type="tip">Accept suggestions one at a time and watch the preview update. This helps you understand the impact of each change before committing.</Callout>
            </Step>

            <Step number={5} title="Undo a change">
              <p>Changed your mind? Click the <strong className="text-gray-800 dark:text-gray-200">Undo</strong> button in the top-right of the Analyze page to revert the last accepted suggestion.</p>
            </Step>

          </DocSection>


          {/* ENHANCE */}
          <DocSection id="enhance" badge="Analyze" title="Enhance your resume" subtitle="Strengthen weak bullet points and your summary with stronger language - no job description required.">

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              The Enhance tool is different from Suggestions. Instead of pointing out problems it rewrites your existing content with stronger action verbs, more specific language, and a more professional tone while keeping your facts intact.
            </p>

            <Step number={1} title="Open the Enhance tab">
              <p>On the <Link href="/analyze" className="text-violet-600 hover:underline">Analyze page</Link>, click the <strong className="text-gray-800 dark:text-gray-200">Enhance</strong> tab.</p>
            </Step>

            <Step number={2} title="Click Enhance Resume">
              <p>Click the orange <strong className="text-gray-800 dark:text-gray-200">Enhance Resume</strong> button. The AI rewrites your bullet points and summary in 5-20 seconds.</p>
            </Step>

            <Step number={3} title="Review the enhanced content">
              <p>Each enhancement is shown as a before/after comparison. The original text appears in grey and the enhanced version in violet.</p>
            </Step>

            <Step number={4} title="Accept the enhancements you like">
              <p>Accept individual enhancements or use <strong className="text-gray-800 dark:text-gray-200">Accept all</strong> to apply everything at once. The resume preview updates in real time.</p>
              <Callout type="warning">Always read enhanced bullet points carefully. The AI preserves your facts but may occasionally rephrase something that does not match your voice. Reject anything that does not feel right.</Callout>
            </Step>

          </DocSection>


          {/* JD RELEVANCE */}
          <DocSection id="jd-relevance" badge="Analyze" title="Job description relevance check" subtitle="Paste any job description and instantly see how well your resume matches - with missing keywords highlighted.">

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              Recruiters spend an average of 7 seconds on a resume. If your skills and experience do not mirror the language in the job posting you are invisible. The JD Match tool scores your resume against a specific job description and tells you exactly what is missing.
            </p>

            <Step number={1} title="Open the JD Match tab">
              <p>On the <Link href="/analyze" className="text-violet-600 hover:underline">Analyze page</Link>, click the <strong className="text-gray-800 dark:text-gray-200">JD Match</strong> tab.</p>
            </Step>

            <Step number={2} title="Paste the job description">
              <p>Copy the full job description from the job posting - including the responsibilities and requirements sections - and paste it into the text area.</p>
              <Callout type="tip">Include the entire job posting, not just the requirements list. The AI picks up on context clues in the responsibilities section too.</Callout>
            </Step>

            <Step number={3} title="Click Analyze Relevance">
              <p>Click the indigo <strong className="text-gray-800 dark:text-gray-200">Analyze Relevance</strong> button. The analysis takes 5-15 seconds.</p>
            </Step>

            <Step number={4} title="Read your relevance score">
              <p>You will see a relevance score out of 100 along with:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong className="text-gray-800 dark:text-gray-200">Missing keywords</strong> - specific words from the JD that do not appear in your resume</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Missing skills</strong> - technical or soft skills the employer wants that you have not mentioned</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Recommendations</strong> - specific sections where you should add the missing content</li>
              </ul>
            </Step>

            <Step number={5} title="Act on the missing keywords">
              <p>For each missing keyword or skill, decide whether it genuinely applies to your experience. If it does, add it naturally to the relevant section using the Chat tool or by accepting an AI suggestion.</p>
              <Callout type="warning">Never add keywords you do not actually have. This will backfire in interviews. Tailoring is about framing your real experience in the employer&apos;s language.</Callout>
              <Callout type="note">After making changes click Re-run to get an updated relevance score. Aim for 75 or above before applying.</Callout>
            </Step>

            <Step number={6} title="Go to Tailor for a deeper rewrite">
              <p>If your score is below 60 or you want a more thorough rewrite, click <strong className="text-gray-800 dark:text-gray-200">Tailor resume</strong> to use the dedicated Tailor tool which rewrites your entire resume for the specific job.</p>
            </Step>

          </DocSection>


          {/* TAILOR */}
          <DocSection id="tailor" badge="Tailor" title="Tailor your resume to a job" subtitle="Automatically rewrite your resume to match a specific job description - keywords, tone, and structure all optimised.">

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              The Tailor tool goes further than the JD relevance check. Instead of just telling you what is missing it rewrites your resume to incorporate the right keywords and reframe your experience in the language the employer is looking for.
            </p>

            <Step number={1} title="Open the Tailor page">
              <p>Click <strong className="text-gray-800 dark:text-gray-200">Tailor</strong> in the top navigation, or click <strong className="text-gray-800 dark:text-gray-200">Tailor resume</strong> from the JD Match results.</p>
            </Step>

            <Step number={2} title="Paste the job description">
              <p>Paste the full job description into the text area. The same JD you used for the relevance check will be pre-filled if you navigated from there.</p>
            </Step>

            <Step number={3} title="Click Tailor Resume">
              <p>Click the blue <strong className="text-gray-800 dark:text-gray-200">Tailor Resume</strong> button. This costs 2 credits because the AI rewrites multiple sections simultaneously. The process takes 10-30 seconds.</p>
              <Callout type="note">Tailoring rewrites your resume in memory. Your original is preserved and you can undo any changes using the Undo button.</Callout>
            </Step>

            <Step number={4} title="Review the changes diff">
              <p>The left panel shows a diff view - every change the AI made is highlighted:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-1 rounded text-xs font-mono">removed text</span> - original content that was replaced</li>
                <li><span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1 rounded text-xs font-mono">added text</span> - new content the AI inserted</li>
              </ul>
            </Step>

            <Step number={5} title="Accept or reject individual changes">
              <p>Review each change in the diff. Accept the ones that accurately represent your experience and reject any that overstate your skills or do not fit your voice.</p>
              <Callout type="warning">Never accept tailored content that claims skills or experience you do not have. Tailoring is about framing your real experience in the employer&apos;s language.</Callout>
            </Step>

            <Step number={6} title="Download the tailored resume">
              <p>Once you are happy with the changes click <strong className="text-gray-800 dark:text-gray-200">Download PDF</strong> in the top-right. Create a separate tailored version for each job you apply to.</p>
              <Callout type="tip">A resume tailored to a specific job description consistently outperforms a generic one. It takes 30 seconds and costs 2 credits.</Callout>
            </Step>

          </DocSection>


          {/* THEMES AND DOWNLOAD */}
          <DocSection id="themes" badge="Download" title="Themes and downloading your PDF" subtitle="Pick a visual style and download a polished, ATS-safe PDF resume in one click.">

            <Step number={1} title="Open the Theme tab">
              <p>On the <Link href="/analyze" className="text-violet-600 hover:underline">Analyze page</Link>, click the <strong className="text-gray-800 dark:text-gray-200">Theme</strong> tab. You can also access the theme picker from the Chat page by clicking <strong className="text-gray-800 dark:text-gray-200">Change theme</strong> above the preview.</p>
            </Step>

            <Step number={2} title="Choose a theme">
              <p>rawcv includes 8 professionally designed themes:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                {[
                  { name: "Classic",   desc: "Clean serif, traditional" },
                  { name: "Modern",    desc: "Sans-serif, colour accents" },
                  { name: "Minimal",   desc: "Maximum whitespace" },
                  { name: "Executive", desc: "Bold header, formal" },
                  { name: "Creative",  desc: "Sidebar, colour blocks" },
                  { name: "Navy",      desc: "Dark navy header" },
                  { name: "Sharp",     desc: "Geometric, high contrast" },
                  { name: "Terra",     desc: "Warm earth tones" },
                ].map((t) => (
                  <div key={t.name} className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
                    <div className="w-full h-16 rounded-lg bg-gray-100 dark:bg-gray-800 mb-2 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t.name}</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{t.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{t.desc}</p>
                  </div>
                ))}
              </div>
              <Callout type="tip">For corporate roles use Classic, Modern, or Executive. Creative and Terra work well for design, marketing, and startup roles. All themes are ATS-safe.</Callout>
            </Step>

            <Step number={3} title="Preview in real time">
              <p>Clicking a theme card instantly updates the resume preview on the right. No need to save - the selection is applied immediately.</p>
            </Step>

            <Step number={4} title="Download your PDF">
              <p>Click the <strong className="text-gray-800 dark:text-gray-200">Download PDF</strong> button in the top-right of the Analyze or Tailor page. The PDF is generated server-side and downloads automatically.</p>
              <p>PDF downloads are <strong className="text-gray-800 dark:text-gray-200">free</strong> - they do not consume credits.</p>
              <Callout type="note">The downloaded PDF is a pixel-perfect render of the theme preview, optimised for both ATS parsing and human readability.</Callout>
            </Step>

          </DocSection>


          {/* CREDITS */}
          <DocSection id="credits" badge="Billing" title="Credits and pricing" subtitle="rawcv uses a pay-as-you-go credit system. You only pay for the AI operations you actually use.">

            <Step number={1} title="Check your balance">
              <p>Your current credit balance is shown in the top-right corner of every page. Click it to go to the <Link href="/credits" className="text-violet-600 hover:underline">Credits page</Link>.</p>
            </Step>

            <Step number={2} title="Choose a credit pack">
              <p>Three packs are available. Credits never expire.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {[
                  { name: "Starter", price: "Rs 99 / $1",  credits: "50 credits",  best: "Quick resume check" },
                  { name: "Pro",     price: "Rs 499 / $5", credits: "250 credits", best: "Active job search" },
                  { name: "Power",   price: "Rs 999 / $10",credits: "500 credits", best: "Power users and coaches" },
                ].map((p) => (
                  <div key={p.name} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{p.name}</p>
                    <p className="text-xl font-extrabold mt-1 text-violet-600 dark:text-violet-400">{p.credits}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.price}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{p.best}</p>
                  </div>
                ))}
              </div>
            </Step>

            <Step number={3} title="Pay securely">
              <p>Payments are processed via <strong className="text-gray-800 dark:text-gray-200">Razorpay</strong> (India) or <strong className="text-gray-800 dark:text-gray-200">Stripe</strong> (international). Both support UPI, cards, net banking, and wallets.</p>
              <p>Credits are added to your account instantly after payment confirmation.</p>
              <Callout type="note">rawcv does not store your payment details. All transactions are handled directly by Razorpay or Stripe.</Callout>
            </Step>
          </DocSection>


          {/* FAQ */}
          <DocSection id="faq" badge="FAQ" title="Frequently asked questions" subtitle="Quick answers to the most common questions about rawcv.">
            <dl className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
              {[
                { q: "Is rawcv free to use?", a: "Every new account gets 20 free credits. Free-tier AI models cost 0.5-1 credit per operation so you can run several analyses before needing to top up. PDF downloads are always free." },
                { q: "Does rawcv store my resume?", a: "No. Resume data is held in your browser session only. We do not permanently store your resume content on our servers. If you close the tab or refresh you will need to re-upload." },
                { q: "What file formats does rawcv accept?", a: "rawcv accepts PDF, DOCX, and TXT files up to 5 MB. For best results use a single-column PDF without tables or text boxes." },
                { q: "Can I use rawcv on mobile?", a: "Yes - rawcv is fully responsive. The chat, analysis, and download tools all work on mobile browsers. The split-panel layout on the Analyze page collapses to a single column on small screens." },
                { q: "How accurate is the ATS score?", a: "rawcv combines rule-based checks (missing sections, date formatting, keyword density) with AI analysis. The score is a strong indicator of ATS compatibility but is not a guarantee - different ATS platforms have different rules." },
                { q: "Can I undo changes?", a: "Yes. The Undo button in the Analyze and Chat pages reverts the last accepted change. You can undo multiple times to step back through your edit history." },
                { q: "Do credits expire?", a: "No. Credits never expire. Buy a pack and use it at your own pace." },
                { q: "What AI models does rawcv use?", a: "rawcv uses a mix of models from OpenAI, Anthropic, Google, and Together AI depending on the operation. Pro and Power credit packs unlock access to the most capable models." },
                { q: "Can I create multiple versions of my resume?", a: "Yes - use the Tailor tool to create a job-specific version for each application. Each tailored version can be downloaded as a separate PDF." },
                { q: "How do I contact support?", a: "Email us at support@rawcv.com. We typically respond within 24 hours on business days." },
              ].map((faq) => (
                <div key={faq.q} itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0">
                  <dt className="font-semibold text-gray-900 dark:text-gray-100 mb-2" itemProp="name">{faq.q}</dt>
                  <dd className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                    <span itemProp="text">{faq.a}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </DocSection>

          {/* Bottom CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-8 text-center text-white mt-8">
            <h2 className="text-2xl font-bold mb-2">Ready to build your best resume?</h2>
            <p className="text-violet-100 mb-6 text-sm">Create a free account and get 20 credits instantly. No credit card required.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/register" className="px-6 py-2.5 rounded-xl bg-white text-violet-700 font-semibold text-sm hover:bg-violet-50 transition-colors">
                Get started free
              </Link>
              <Link href="/" className="px-6 py-2.5 rounded-xl border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors">
                Back to home
              </Link>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
