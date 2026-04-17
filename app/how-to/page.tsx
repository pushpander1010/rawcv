
import Link from "next/link";
import Script from "next/script";

/* ─── Placeholder components ─────────────────────────────────────── */

/** Drop-in placeholder for a screenshot. Replace src with a real image path. */
function PlaceholderImage({
  label,
  aspectRatio = "16/9",
}: {
  label: string;
  aspectRatio?: string;
}) {
  return (
    <figure
      className="w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-500 my-6"
      style={{ aspectRatio }}
      aria-label={label}
    >
      {/* Replace this entire <figure> with <img src="..." alt="..." className="w-full rounded-2xl" /> */}
      <svg className="w-10 h-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span className="text-xs font-medium px-4 text-center">{label}</span>
      <span className="text-[10px] opacity-60">Replace with real screenshot</span>
    </figure>
  );
}

/** Drop-in placeholder for a video. Replace with a real <video> or <iframe>. */
function PlaceholderVideo({ label }: { label: string }) {
  return (
    <figure
      className="w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-900 flex flex-col items-center justify-center gap-3 text-gray-400 my-6"
      style={{ aspectRatio: "16/9" }}
      aria-label={label}
    >
      {/* Replace this entire <figure> with:
          <iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID" ... />
          or <video src="/videos/your-video.mp4" controls className="w-full rounded-2xl" /> */}
      <svg className="w-12 h-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-xs font-medium px-4 text-center">{label}</span>
      <span className="text-[10px] opacity-60">Replace with real video</span>
    </figure>
  );
}

/* ─── Step component ──────────────────────────────────────────────── */

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5 mb-10">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-600 text-white text-sm font-bold flex items-center justify-center mt-0.5">
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Callout component ───────────────────────────────────────────── */

function Callout({
  type = "tip",
  children,
}: {
  type?: "tip" | "note" | "warning";
  children: React.ReactNode;
}) {
  const styles = {
    tip:     "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300",
    note:    "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300",
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300",
  };
  const icons = { tip: "💡", note: "ℹ️", warning: "⚠️" };
  return (
    <div className={`flex gap-3 rounded-xl border px-4 py-3 text-sm ${styles[type]}`}>
      <span className="flex-shrink-0 mt-0.5">{icons[type]}</span>
      <div>{children}</div>
    </div>
  );
}

/* ─── Section wrapper ─────────────────────────────────────────────── */

function DocSection({
  id,
  icon,
  title,
  subtitle,
  children,
}: {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 mb-20">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl" aria-hidden="true">{icon}</span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">{subtitle}</p>
      <div className="border-t border-gray-100 dark:border-gray-800 pt-8">
        {children}
      </div>
    </section>
  );
}

/* ─── TOC items ───────────────────────────────────────────────────── */

const TOC = [
  { id: "getting-started",  label: "Getting started",          icon: "🚀" },
  { id: "upload-resume",    label: "Upload a resume",          icon: "📤" },
  { id: "build-resume",     label: "Build from scratch",       icon: "✍️" },
  { id: "ats-score",        label: "ATS score check",          icon: "📊" },
  { id: "ai-suggestions",   label: "AI suggestions",           icon: "✨" },
  { id: "enhance",          label: "Enhance resume",           icon: "🔧" },
  { id: "jd-relevance",     label: "JD relevance check",       icon: "🎯" },
  { id: "tailor",           label: "Tailor to a job",          icon: "🪡" },
  { id: "themes",           label: "Themes & download",        icon: "🎨" },
  { id: "credits",          label: "Credits & pricing",        icon: "💳" },
  { id: "faq",              label: "FAQ",                      icon: "❓" },
];
/* --- Page --------------------------------------------------------- */

export default function HowToPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to use rawcv � AI Resume Builder",
    "description": "Step-by-step guide to building, analyzing, and optimizing your resume with rawcv.",
    "url": "https://www.rawcv.com/how-to",
    "step": [
      { "@type": "HowToStep", "name": "Create a free account", "text": "Sign up at rawcv.com with your email. You get 20 free credits instantly." },
      { "@type": "HowToStep", "name": "Upload or build your resume", "text": "Drag and drop a PDF or DOCX, or build from scratch using the AI chat interface." },
      { "@type": "HowToStep", "name": "Run ATS analysis", "text": "Click Run ATS Analysis to get a score out of 100 with specific issues to fix." },
      { "@type": "HowToStep", "name": "Get AI suggestions", "text": "Click Get AI Suggestions for targeted improvements covering action verbs and achievements." },
      { "@type": "HowToStep", "name": "Match to a job description", "text": "Paste a job description to see your relevance score and missing keywords." },
      { "@type": "HowToStep", "name": "Tailor your resume", "text": "Use the Tailor tool to automatically rewrite your resume for a specific job." },
      { "@type": "HowToStep", "name": "Download your PDF", "text": "Pick a theme and download a polished, ATS-safe PDF resume." }
    ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Script id="how-to-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div className="bg-gradient-to-b from-violet-50 dark:from-violet-950/30 to-white dark:to-gray-950 border-b border-gray-100 dark:border-gray-800 px-6 py-16 text-center">
        <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 uppercase tracking-wide">
          Documentation
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          How to use rawcv
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg">
          Everything you need to go from a blank page to a polished, ATS-optimized resume � step by step.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link href="/register" className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors">
            Get started free
          </Link>
          <Link href="#getting-started" className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Read the guide ?
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 flex gap-12">

        {/* Sticky sidebar TOC */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">On this page</p>
            <nav aria-label="Table of contents">
              <ul className="space-y-1">
                {TOC.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
                    >
                      <span aria-hidden="true">{item.icon}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-8 p-4 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900">
              <p className="text-xs text-violet-700 dark:text-violet-300 font-medium mb-2">Need help?</p>
              <p className="text-xs text-violet-600 dark:text-violet-400">
                Email us at{" "}
                <a href="mailto:support@rawcv.com" className="underline hover:no-underline">
                  support@rawcv.com
                </a>
              </p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">

          {/* -- GETTING STARTED ----------------------------------- */}
          <DocSection id="getting-started" icon="??" title="Getting started" subtitle="Create your free account and understand how rawcv works before you dive in.">

            <Step number={1} title="Create a free account">
              <p>Go to <Link href="/register" className="text-violet-600 hover:underline font-medium">rawcv.com/register</Link> and sign up with your email address. No credit card required.</p>
              <p>Once registered, you receive <strong className="text-gray-800 dark:text-gray-200">20 free credits</strong> instantly. Credits are consumed per AI operation � most actions cost 1�2 credits, so you can run several analyses before needing to top up.</p>
              <PlaceholderImage label="Screenshot: Registration page � email + password fields and Sign up button" />
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
                      ["Parse / upload resume",       "0.5 � 1"],
                      ["ATS score analysis",          "1"],
                      ["JD relevance check",          "1"],
                      ["AI suggestions",              "1 � 2"],
                      ["Resume enhancement",          "1 � 2"],
                      ["Tailor resume to JD",         "2"],
                      ["Chat message (build/edit)",   "0.5 � 1"],
                      ["PDF download",                "Free"],
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
                <li><strong className="text-gray-800 dark:text-gray-200">Dashboard</strong> � overview of your resume and quick actions</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Analyze</strong> � ATS score, JD match, AI suggestions, enhancement, and theme picker</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Tailor</strong> � rewrite your resume for a specific job description</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Chat</strong> � build or edit your resume conversationally with AI</li>
              </ul>
              <PlaceholderImage label="Screenshot: Top navigation bar showing Dashboard, Analyze, Tailor, Chat links and credit balance" aspectRatio="4/1" />
            </Step>
          </DocSection>


          {/* -- UPLOAD RESUME ------------------------------------- */}
          <DocSection id="upload-resume" icon="??" title="Upload a resume" subtitle="The fastest way to get started � upload your existing PDF or DOCX and rawcv parses it instantly.">

            <Step number={1} title="Go to the home page or dashboard">
              <p>From the home page, scroll to the upload area in the hero section. If you are already logged in, the uploader appears immediately after the welcome message.</p>
              <PlaceholderImage label="Screenshot: Home page hero with drag-and-drop upload zone highlighted" />
            </Step>

            <Step number={2} title="Drag and drop or click to browse">
              <p>Drag your resume file directly onto the upload zone, or click <strong className="text-gray-800 dark:text-gray-200">Browse files</strong> to open a file picker.</p>
              <p>Supported formats: <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">.pdf</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">.docx</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">.txt</code> � up to <strong className="text-gray-800 dark:text-gray-200">5 MB</strong>.</p>
              <PlaceholderImage label="Screenshot: Upload zone with a file being dragged onto it � dashed border highlighted" />
              <Callout type="tip">For best parsing results, use a single-column PDF without tables or text boxes. Multi-column layouts can confuse the parser.</Callout>
            </Step>

            <Step number={3} title="Wait for parsing to complete">
              <p>rawcv extracts your contact info, work experience, education, skills, and summary automatically. This takes 3�10 seconds depending on file complexity.</p>
              <p>A loading spinner appears in the upload zone while parsing is in progress.</p>
              <PlaceholderImage label="Screenshot: Upload zone showing parsing spinner and 'Parsing your resume...' message" />
            </Step>

            <Step number={4} title="Review the parsed resume">
              <p>Once parsed, you are redirected to the <strong className="text-gray-800 dark:text-gray-200">Analyze</strong> page. The right panel shows a live preview of your resume rendered in the selected theme.</p>
              <p>Check that your name, contact details, and work history look correct. If anything is missing or wrong, use the <Link href="#build-resume" className="text-violet-600 hover:underline">Chat tool</Link> to fix it.</p>
              <PlaceholderImage label="Screenshot: Analyze page � left panel showing ATS tab, right panel showing parsed resume preview" />
              <Callout type="note">rawcv does not permanently store your resume content. Data lives in your browser session. If you refresh or close the tab, you will need to re-upload.</Callout>
            </Step>

            <PlaceholderVideo label="Video walkthrough: Uploading a PDF resume and reviewing the parsed output (60 seconds)" />
          </DocSection>


          {/* -- BUILD FROM SCRATCH -------------------------------- */}
          <DocSection id="build-resume" icon="??" title="Build a resume from scratch" subtitle="No existing resume? Use the AI chat interface to build one section by section through a conversation.">

            <Step number={1} title="Open the Chat tool">
              <p>Click <strong className="text-gray-800 dark:text-gray-200">Chat</strong> in the top navigation, or click the <strong className="text-gray-800 dark:text-gray-200">Build from scratch</strong> button on the home page.</p>
              <p>The chat interface opens in <em>build mode</em> � the AI will guide you through creating each section of your resume.</p>
              <PlaceholderImage label="Screenshot: Chat page in build mode � left panel shows chat interface, right panel shows empty resume preview" />
            </Step>

            <Step number={2} title="Answer the AI's questions">
              <p>The AI starts by asking for your name and contact details, then walks you through:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Professional summary or objective</li>
                <li>Work experience (company, role, dates, responsibilities)</li>
                <li>Education (degree, institution, graduation year)</li>
                <li>Skills (technical and soft skills)</li>
                <li>Optional sections: certifications, projects, languages, awards</li>
              </ul>
              <p className="mt-2">Type naturally � you do not need to follow a rigid format. The AI extracts the structured data from your answers.</p>
              <PlaceholderImage label="Screenshot: Chat conversation showing AI asking 'What is your most recent job title and company?' with user reply" />
            </Step>

            <Step number={3} title="Watch the live preview update">
              <p>As you provide information, the resume preview on the right updates in real time. You can see exactly how your resume will look as you build it.</p>
              <PlaceholderImage label="Screenshot: Split view � chat on left with a few messages, resume preview on right showing populated sections" />
              <Callout type="tip">You can switch themes at any time using the <strong>Change theme</strong> button above the preview panel. This does not affect your content.</Callout>
            </Step>

            <Step number={4} title="Edit any section mid-conversation">
              <p>Made a mistake? Just tell the AI: <em>"Change my job title at Acme Corp to Senior Engineer"</em> or <em>"Remove the Python skill"</em>. It will update the resume and show you the diff.</p>
              <PlaceholderImage label="Screenshot: Chat message 'Change my summary to focus on product management' with AI confirming the update" />
            </Step>

            <Step number={5} title="Finish and go to Analyze">
              <p>When you are happy with the content, click <strong className="text-gray-800 dark:text-gray-200">View Analysis</strong> in the header, or type <em>"done"</em> in the chat. You will be taken to the Analyze page where you can run ATS scoring and get AI suggestions.</p>
              <PlaceholderImage label="Screenshot: Chat header with 'View Analysis' button highlighted in blue" aspectRatio="4/1" />
            </Step>

            <PlaceholderVideo label="Video walkthrough: Building a complete resume from scratch using the AI chat (3 minutes)" />
          </DocSection>


          {/* -- ATS SCORE ----------------------------------------- */}
          <DocSection id="ats-score" icon="??" title="ATS score check" subtitle="Find out how well your resume passes Applicant Tracking Systems � and exactly what to fix.">

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              Over 75% of resumes are rejected by ATS software before a human ever reads them. rawcv runs the same checks that enterprise ATS platforms use and gives you a score out of 100 with specific, actionable issues.
            </p>

            <Step number={1} title="Open the ATS Score tab">
              <p>From the <Link href="/analyze" className="text-violet-600 hover:underline">Analyze page</Link>, click the <strong className="text-gray-800 dark:text-gray-200">ATS Score</strong> tab (the first tab, marked with ??).</p>
              <PlaceholderImage label="Screenshot: Analyze page with ATS Score tab selected and highlighted in the tab bar" aspectRatio="4/1" />
            </Step>

            <Step number={2} title="Click Run ATS Analysis">
              <p>Click the blue <strong className="text-gray-800 dark:text-gray-200">Run ATS Analysis</strong> button. The analysis takes 5�15 seconds.</p>
              <PlaceholderImage label="Screenshot: ATS tab showing the 'Run ATS Analysis' button before analysis is run" />
            </Step>

            <Step number={3} title="Read your score and issues">
              <p>You will see a score out of 100 with a colour-coded breakdown. Issues are grouped into categories:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong className="text-red-600 dark:text-red-400">Critical</strong> � missing sections (contact info, work experience, education)</li>
                <li><strong className="text-amber-600 dark:text-amber-400">Warnings</strong> � weak formatting, missing dates, vague bullet points</li>
                <li><strong className="text-blue-600 dark:text-blue-400">Suggestions</strong> � keyword density, action verb usage, quantified achievements</li>
              </ul>
              <PlaceholderImage label="Screenshot: ATS Score card showing score of 74/100 with a list of issues � one critical, three warnings, two suggestions" />
            </Step>

            <Step number={4} title="Fix the issues">
              <p>Each issue includes a plain-English explanation of what is wrong and how to fix it. Common fixes include:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Adding a professional summary section</li>
                <li>Including start and end dates for every job</li>
                <li>Starting bullet points with strong action verbs (Led, Built, Increased�)</li>
                <li>Adding measurable results (e.g. "Reduced load time by 40%")</li>
              </ul>
              <p className="mt-2">Use the <Link href="#build-resume" className="text-violet-600 hover:underline">Chat tool</Link> or the <Link href="#enhance" className="text-violet-600 hover:underline">Enhance tool</Link> to apply fixes, then click <strong className="text-gray-800 dark:text-gray-200">Re-run analysis</strong> to see your new score.</p>
              <Callout type="tip">Aim for a score above 80 before applying to competitive roles. Scores above 90 are excellent.</Callout>
            </Step>

            <PlaceholderVideo label="Video walkthrough: Running ATS analysis and fixing the top 3 issues (2 minutes)" />
          </DocSection>


          {/* -- AI SUGGESTIONS ------------------------------------ */}
          <DocSection id="ai-suggestions" icon="?" title="AI suggestions" subtitle="Get 3�15 targeted improvements covering action verbs, quantified achievements, and section completeness.">

            <Step number={1} title="Open the Suggestions tab">
              <p>On the <Link href="/analyze" className="text-violet-600 hover:underline">Analyze page</Link>, click the <strong className="text-gray-800 dark:text-gray-200">Suggestions</strong> tab (marked ?).</p>
              <PlaceholderImage label="Screenshot: Analyze page with Suggestions tab selected in the tab bar" aspectRatio="4/1" />
            </Step>

            <Step number={2} title="Click Get AI Suggestions">
              <p>Click the violet <strong className="text-gray-800 dark:text-gray-200">Get AI Suggestions</strong> button. The AI reads your entire resume and generates targeted improvements in 5�20 seconds.</p>
              <PlaceholderImage label="Screenshot: Suggestions tab showing 'Get AI Suggestions' button" />
            </Step>

            <Step number={3} title="Review each suggestion">
              <p>Suggestions appear as cards. Each card shows:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>The <strong className="text-gray-800 dark:text-gray-200">section</strong> it applies to (e.g. Work Experience, Summary)</li>
                <li>The <strong className="text-gray-800 dark:text-gray-200">original text</strong> with the problem highlighted</li>
                <li>The <strong className="text-gray-800 dark:text-gray-200">suggested replacement</strong></li>
                <li>A brief <strong className="text-gray-800 dark:text-gray-200">reason</strong> explaining why the change improves your resume</li>
              </ul>
              <PlaceholderImage label="Screenshot: Suggestions list showing 3 cards � each with original text, suggested text, and reason" />
            </Step>

            <Step number={4} title="Accept or reject suggestions">
              <p>Click <strong className="text-gray-800 dark:text-gray-200">Accept</strong> to apply a suggestion to your resume. The live preview on the right updates immediately.</p>
              <p>Click <strong className="text-gray-800 dark:text-gray-200">Reject</strong> to dismiss a suggestion you disagree with. You can always re-run suggestions to get a fresh set.</p>
              <PlaceholderImage label="Screenshot: A suggestion card with Accept (green) and Reject (red) buttons � Accept button being clicked" />
              <Callout type="tip">Accept suggestions one at a time and watch the preview update. This helps you understand the impact of each change before committing.</Callout>
            </Step>

            <Step number={5} title="Undo a change">
              <p>Changed your mind? Click the <strong className="text-gray-800 dark:text-gray-200">Undo</strong> button in the top-right of the Analyze page to revert the last accepted suggestion.</p>
              <PlaceholderImage label="Screenshot: Analyze page header with Undo button highlighted" aspectRatio="4/1" />
            </Step>

            <PlaceholderVideo label="Video walkthrough: Getting AI suggestions and accepting the best ones (90 seconds)" />
          </DocSection>


          {/* -- ENHANCE ------------------------------------------- */}
          <DocSection id="enhance" icon="??" title="Enhance your resume" subtitle="Strengthen weak bullet points and your summary with stronger language � no job description required.">

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              The Enhance tool is different from Suggestions. Instead of pointing out problems, it rewrites your existing content with stronger action verbs, more specific language, and a more professional tone � while keeping your facts intact.
            </p>

            <Step number={1} title="Open the Enhance tab">
              <p>On the <Link href="/analyze" className="text-violet-600 hover:underline">Analyze page</Link>, click the <strong className="text-gray-800 dark:text-gray-200">Enhance</strong> tab (marked ??).</p>
              <PlaceholderImage label="Screenshot: Analyze page with Enhance tab selected" aspectRatio="4/1" />
            </Step>

            <Step number={2} title="Click Enhance Resume">
              <p>Click the orange <strong className="text-gray-800 dark:text-gray-200">Enhance Resume</strong> button. The AI rewrites your bullet points and summary in 5�20 seconds.</p>
              <PlaceholderImage label="Screenshot: Enhance tab showing the 'Enhance Resume' button before running" />
            </Step>

            <Step number={3} title="Review the enhanced content">
              <p>Each enhancement is shown as a before/after comparison. The original text appears in grey and the enhanced version in violet.</p>
              <PlaceholderImage label="Screenshot: Enhancement list showing before/after comparison for 4 bullet points" />
            </Step>

            <Step number={4} title="Accept the enhancements you like">
              <p>Accept individual enhancements or use <strong className="text-gray-800 dark:text-gray-200">Accept all</strong> to apply everything at once. The resume preview updates in real time.</p>
              <Callout type="warning">Always read enhanced bullet points carefully. The AI preserves your facts but may occasionally rephrase something in a way that does not match your voice. Reject anything that does not feel right.</Callout>
              <PlaceholderImage label="Screenshot: Enhancement card with Accept and Reject buttons, and 'Accept all' button at the top of the list" />
            </Step>

            <PlaceholderVideo label="Video walkthrough: Running resume enhancement and reviewing before/after changes (90 seconds)" />
          </DocSection>


          {/* -- JD RELEVANCE -------------------------------------- */}
          <DocSection id="jd-relevance" icon="??" title="Job description relevance check" subtitle="Paste any job description and instantly see how well your resume matches � with missing keywords highlighted.">

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              Recruiters spend an average of 7 seconds on a resume. If your skills and experience do not mirror the language in the job posting, you are invisible. The JD Match tool scores your resume against a specific job description and tells you exactly what is missing.
            </p>

            <Step number={1} title="Open the JD Match tab">
              <p>On the <Link href="/analyze" className="text-violet-600 hover:underline">Analyze page</Link>, click the <strong className="text-gray-800 dark:text-gray-200">JD Match</strong> tab (marked ??).</p>
              <PlaceholderImage label="Screenshot: Analyze page with JD Match tab selected" aspectRatio="4/1" />
            </Step>

            <Step number={2} title="Paste the job description">
              <p>Copy the full job description from the job posting � including the responsibilities and requirements sections � and paste it into the text area.</p>
              <p>The more complete the job description, the more accurate the relevance score.</p>
              <PlaceholderImage label="Screenshot: JD Match tab with a job description pasted into the textarea � 'Analyze Relevance' button visible below" />
              <Callout type="tip">Include the entire job posting, not just the requirements list. The AI picks up on context clues in the responsibilities section too.</Callout>
            </Step>

            <Step number={3} title="Click Analyze Relevance">
              <p>Click the indigo <strong className="text-gray-800 dark:text-gray-200">Analyze Relevance</strong> button. The analysis takes 5�15 seconds.</p>
            </Step>

            <Step number={4} title="Read your relevance score">
              <p>You will see a relevance score out of 100 along with:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong className="text-gray-800 dark:text-gray-200">Missing keywords</strong> � specific words from the JD that do not appear in your resume</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Missing skills</strong> � technical or soft skills the employer wants that you have not mentioned</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Recommendations</strong> � specific sections where you should add the missing content</li>
              </ul>
              <PlaceholderImage label="Screenshot: Relevance score card showing 68/100 with lists of missing keywords, missing skills, and 3 recommendations" />
            </Step>

            <Step number={5} title="Act on the missing keywords">
              <p>For each missing keyword or skill, decide whether it genuinely applies to your experience. If it does, add it naturally to the relevant section using the Chat tool or by accepting an AI suggestion.</p>
              <p>Never add keywords you do not actually have � this will backfire in interviews.</p>
              <Callout type="note">After making changes, click <strong>Re-run</strong> to get an updated relevance score. Aim for 75+ before applying.</Callout>
              <PlaceholderImage label="Screenshot: Relevance card with 'Re-run' and 'Tailor resume ?' buttons at the bottom" />
            </Step>

            <Step number={6} title="Go to Tailor for deeper customisation">
              <p>If your score is below 60 or you want a more thorough rewrite, click <strong className="text-gray-800 dark:text-gray-200">Tailor resume ?</strong> to use the dedicated Tailor tool, which rewrites your entire resume for the specific job.</p>
            </Step>

            <PlaceholderVideo label="Video walkthrough: Pasting a job description, reading the relevance score, and adding missing keywords (2 minutes)" />
          </DocSection>


          {/* -- TAILOR -------------------------------------------- */}
          <DocSection id="tailor" icon="??" title="Tailor your resume to a job" subtitle="Automatically rewrite your resume to match a specific job description � keywords, tone, and structure all optimised.">

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              The Tailor tool goes further than the JD relevance check. Instead of just telling you what is missing, it rewrites your resume to incorporate the right keywords and reframe your experience in the language the employer is looking for.
            </p>

            <Step number={1} title="Open the Tailor page">
              <p>Click <strong className="text-gray-800 dark:text-gray-200">Tailor</strong> in the top navigation, or click <strong className="text-gray-800 dark:text-gray-200">Tailor resume ?</strong> from the JD Match results.</p>
              <PlaceholderImage label="Screenshot: Tailor page with empty job description textarea and 'Tailor Resume' button" />
            </Step>

            <Step number={2} title="Paste the job description">
              <p>Paste the full job description into the text area. The same JD you used for the relevance check will be pre-filled if you navigated from there.</p>
              <PlaceholderImage label="Screenshot: Tailor page with a job description pasted � 'Tailor Resume' button active" />
            </Step>

            <Step number={3} title="Click Tailor Resume">
              <p>Click the blue <strong className="text-gray-800 dark:text-gray-200">Tailor Resume</strong> button. This is the most credit-intensive operation (2 credits) because the AI rewrites multiple sections of your resume simultaneously.</p>
              <p>The process takes 10�30 seconds depending on resume length.</p>
              <Callout type="note">Tailoring rewrites your resume in memory � your original is preserved and you can undo any changes using the Undo button.</Callout>
            </Step>

            <Step number={4} title="Review the changes diff">
              <p>The left panel shows a diff view � every change the AI made is highlighted:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-1 rounded text-xs font-mono">removed text</span> � original content that was replaced</li>
                <li><span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1 rounded text-xs font-mono">added text</span> � new content the AI inserted</li>
              </ul>
              <PlaceholderImage label="Screenshot: Tailor diff view showing red strikethrough text and green replacement text across 5 bullet points" />
            </Step>

            <Step number={5} title="Accept or reject individual changes">
              <p>Review each change in the diff. Accept the ones that accurately represent your experience and reject any that overstate your skills or do not fit your voice.</p>
              <PlaceholderImage label="Screenshot: Diff card with Accept and Reject buttons � one change being accepted, preview updating on the right" />
              <Callout type="warning">Never accept tailored content that claims skills or experience you do not have. Tailoring is about framing your real experience in the employer's language � not fabricating it.</Callout>
            </Step>

            <Step number={6} title="Download the tailored resume">
              <p>Once you are happy with the changes, click <strong className="text-gray-800 dark:text-gray-200">Download PDF</strong> in the top-right. Each job application should have its own tailored version.</p>
              <Callout type="tip">Create a separate tailored version for each role you apply to. A resume tailored to a specific JD consistently outperforms a generic one.</Callout>
            </Step>

            <PlaceholderVideo label="Video walkthrough: Tailoring a resume to a software engineer job description (3 minutes)" />
          </DocSection>


          {/* -- THEMES & DOWNLOAD --------------------------------- */}
          <DocSection id="themes" icon="??" title="Themes & downloading your PDF" subtitle="Pick a visual style and download a polished, ATS-safe PDF resume in one click.">

            <Step number={1} title="Open the Theme tab">
              <p>On the <Link href="/analyze" className="text-violet-600 hover:underline">Analyze page</Link>, click the <strong className="text-gray-800 dark:text-gray-200">Theme</strong> tab (marked ??). You can also access the theme picker from the Chat page by clicking <strong className="text-gray-800 dark:text-gray-200">Change theme</strong> above the preview.</p>
              <PlaceholderImage label="Screenshot: Theme tab showing 8 theme cards in a grid � Classic, Modern, Minimal, Executive, Creative, Navy, Sharp, Terra" />
            </Step>

            <Step number={2} title="Choose a theme">
              <p>rawcv includes 8 professionally designed themes:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                {[
                  { name: "Classic",   desc: "Clean serif, traditional layout" },
                  { name: "Modern",    desc: "Sans-serif, subtle colour accents" },
                  { name: "Minimal",   desc: "Maximum whitespace, ultra-clean" },
                  { name: "Executive", desc: "Bold header, formal tone" },
                  { name: "Creative",  desc: "Sidebar layout, colour blocks" },
                  { name: "Navy",      desc: "Dark navy header, professional" },
                  { name: "Sharp",     desc: "Geometric, high contrast" },
                  { name: "Terra",     desc: "Warm earth tones, modern" },
                ].map((t) => (
                  <div key={t.name} className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
                    <div className="w-full h-16 rounded-lg bg-gray-100 dark:bg-gray-800 mb-2 flex items-center justify-center">
                      {/* Replace with actual theme thumbnail */}
                      <span className="text-xs text-gray-400">thumbnail</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{t.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{t.desc}</p>
                  </div>
                ))}
              </div>
              <Callout type="tip">For most corporate roles, use Classic, Modern, or Executive. Creative and Terra work well for design, marketing, and startup roles. All themes are ATS-safe � they use clean HTML that parses correctly.</Callout>
            </Step>

            <Step number={3} title="Preview in real time">
              <p>Clicking a theme card instantly updates the resume preview on the right. No need to save � the selection is applied immediately.</p>
              <PlaceholderImage label="Screenshot: Theme tab with 'Modern' selected (highlighted border) and resume preview on the right showing the Modern theme" />
            </Step>

            <Step number={4} title="Download your PDF">
              <p>Click the <strong className="text-gray-800 dark:text-gray-200">Download PDF</strong> button in the top-right of the Analyze or Tailor page. The PDF is generated server-side and downloads automatically.</p>
              <p>PDF downloads are <strong className="text-gray-800 dark:text-gray-200">free</strong> � they do not consume credits.</p>
              <PlaceholderImage label="Screenshot: Analyze page header with 'Download PDF' button highlighted � download starting" aspectRatio="4/1" />
              <Callout type="note">The downloaded PDF is a pixel-perfect render of the theme preview. It is optimised for both ATS parsing and human readability.</Callout>
            </Step>

            <PlaceholderVideo label="Video walkthrough: Switching themes and downloading a PDF (60 seconds)" />
          </DocSection>


          {/* -- CREDITS ------------------------------------------- */}
          <DocSection id="credits" icon="??" title="Credits & pricing" subtitle="rawcv uses a pay-as-you-go credit system. You only pay for the AI operations you actually use.">

            <Step number={1} title="Check your balance">
              <p>Your current credit balance is shown in the top-right corner of every page. Click it to go to the <Link href="/credits" className="text-violet-600 hover:underline">Credits page</Link>.</p>
              <PlaceholderImage label="Screenshot: Header showing credit balance badge '18 credits' in the top-right corner" aspectRatio="4/1" />
            </Step>

            <Step number={2} title="Choose a credit pack">
              <p>Three packs are available. Credits never expire.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {[
                  { name: "Starter", price: "?99 / $1",  credits: "50 credits",  best: "Quick resume check" },
                  { name: "Pro",     price: "?499 / $5", credits: "250 credits", best: "Active job search" },
                  { name: "Power",   price: "?999 / $10",credits: "500 credits", best: "Power users & coaches" },
                ].map((p) => (
                  <div key={p.name} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{p.name}</p>
                    <p className="text-xl font-extrabold mt-1 text-violet-600 dark:text-violet-400">{p.credits}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{p.price}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{p.best}</p>
                  </div>
                ))}
              </div>
              <PlaceholderImage label="Screenshot: Credits page showing three pricing cards with Buy buttons" />
            </Step>

            <Step number={3} title="Pay securely">
              <p>Payments are processed via <strong className="text-gray-800 dark:text-gray-200">Razorpay</strong> (India) or <strong className="text-gray-800 dark:text-gray-200">Stripe</strong> (international). Both support UPI, cards, net banking, and wallets.</p>
              <p>Credits are added to your account instantly after payment confirmation.</p>
              <Callout type="note">rawcv does not store your payment details. All transactions are handled directly by Razorpay or Stripe.</Callout>
            </Step>
          </DocSection>


          {/* -- FAQ ----------------------------------------------- */}
          <DocSection id="faq" icon="?" title="Frequently asked questions" subtitle="Quick answers to the most common questions about rawcv.">
            <dl className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
              {[
                {
                  q: "Is rawcv free to use?",
                  a: "Every new account gets 20 free credits. Free-tier AI models cost 0.5�1 credit per operation, so you can run several analyses before needing to top up. PDF downloads are always free."
                },
                {
                  q: "Does rawcv store my resume?",
                  a: "No. Resume data is held in your browser session only. We do not permanently store your resume content on our servers. If you close the tab or refresh, you will need to re-upload."
                },
                {
                  q: "What file formats does rawcv accept?",
                  a: "rawcv accepts PDF, DOCX, and TXT files up to 5 MB. For best results, use a single-column PDF without tables or text boxes."
                },
                {
                  q: "Can I use rawcv on mobile?",
                  a: "Yes � rawcv is fully responsive. The chat, analysis, and download tools all work on mobile browsers. The split-panel layout on the Analyze page collapses to a single column on small screens."
                },
                {
                  q: "How accurate is the ATS score?",
                  a: "rawcv combines rule-based checks (missing sections, date formatting, keyword density) with AI analysis. The score is a strong indicator of ATS compatibility but is not a guarantee � different ATS platforms have different rules."
                },
                {
                  q: "Can I undo changes?",
                  a: "Yes. The Undo button in the Analyze and Chat pages reverts the last accepted change. You can undo multiple times to step back through your edit history."
                },
                {
                  q: "Do credits expire?",
                  a: "No. Credits never expire. Buy a pack and use it at your own pace."
                },
                {
                  q: "What AI models does rawcv use?",
                  a: "rawcv uses a mix of models from OpenAI, Anthropic, Google, and Together AI depending on the operation. Pro and Power credit packs unlock access to the most capable models."
                },
                {
                  q: "Can I create multiple versions of my resume?",
                  a: "Yes � use the Tailor tool to create a job-specific version for each application. Each tailored version can be downloaded as a separate PDF."
                },
                {
                  q: "How do I contact support?",
                  a: "Email us at support@rawcv.com. We typically respond within 24 hours on business days."
                },
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

          {/* CTA */}
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
