import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
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
  "ats-resume-formatting-guide": {
    title: "ATS Resume Formatting Guide: What Works and What Gets Rejected",
    description: "A deep dive into the exact formatting choices that help your resume pass ATS parsers — fonts, file types, margins, and layout decisions explained.",
    category: "ATS Optimization",
    date: "May 22, 2026",
    readTime: "5 min read",
    content: (
      <>
        <p>
          Getting past an Applicant Tracking System starts before you write a single bullet point — it starts with how you <em>format</em> the document. Even the best content will be invisible if the parser cannot read your file correctly. This guide covers the formatting decisions that matter most.
        </p>

        <h2>1. Font Choice Matters More Than You Think</h2>
        <p>
          Use standard system fonts such as <strong>Arial, Calibri, Helvetica,</strong> or <strong>Times New Roman</strong>. Avoid decorative or script fonts — they may look elegant but many older ATS engines cannot map non-standard font glyphs to readable text. Stick to a font size of 10 to 12 points for body text so the parser has no trouble extracting every character.
        </p>

        <h2>2. Margins and White Space</h2>
        <p>
          Set your page margins to at least 0.5 inches on all sides. Extremely narrow margins (under 0.3 inches) can cause text to be clipped or ignored during parsing. At the same time, do not waste precious space with oversized margins. A balance of 0.5 to 0.75 inches gives the parser enough room while maximizing content density.
        </p>

        <h2>3. File Naming Conventions</h2>
        <p>
          Believe it or not, your file name is the first piece of data the ATS reads. Use a clean, professional naming format like <strong>&quot;John_Doe_Resume_2026.pdf&quot;</strong>. Avoid special characters, underscores only, no spaces where possible, and do not use nicknames or unprofessional terms.
        </p>

        <h2>4. Headers and Footers Are Risky</h2>
        <p>
          Many ATS parsers skip content placed inside the header or footer area of a document. If you place your name, phone number, or email in the header, the system may never record it. Instead, embed your contact information at the very top of the main body area, flush left under your name.
        </p>
      </>
    ),
  },
  "resume-summary-examples": {
    title: "How to Write a Resume Summary That Gets Read",
    description: "Learn the structure of an effective professional summary or objective statement with real examples for different experience levels and industries.",
    category: "Resume Guide",
    date: "May 23, 2026",
    readTime: "4 min read",
    content: (
      <>
        <p>
          The professional summary at the top of your resume is the first thing both an ATS and a human recruiter scan. A strong summary can hook the reader in seconds, while a generic or vague one will cause them to move on. Here is how to write one that works.
        </p>

        <h2>1. The Three-Sentence Structure</h2>
        <p>
          A powerful summary follows a simple three-sentence pattern. Sentence one states who you are and your years of experience. Sentence two highlights your most impressive achievement or skill. Sentence three connects your expertise to the role you are applying for.
        </p>
        <p>
          <strong>Example:</strong> <em>&quot;Marketing professional with 5+ years of experience driving digital growth for SaaS companies. Increased organic traffic by 180% year-over-year through data-driven content strategies. Seeking to bring analytical creativity to the Senior Marketing Manager role at GrowthCorp.&quot;</em>
        </p>

        <h2>2. Tailor It to the Job Description</h2>
        <p>
          Never write a generic summary and reuse it for every application. Pull the top two or three keywords from the job description — such as <strong>&quot;cross-functional leadership,&quot;</strong> <strong>&quot;Python automation,&quot;</strong> or <strong>&quot;revenue forecasting&quot;</strong> — and work them naturally into your professional summary. This signals both the ATS and the recruiter that you match the role.
        </p>

        <h2>3. Fresher &amp; Career-Changer Formats</h2>
        <p>
          If you have less than two years of experience or are changing careers, use an <strong>objective statement</strong> instead of a summary. Focus on your motivation, transferable skills, and what you aim to contribute rather than your limited work history. Example: <em>&quot;Recent computer science graduate passionate about full-stack development with internship experience building REST APIs in Python and Node.js.&quot;</em>
        </p>
      </>
    ),
  },
  "best-free-resume-builders-2026": {
    title: "Best Free Resume Builders Compared for 2026",
    description: "A side-by-side comparison of the top free resume builders — features, ATS compatibility, templates, and export options to help you choose.",
    category: "Career Advice",
    date: "May 24, 2026",
    readTime: "6 min read",
    content: (
      <>
        <p>
          Not everyone wants to build a resume from scratch in a word processor. Free resume builders promise quick, professional results — but not all of them produce documents that pass ATS scanners or look good when printed. Here is how the top options compare in 2026.
        </p>

        <h2>1. rawcv — Best for ATS Optimization</h2>
        <p>
          rawcv offers a completely free builder that generates clean, single-column resumes optimized for both ATS parsers and human readers. It includes real-time ATS scoring, keyword matching against job descriptions, and export to PDF and DOCX. If your main priority is passing the automated screening stage, rawcv is the strongest choice.
        </p>

        <h2>2. Canva — Best for Visual Design</h2>
        <p>
          Canva provides hundreds of beautifully designed resume templates. However, many of these use multi-column layouts, icons, text boxes, and graphical elements that confuse ATS parsers. Use Canva only if you are applying to roles at small companies or creative agencies where a human reads every submission directly.
        </p>

        <h2>3. Google Docs Templates — The Simple Middle Ground</h2>
        <p>
          Google Docs offers basic but clean resume templates that you can edit collaboratively. The prose templates work well for ATS since they are single-column text documents. The main downside is the lack of built-in ATS scoring or keyword analysis tools — you will need to verify your formatting manually.
        </p>

        <h2>4. Zety — Feature-Rich but Paywalled</h2>
        <p>
          Zety has an impressive builder with many templates and real-time tips. The free tier lets you build a resume, but you must pay to download or export it as PDF. It is a good tool for drafting and iterating, but you will eventually need a subscription to get your final document out.
        </p>

        <h2>5. Novoresume — Decent Templates, Limited Free Export</h2>
        <p>
          Novoresume offers modern, visually appealing templates. Like Zety, downloading a PDF without watermarks requires a paid plan. The free version is useful for testing layouts and content, but keep in mind that some of its more elaborate designs are not ATS-friendly.
        </p>
      </>
    ),
  },
  "resume-skills-section-guide": {
    title: "Resume Skills Section: Hard Skills vs Soft Skills",
    description: "How to structure the skills section of your resume, distinguish between hard and soft skills, and prioritize what matters most to recruiters.",
    category: "Resume Guide",
    date: "May 25, 2026",
    readTime: "5 min read",
    content: (
      <>
        <p>
          The skills section of your resume is one of the most heavily scanned areas by both ATS software and human recruiters. Getting it right requires understanding the difference between hard skills and soft skills, and knowing which ones to feature most prominently.
        </p>

        <h2>1. Hard Skills: The Non-Negotiables</h2>
        <p>
          Hard skills are teachable, measurable abilities — programming languages, software tools, certifications, and technical processes. These are what ATS systems primarily look for. List them as a clean, scannable set of keywords. Examples include <strong>Python, SQL, Figma, Google Analytics, AutoCAD,</strong> or <strong>PMP certification</strong>.
        </p>
        <p>
          Group related hard skills together. For technical roles, create subcategories like <strong>Languages</strong>, <strong>Frameworks</strong>, <strong>Tools</strong>, and <strong>Platforms</strong> so the reader can quickly assess your breadth.
        </p>

        <h2>2. Soft Skills: Prove, Don&apos;t Claim</h2>
        <p>
          Soft skills like leadership, communication, problem-solving, and adaptability are harder for ATS to parse but critical for human reviewers. Instead of simply listing <em>&quot;Great communicator&quot;</em> in your skills section, weave these traits into your bullet points under work experience.
        </p>
        <p>
          <strong>Weak:</strong> <em>&quot;Excellent teamwork skills.&quot;</em><br />
          <strong>Strong:</strong> <em>&quot;Collaborated with a cross-functional team of 12 engineers, designers, and product managers to ship three major releases on schedule.&quot;</em>
        </p>

        <h2>3. How Many Skills to List</h2>
        <p>
          Aim for 8 to 12 hard skills and 3 to 5 soft skills referenced contextually in your experience bullets. Do not pad the list with outdated or irrelevant abilities just to fill space. Every skill on your resume should be one you can discuss confidently in an interview. Quality over quantity always wins.
        </p>

        <h2>4. Match Skills to the Job Description</h2>
        <p>
          Before submitting, compare the job description&apos;s required and preferred skills against your own list. If the JD mentions <strong>&quot;Agile methodologies&quot;</strong> and you have Agile experience but did not list it, add it. The closer your skill keyword coverage is to the job description, the higher your ATS match score will be.
        </p>
      </>
    ),
  },
  "fresher-resume-tips": {
    title: "Resume Tips for Freshers & Entry-Level Candidates",
    description: "Essential advice for students and recent graduates building a resume with limited work experience — focus on projects, internships, and transferable skills.",
    category: "Career Advice",
    date: "May 26, 2026",
    readTime: "5 min read",
    content: (
      <>
        <p>
          Building a resume with little or no professional work experience can feel intimidating — but every hiring manager knows that every experienced professional was once a fresher too. The key is to reframe what you <em>have</em> done as evidence of your potential.
        </p>

        <h2>1. Lead with Education and Projects</h2>
        <p>
          Without extensive work history, your education section becomes your anchor. List your degree, university, graduation year, and relevant coursework. Immediately below, add a <strong>Projects</strong> section. Describe 2 to 3 academic or personal projects with the same achievement-focused format that experienced professionals use for their work bullet points.
        </p>
        <p>
          <strong>Example:</strong> <em>&quot;Built a real-time chat application using React, Node.js, and Socket.io that supported 50+ concurrent users — deployed on AWS with CI/CD pipeline.&quot;</em>
        </p>

        <h2>2. Internships Count as Experience</h2>
        <p>
          Even a short internship or part-time job provides real experience. Treat each internship as you would a full-time role. Include your title, the company name, dates, and 3 to 5 bullet points describing what you accomplished. Focus on any measurable outcomes, no matter how small — saving time, assisting with a successful launch, or learning a new tool.
        </p>

        <h2>3. Highlight Extracurriculars and Leadership</h2>
        <p>
          Club memberships, volunteer work, sports teams, and student government roles all demonstrate soft skills like teamwork, initiative, and time management. Include them in a <strong>Leadership &amp; Activities</strong> section. If you held a position like <em>&quot;Treasurer of the Computer Science Society&quot;</em>, describe your responsibilities and any measurable outcomes.
        </p>

        <h2>4. Keep It to One Page</h2>
        <p>
          As a fresher, you almost certainly do not have enough content to justify a two-page resume. Recruiters spend about six to eight seconds on an initial screen — a single, well-organized page forces you to keep only the most relevant content, making their job easier and increasing your chances of advancing.
        </p>
      </>
    ),
  },
  "ats-vs-human-recruiter": {
    title: "ATS vs Human Recruiters: How to Satisfy Both",
    description: "Understand the competing priorities of automated screening systems and human hiring managers — and how to write a resume that pleases both.",
    category: "ATS Optimization",
    date: "May 27, 2026",
    readTime: "6 min read",
    content: (
      <>
        <p>
          One of the biggest frustrations in job hunting is the tug-of-war between writing for an ATS and writing for a human. An ATS wants clean, keyword-dense, single-column text. A human wants a compelling narrative with visual breathing room. Here is how to satisfy both without compromise.
        </p>

        <h2>1. The ATS Reads First, Then the Human</h2>
        <p>
          Understanding the order of operations is crucial. Your resume first passes through the ATS, which scores it based on keyword matches, formatting compatibility, and section structure. Only the top-scoring candidates are surfaced for human review. This means your document must pass the automated gatekeeper before anyone reads a single word.
        </p>

        <h2>2. Write for the Human, Optimize for the Machine</h2>
        <p>
          Start with compelling, narrative-driven bullet points written for a human audience — use strong action verbs and quantify results. Then, <em>layer in</em> relevant keywords from the job description without breaking the natural flow. A bullet like <em>&quot;Reduced cloud infrastructure costs by 28% using AWS Lambda and automated scaling policies&quot;</em> reads well for both a human and an ATS looking for <strong>AWS</strong> and <strong>automation</strong>.
        </p>

        <h2>3. Visual Appeal Within ATS Limits</h2>
        <p>
          You can still use subtle visual cues — bold text for job titles and company names, consistent spacing, and strategic use of horizontal rules — as long as they do not rely on tables, text boxes, or columns. A clean, minimal design with careful typography creates a professional appearance for humans while remaining perfectly parseable by machines.
        </p>

        <h2>4. The Goldilocks Resume</h2>
        <p>
          The ideal resume is neither too sparse (fails ATS keyword checks) nor too dense (overwhelms human readers). Aim for a keyword density of about 2% to 3% of total words — enough to signal relevance to the ATS without sounding like stuffed jargon to the human. Every keyword should appear in a natural, contextual sentence.
        </p>
      </>
    ),
  },
  "linkedin-profile-tips-2026": {
    title: "LinkedIn Profile Optimization Tips for 2026",
    description: "Optimize your LinkedIn profile to attract recruiters, rank higher in search results, and complement your resume with a strong professional brand.",
    category: "Career Advice",
    date: "May 28, 2026",
    readTime: "5 min read",
    content: (
      <>
        <p>
          Your LinkedIn profile is often the second thing a recruiter looks at after reading your resume. A well-optimized profile can attract inbound recruiter messages, improve your search ranking, and tell a more complete story about your professional brand. Here is how to optimize yours in 2026.
        </p>

        <h2>1. Your Headline Is Prime Real Estate</h2>
        <p>
          Do not settle for LinkedIn&apos;s default headline of <em>&quot;Job Title at Company Name&quot;</em>. Use all 220 available characters to describe what you do and who you help. Include your core skills and target role keywords. <strong>Example:</strong> <em>&quot;Full-Stack Developer | React, Node.js, Python | Building Scalable Web Applications | Open to Remote Opportunities&quot;</em>.
        </p>

        <h2>2. Optimize the About Section with Keywords</h2>
        <p>
          The About section is one of the most search-indexed areas of your profile. Write 3 to 4 short paragraphs that mirror your resume summary but go deeper. Weave in industry terms and skills that recruiters search for. End with a clear call to action — invite connection requests, mention you are open to roles, or link to your portfolio.
        </p>

        <h2>3. The Featured Section Is Your Portfolio</h2>
        <p>
          Use the Featured section at the top of your profile to pin your best work — a published article, a notable project, a link to your resume, or a recommendation. This section is the first thing recruiters see below your headline and About section, so make it count.
        </p>

        <h2>4. Recommendations and Endorsements Matter</h2>
        <p>
          Request recommendations from managers, colleagues, or professors who can speak specifically about your contributions. A generic recommendation is less effective than one that mentions concrete achievements. Actively endorse your network&apos;s skills — LinkedIn&apos;s algorithm takes reciprocity into account when ranking profiles.
        </p>

        <h2>5. Post Consistently to Stay Visible</h2>
        <p>
          LinkedIn&apos;s algorithm favors active users. Posting just once a week — sharing an industry insight, commenting on a trend, or reposting a relevant article — dramatically increases your profile views and search ranking. You do not need to be a content creator, but regular activity signals relevance to the platform.
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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "author": {
      "@type": "Organization",
      "name": "rawcv",
      "url": "https://www.rawcv.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "rawcv",
      "url": "https://www.rawcv.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.rawcv.com/logo.png"
      }
    },
    "datePublished": article.date,
    "dateModified": article.date,
    "image": {
      "@type": "ImageObject",
      "url": "https://www.rawcv.com/blog_illustration.png"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.rawcv.com/blog/${slug}`
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-16 px-6">
      <Script id="article-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
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