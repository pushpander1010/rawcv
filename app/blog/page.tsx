import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Guides & Resume Tips | rawcv",
  description: "Learn how to write ATS-friendly resumes, optimize keywords, and stand out in the application process with expert guides from rawcv.",
};

const POSTS = [
  {
    slug: "how-to-write-ats-friendly-resume",
    title: "How to Write an ATS-Friendly Resume in 2026",
    description: "Learn the exact formatting, section guidelines, and standards required to pass Applicant Tracking Systems (ATS) and land interviews.",
    category: "ATS Optimization",
    date: "May 20, 2026",
    readTime: "5 min read",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    slug: "quantifying-achievements-resume-examples",
    title: "Quantifying Achievements: Resume Examples & Action Verbs",
    description: "Upgrade your work experience from a list of daily responsibilities to a powerful showcase of quantified results and impact.",
    category: "Resume Guide",
    date: "May 18, 2026",
    readTime: "6 min read",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    slug: "resume-keywords-matcher-guide",
    title: "The Complete Guide to Job Description Matching",
    description: "Understand semantic matching, keyword density, and how to mirror job descriptions without stuffing keywords key phrases.",
    category: "Career Advice",
    date: "May 15, 2026",
    readTime: "4 min read",
    gradient: "from-emerald-500 to-teal-500",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-16">
          <div aria-hidden="true" className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="md:col-span-7 text-center md:text-left">
            <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 uppercase">
              rawcv Blog
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-gray-100">
              Guides &amp; Resume Strategy
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto md:mx-0">
              Practical advice to help you craft compelling resumes, beat applicant filters, and stand out in the modern job market.
            </p>
          </div>
          <div className="md:col-span-5 hidden md:block">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-violet-100 dark:border-violet-900/40 bg-white dark:bg-gray-900 p-1.5 transform hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="/blog_illustration.png" 
                alt="rawcv Blog & Resume Strategy Illustration" 
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block relative bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
            >
              {/* Card visual banner */}
              <div className={`w-full aspect-[16/10] rounded-2xl bg-gradient-to-br ${post.gradient} mb-5 flex items-center justify-center relative overflow-hidden shadow-inner`}>
                {/* Background grid pattern or glow */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                <div className="absolute w-32 h-32 rounded-full bg-white/20 blur-2xl -top-10 -right-10" />
                
                {/* Emojis that represent the category/post */}
                <span className="text-4xl filter drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">
                  {post.slug === "how-to-write-ats-friendly-resume" && "📄"}
                  {post.slug === "quantifying-achievements-resume-examples" && "📈"}
                  {post.slug === "resume-keywords-matcher-guide" && "🎯"}
                </span>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400">
                  {post.category}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {post.date}
                </span>
              </div>

              <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                {post.title}
              </h2>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 mb-4">
                {post.description}
              </p>

              <div className="mt-auto flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400">
                Read Article
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Links */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-400 flex flex-wrap gap-4 justify-center">
          <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Home</Link>
          <Link href="/build" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Free Builder</Link>
          <Link href="/about" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Contact</Link>
          <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Privacy</Link>
        </div>
      </div>
    </main>
  );
}
