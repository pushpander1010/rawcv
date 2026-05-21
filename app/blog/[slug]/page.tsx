import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const ARTICLES: Record<
  string,
  {
    title: string;
    description: string;
    category: string;
    date: string;
    readTime: string;
    content: React.ReactNode;
  }
> = {
  "how-to-write-ats-friendly-resume": {
    title: "How to Write an ATS-Friendly Resume in 2026",
    description: "Learn the exact formatting, section guidelines, and standards required to pass Applicant Tracking Systems (ATS) and land interviews.",
    category: "ATS Optimization",
    date: "May 20, 2026",
    readTime: "5 min read",
    content: (
      <>
        <p>
          More than 75% of resumes are filtered out by Applicant Tracking Systems (ATS) before they are ever reviewed by a human recruiter. Understanding how these tools parse and score documents is essential to modern job hunting.
        </p>

        <h2>1. Keep Layouts to a Single Column</h2>
        <p>
          Multi-column resumes may look visually interesting to humans, but many older or simpler ATS parsers read across the entire width of the page instead of reading column by column. This results in jumbled text where experience from Company A merges with skills from Company B. 
        </p>
        <p>
          Always use a clean, single-column design. It guarantees that the parser reads your content in the chronological order you intended.
        </p>

        <h2>2. Avoid Tables, Text Boxes, and Graphics</h2>
        <p>
          Never put crucial details—like your contact information, credentials, or skills—inside tables or text boxes. Many ATS parsers completely ignore text blocks enclosed inside shapes or graphic containers. Similarly, do not use icons or visual symbols (like star ratings for skills) because parsers cannot translate them into database values.
        </p>

        <h2>3. Use Standard, Clear Section Headings</h2>
        <p>
          Stick to standard terminology for your major headers. Instead of writing <em>&quot;My Professional Path&quot;</em> or <em>&quot;Tools of the Trade&quot;</em>, use standard titles like:
        </p>
        <ul>
          <li><strong>Work Experience</strong> (or Professional Experience)</li>
          <li><strong>Education</strong></li>
          <li><strong>Skills</strong></li>
          <li><strong>Projects</strong></li>
        </ul>
        <p>
          ATS software uses these exact keywords to index your CV. If it doesn&apos;t recognize a heading, it may drop that entire section&apos;s contents.
        </p>

        <h2>4. Use Common, Search-Friendly File Formats</h2>
        <p>
          Always save your resume as a text-based PDF or DOCX file. Make sure the PDF contains actual text characters rather than rasterized images. (You can verify this by trying to highlight and copy-paste text inside your PDF viewer. If you cannot select the text, an ATS will not be able to scan it either).
        </p>
      </>
    ),
  },
  "quantifying-achievements-resume-examples": {
    title: "Quantifying Achievements: Resume Examples & Action Verbs",
    description: "Upgrade your work experience from a list of daily responsibilities to a powerful showcase of quantified results and impact.",
    category: "Resume Guide",
    date: "May 18, 2026",
    readTime: "6 min read",
    content: (
      <>
        <p>
          A weak resume describes duties. A strong resume describes achievements. Recruiters and hiring managers want to know the tangible business results of your actions, not just what was on your daily to-do list.
        </p>

        <h2>1. Use Google&apos;s X-Y-Z Formula</h2>
        <p>
          Google famously recommends writing bullet points using this structure: <strong>&quot;Accomplished [X], as measured by [Y], by doing [Z].&quot;</strong>
        </p>
        <p>
          Instead of writing: <em>&quot;Responsible for company website and social media profiles.&quot;</em>
        </p>
        <p>
          Write: <strong>&quot;Increased website traffic by 34% (X) as measured by Google Analytics (Y) by redesigning page layouts and optimizing search engine visibility (Z).&quot;</strong>
        </p>

        <h2>2. Quantify Even if You Don&apos;t Have Big Sales Numbers</h2>
        <p>
          Many job seekers think they can&apos;t quantify their work because they don&apos;t work in sales or directly manage revenue. However, you can always measure:
        </p>
        <ul>
          <li><strong>Time:</strong> How many hours did you save? How much faster was the system after you optimized it?</li>
          <li><strong>Scale:</strong> How many users, clients, or files did you support? What was the size of the codebase or team?</li>
          <li><strong>Quality:</strong> Did you reduce bug reports? Did user ratings go up?</li>
        </ul>

        <h2>3. Lead with Strong Action Verbs</h2>
        <p>
          Start every bullet point with a powerful, active verb. Avoid weak phrases like <em>&quot;Assisted with...&quot;</em>, <em>&quot;Participated in...&quot;</em>, or <em>&quot;Helped to...&quot;</em>. Use verbs that imply leadership and execution:
        </p>
        <ul>
          <li><strong>Designed, Engineered, Developed:</strong> Great for builders and technical experts.</li>
          <li><strong>Accelerated, Decreased, Optimized:</strong> Demonstrates process improvement.</li>
          <li><strong>Authored, Mentored, Directed:</strong> Highlights communications and leadership.</li>
        </ul>
      </>
    ),
  },
  "resume-keywords-matcher-guide": {
    title: "The Complete Guide to Job Description Matching",
    description: "Understand semantic matching, keyword density, and how to mirror job descriptions without stuffing keywords key phrases.",
    category: "Career Advice",
    date: "May 15, 2026",
    readTime: "4 min read",
    content: (
      <>
        <p>
          Matching your resume to a job description isn&apos;t about rewriting your history—it&apos;s about speaking the same vocabulary as the employer. If a recruiter lists &quot;Customer Relationship Management&quot; as a core requirement, and your resume only says &quot;Sales Client Software,&quot; you might get rejected simply because of terms.
        </p>

        <h2>1. Exact Keyword Matches Matter</h2>
        <p>
          Many Applicant Tracking Systems run basic string-matching algorithms. They look for exact matches of terms. If the JD requires <strong>&quot;React.js&quot;</strong> and you only write <strong>&quot;React&quot;</strong>, or the JD lists <strong>&quot;Project Management Professional (PMP)&quot;</strong> and you only write <strong>&quot;PMP certified&quot;</strong>, the scanner might count them as separate, unrelated terms. Always try to match the exact spelling and naming conventions used in the job description.
        </p>

        <h2>2. Focus on Core Skills in the First Half</h2>
        <p>
          The top third of your resume is prime real estate. Make sure the most critical skills, tools, and platforms mentioned in the job description appear near the top—either in a dedicated &quot;Skills&quot; panel or in a &quot;Summary of Qualifications&quot; paragraph. This immediately grabs the attention of both the computer system and the hiring manager.
        </p>

        <h2>3. Avoid Keyword Stuffing</h2>
        <p>
          Do not copy-paste lines of keywords into your resume footer in tiny white text to game the system. Modern ATS systems parse files to plain text and flag white-text stuffing automatically. Furthermore, if you pass the scanner but a human reviewer sees a block of list words that don&apos;t fit contextually, they will reject your application instantly. Ensure all matched keywords fit naturally within the context of your achievements.
        </p>
      </>
    ),
  },
};

export async function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) return {};
  return {
    title: `${article.title} | rawcv Blog`,
    description: article.description,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = ARTICLES[slug];

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-16 px-6">
      <article className="max-w-2xl mx-auto">
        {/* Navigation back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline mb-8"
        >
          ← Back to Blog
        </Link>

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400">
              {article.category}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {article.date} · {article.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            {article.title}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
            {article.description}
          </p>

          {/* Article Cover Image */}
          <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden border border-violet-100 dark:border-violet-900/40 shadow-lg bg-gradient-to-br from-violet-100 via-purple-50 to-blue-50 dark:from-violet-950/20 dark:via-purple-950/10 dark:to-blue-950/10 flex items-center justify-center p-6">
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]" />
            <img 
              src="/blog_illustration.png" 
              alt={article.title} 
              className="w-auto h-full max-h-40 sm:max-h-48 object-contain rounded-2xl transform hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        </header>

        {/* Article Body */}
        <div className="font-serif prose prose-gray dark:prose-invert max-w-none text-base leading-relaxed space-y-6 text-gray-755 dark:text-gray-300">
          {article.content}
        </div>

        {/* Call to action footer */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 border border-violet-100 dark:border-violet-850 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Put these tips into action
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Use rawcv to build a clean, single-column resume, check its ATS score, and match it against any job description for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/build"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Start Free Builder
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Upload &amp; Analyze
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
