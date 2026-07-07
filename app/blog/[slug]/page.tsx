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
  "resume-format-for-germany": {
    title: "Resume Format for Germany: A Complete Guide (Lebenslauf)",
    description: "Everything you need to know about the German Lebenslauf: mandatory photo, detailed personal info, reverse-chronological format, and formal conventions that German recruiters expect.",
    category: "International",
    date: "Jul 7, 2026",
    readTime: "6 min read",
    content: (
      <>
        <p>
          The German resume, known as a <strong>Lebenslauf</strong>, follows strict conventions that differ significantly from US, UK, or Indian formats. German recruiters expect a formal, detailed, and photo-inclusive CV. Getting the format wrong can cost you an interview before your qualifications are even considered.
        </p>
        <p>
          Germany has one of the most structured CV formats in the world. While a US resume focuses on brevity and achievement metrics, a German Lebenslauf emphasizes completeness, formality, and personal transparency. Understanding these differences is essential if you are applying to jobs in Germany, Austria, or German-speaking Switzerland.
        </p>

        <h2>CV vs Resume: What Germans Expect</h2>
        <p>
          In Germany, the terms <strong>Lebenslauf</strong> (resume/CV) and <strong>Bewerbung</strong> (application) are used interchangeably, but the expectations are specific. A German application typically includes:
        </p>
        <ul>
          <li><strong>Deckblatt (Cover Page):</strong> Optional but common — a clean first page with your name, photo, and the position you are applying for</li>
          <li><strong>Anschreiben (Cover Letter):</strong> A formal letter addressed to the hiring manager, explaining why you want this specific role</li>
          <li><strong>Lebenslauf (CV):</strong> Your detailed resume following strict format conventions</li>
          <li><strong>Zeugnisse (Certificates):</strong> Copies of degree certificates, work references, and training certificates</li>
        </ul>
        <p>
          Unlike the US where a single-page resume is sufficient, German employers expect a <strong>complete documentation package</strong>. Your Lebenslauf is just one part of this.
        </p>

        <h2>1. The Photo Is Mandatory</h2>
        <p>
          A professional photo is <strong>expected</strong> on every German resume. This is non-negotiable. German recruiters consider a photo an essential part of the application — omitting one signals that you do not understand local conventions or are not serious about the role.
        </p>
        <p>
          <strong>Photo requirements:</strong>
        </p>
        <ul>
          <li>Passport-style headshot (not a selfie, not a casual photo)</li>
          <li>Neutral or light-colored background</li>
          <li>Professional attire (business casual or formal)</li>
          <li>Recent — within the last 2 years</li>
          <li>Face should occupy about 70-80% of the frame</li>
          <li>No sunglasses, hats, or heavy filters</li>
        </ul>
        <p>
          The photo is typically placed in the <strong>top-right corner</strong> of the first page, about 4.5cm x 6cm in size. Some candidates use a separate Deckblatt with a larger photo instead.
        </p>

        <h2>2. Personal Details Are Required</h2>
        <p>
          German CVs must include personal information that would be considered inappropriate or even illegal to ask for in the US or Canada. This is standard in Germany and omitting these details can hurt your application:
        </p>
        <ul>
          <li><strong>Full name:</strong> First name, middle name (if applicable), last name</li>
          <li><strong>Date of birth:</strong> DD.MM.YYYY format (e.g., 15.03.1992)</li>
          <li><strong>Place of birth:</strong> City and country</li>
          <li><strong>Nationality:</strong> Your citizenship(s)</li>
          <li><strong>Marital status:</strong> Single, married, divorced, or &quot;in a partnership&quot;</li>
          <li><strong>Full address:</strong> Street, postal code, city</li>
          <li><strong>Phone number:</strong> Include country code (e.g., +49 for Germany)</li>
          <li><strong>Email address:</strong> Professional email only</li>
        </ul>
        <p>
          While EU anti-discrimination directives technically prohibit asking for some of this information, German employers still expect it, and most German CV templates include these fields by default. Not providing them can make your application look incomplete.
        </p>

        <h2>3. Reverse-Chronological Order with Exact Dates</h2>
        <p>
          Germany uses strict reverse-chronological order for both education and work experience. Start with the most recent and work backward. But the key difference from US resumes is the <strong>level of date precision</strong> required:
        </p>
        <ul>
          <li><strong>US format:</strong> &quot;2020 — Present&quot; or &quot;2018 — 2020&quot;</li>
          <li><strong>German format:</strong> &quot;03/2020 — heute&quot; (03/2020 — present) or &quot;09/2018 — 02/2020&quot;</li>
        </ul>
        <p>
          Every position, education entry, and training period must include <strong>exact month and year</strong> for both start and end dates. Gaps in the timeline are scrutinized — if you took a 6-month career break, mention it (e.g., &quot;06/2021 — 11/2021: Sabbatical / Travel&quot;).
        </p>

        <h2>4. Keep It Formal and Detailed</h2>
        <p>
          German recruiters value thoroughness over brevity. A <strong>2-3 page CV</strong> is perfectly acceptable, even expected for experienced professionals. This is a major difference from the US 1-page preference.
        </p>
        <p>
          For each work experience entry, include:
        </p>
        <ul>
          <li>Company name and location</li>
          <li>Your exact job title</li>
          <li>Employment period (month/year to month/year)</li>
          <li>3-6 bullet points describing responsibilities and achievements</li>
          <li>Specific technologies, methodologies, or tools used</li>
        </ul>
        <p>
          German recruiters prefer <strong>detailed descriptions</strong> over ultra-concise bullets. Instead of &quot;Managed team of 5,&quot; write &quot;Led a cross-functional team of 5 software developers and 2 QA engineers in an Agile/Scrum environment, delivering 3 major product releases within 12 months.&quot;
        </p>

        <h2>5. Section Order for German CVs</h2>
        <p>
          Follow this exact order for maximum compatibility with German recruiters and ATS systems:
        </p>
        <ul>
          <li><strong>Persönliche Daten (Personal Information):</strong> Name, DOB, place of birth, nationality, marital status, address, phone, email</li>
          <li><strong>Berufserfahrung (Work Experience):</strong> Reverse chronological with exact dates, detailed descriptions</li>
          <li><strong>Bildung (Education):</strong> Reverse chronological with exact dates, thesis topics if relevant</li>
          <li><strong>Ausbildung / Weiterbildung (Training / Continuing Education):</strong> Additional certifications, workshops, language courses</li>
          <li><strong>Kenntnisse und Fähigkeiten (Skills):</strong> Languages (with CEFR levels), technical skills, software proficiency</li>
          <li><strong>Sonstiges (Other):</strong> Volunteer work, interests, hobbies (only if relevant)</li>
          <li><strong>Ort, Datum, Unterschrift (Place, Date, Signature):</strong> Handwritten signature at the bottom</li>
        </ul>

        <h2>6. Include a Handwritten Signature</h2>
        <p>
          Many German employers expect a <strong>handwritten signature</strong> at the bottom of the CV, along with the current date and place. This is a formal convention that signals professionalism. If you are applying digitally, a scanned signature image is acceptable.
        </p>
        <p>
          The signature line typically appears at the bottom-right of the last page:
        </p>
        <p>
          <em>München, 07.07.2026</em><br />
          <em>[Handwritten Signature]</em>
        </p>

        <h2>7. Language Proficiency: CEFR Levels</h2>
        <p>
          German employers expect language skills to be listed using <strong>CEFR levels</strong> (A1-C2) or the German equivalent (Grundstufe, Mittelstufe, etc.). For each language, specify:
        </p>
        <ul>
          <li><strong>German:</strong> Your level is critical — B2+ is usually required for professional roles, C1+ for client-facing positions</li>
          <li><strong>English:</strong> Required for most international companies</li>
          <li><strong>Other languages:</strong> Include any additional languages with proficiency levels</li>
        </ul>
        <p>
          Be honest about your German level. If you are applying from outside Germany, mention your current level and your willingness to improve (e.g., &quot;German: B1 (currently attending B2 course)&quot;).
        </p>

        <h2>8. Common Mistakes to Avoid</h2>
        <ul>
          <li><strong>Omitting the photo:</strong> This is the #1 mistake international applicants make. Always include a professional headshot.</li>
          <li><strong>Using US-style brevity:</strong> A one-page resume with minimal detail looks incomplete to German recruiters.</li>
          <li><strong>Including vague dates:</strong> &quot;2020 — Present&quot; is not specific enough. Use &quot;03/2020 — heute&quot;</li>
          <li><strong>Skipping the signature:</strong> Many employers expect a handwritten signature at the bottom. Include it.</li>
          <li><strong>Writing in English when German is expected:</strong> Unless the job posting is in English, write your Lebenslauf in German.</li>
          <li><strong>Using creative fonts or layouts:</strong> Stick to clean, professional formatting. No columns, no icons, no colors.</li>
          <li><strong>Ignoring the Anschreiben:</strong> The cover letter is mandatory in Germany. Never send a Lebenslauf without one.</li>
        </ul>

        <h2>9. Tips for English-Language Applications</h2>
        <p>
          If you are applying to an international company in Germany (e.g., a startup or a multinational), the application may be in English. In that case:
        </p>
        <ul>
          <li>You can skip the photo (but including one is still appreciated)</li>
          <li>Personal details become optional — but include them if comfortable</li>
          <li>Use &quot;CV&quot; or &quot;Resume&quot; instead of &quot;Lebenslauf&quot;</li>
          <li>Still follow reverse-chronological order with exact dates</li>
          <li>Still include the signature if possible</li>
          <li>Write the Anschreiben in English, mirroring the language of the job posting</li>
        </ul>
        <p>
          Even in English-language applications, German employers expect more detail than US employers. A one-page resume will still look thin. Aim for 2 pages with comprehensive descriptions.
        </p>
      </>
    ),
  },
  "software-engineer-resume-guide-2026": {
    title: "How to Write a Software Engineer Resume in 2026",
    description: "Craft a winning software engineer resume with the right technical skills, project highlights, and ATS-optimized formatting.",
    category: "Role Guide",
    date: "Jul 7, 2026",
    readTime: "7 min read",
    content: (
      <>
        <p>
          Software engineering resumes face a unique challenge: you need to demonstrate both technical depth and business impact. Hiring managers and ATS systems scan for specific technologies, quantified achievements, and clean formatting. Here is how to build a resume that passes both filters.
        </p>
        <p>
          The average tech job posting receives <strong>250+ applications</strong>. Recruiters spend about 6-7 seconds on the initial scan. Your resume must immediately signal: (1) you have the right technical skills, (2) you have shipped real products, and (3) you can communicate impact clearly.
        </p>

        <h2>1. Lead with a Technical Summary</h2>
        <p>
          Your summary should immediately signal your stack and seniority. This is the first thing both ATS and human recruiters read. Make it count.
        </p>
        <p>
          <strong>Weak:</strong> <em>&quot;Experienced software developer looking for new opportunities in a dynamic environment.&quot;</em>
        </p>
        <p>
          <strong>Strong:</strong> <em>&quot;Full-stack engineer with 6 years building scalable React/Node.js applications. Architected a microservices platform that handled 10M+ daily API requests with 99.99% uptime. Led a team of 4 engineers to deliver a real-time analytics dashboard used by 50K+ users.&quot;</em>
        </p>
        <p>
          The strong version names specific technologies, mentions scale (10M+ requests, 99.99% uptime), and shows leadership. This immediately tells the recruiter: this person can build systems at scale and lead teams.
        </p>

        <h2>2. Structure Experience Around Impact</h2>
        <p>
          Each bullet should follow: <strong>What you built/led + the technical approach + the business result</strong>. Avoid listing technologies without context — recruiters want to see outcomes, not tool lists.
        </p>
        <p>
          <strong>Weak bullets:</strong>
        </p>
        <ul>
          <li><em>&quot;Used React, Node.js, and PostgreSQL for web development&quot;</em></li>
          <li><em>&quot;Worked on the backend API&quot;</em></li>
          <li><em>&quot;Responsible for maintaining the codebase&quot;</em></li>
        </ul>
        <p>
          <strong>Strong bullets:</strong>
        </p>
        <ul>
          <li><em>&quot;Built a real-time collaboration feature using React, WebSockets, and PostgreSQL that increased user engagement by 42% and reduced support tickets by 30%&quot;</em></li>
          <li><em>&quot;Designed and implemented a REST API gateway using Node.js and Express that handled 5K requests/second with sub-100ms latency, replacing a legacy SOAP service&quot;</em></li>
          <li><em>&quot;Led migration of monolithic application to microservices architecture (Docker, Kubernetes, AWS ECS), reducing deployment time from 45 minutes to 3 minutes and cutting infrastructure costs by 35%&quot;</em></li>
        </ul>
        <p>
          Notice how every strong bullet starts with an action verb (Built, Designed, Led), names the specific technologies, and ends with a measurable business outcome.
        </p>

        <h2>3. Skills: Group by Category</h2>
        <p>
          Organize skills into clear categories. This helps both ATS parsers and human recruiters quickly assess your fit. A flat list of 30 technologies is harder to scan than a categorized list.
        </p>
        <ul>
          <li><strong>Languages:</strong> Python, JavaScript, TypeScript, Go, SQL</li>
          <li><strong>Frontend:</strong> React, Next.js, Vue.js, Tailwind CSS, Redux</li>
          <li><strong>Backend:</strong> Node.js, Express, Django, FastAPI, GraphQL</li>
          <li><strong>Infrastructure:</strong> AWS (EC2, S3, Lambda, ECS), Docker, Kubernetes, Terraform</li>
          <li><strong>Databases:</strong> PostgreSQL, MongoDB, Redis, Elasticsearch</li>
          <li><strong>Tools:</strong> Git, CI/CD (GitHub Actions, Jenkins), Datadog, Sentry</li>
        </ul>
        <p>
          <strong>Pro tip:</strong> Mirror the exact technology names from the job description. If they write &quot;React.js&quot; not &quot;React,&quot; use their spelling. ATS systems do keyword matching, and minor differences can cost you a match.
        </p>

        <h2>4. Projects Matter — Especially for Mid-Level Engineers</h2>
        <p>
          Include 2-3 personal or open-source projects with links. This is especially important if you are between jobs or transitioning to a new stack. For each project, describe the problem, tech stack, and outcome.
        </p>
        <p>
          <strong>Example:</strong>
        </p>
        <ul>
          <li><strong>OpenSource CLI Tool</strong> — <em>Go, Cobra, SQLite</em></li>
          <li>Built a CLI tool for automating database migrations that gained 1.2K GitHub stars. Handles schema diffing, backward-compatible migrations, and rollback support. Used by 3 production teams at my previous company.</li>
        </ul>
        <p>
          GitHub links, live demos, published npm packages, or conference talks all count as strong signals. Make sure your GitHub profile is clean with pinned repositories and good READMEs.
        </p>

        <h2>5. What Recruiters Actually Look For</h2>
        <p>
          Based on interviews with 50+ tech recruiters and hiring managers, here is what they prioritize:
        </p>
        <ul>
          <li><strong>Scale and impact:</strong> How many users did you serve? What revenue did you drive? What costs did you cut?</li>
          <li><strong>Technical depth:</strong> Can you go beyond surface-level usage? Do you understand trade-offs?</li>
          <li><strong>Communication:</strong> Can you explain technical decisions clearly? Your resume is the first test.</li>
          <li><strong>Ownership:</strong> Did you lead initiatives? Make architectural decisions? Mentor others?</li>
          <li><strong>Learning velocity:</strong> Are you picking up new technologies and applying them effectively?</li>
        </ul>

        <h2>6. ATS Tips for Engineers</h2>
        <p>
          Tech companies use ATS systems heavily. Here is how to optimize:
        </p>
        <ul>
          <li><strong>Use standard section headings:</strong> &quot;Work Experience&quot; not &quot;My Journey&quot; or &quot;Career Highlights&quot;</li>
          <li><strong>Include exact technology names:</strong> &quot;TypeScript&quot; not &quot;TS&quot;, &quot;Kubernetes&quot; not &quot;K8s&quot;</li>
          <li><strong>Use a single-column layout:</strong> Multi-column resumes confuse ATS parsers</li>
          <li><strong>Save as text-based PDF:</strong> Avoid image-based PDFs or DOCX files that reflow</li>
          <li><strong>No tables or graphics:</strong> ATS cannot parse tables, charts, or skill bars</li>
          <li><strong>Mirror the job description:</strong> If they mention &quot;CI/CD pipelines,&quot; use that exact phrase</li>
        </ul>

        <h2>7. Template Structure</h2>
        <p>
          Follow this exact structure for a software engineer resume:
        </p>
        <ul>
          <li><strong>Contact:</strong> Name, email, phone, city, LinkedIn, GitHub, portfolio URL</li>
          <li><strong>Summary:</strong> 2-3 lines — years of experience + stack + biggest achievement</li>
          <li><strong>Experience:</strong> Reverse chronological, 3-5 bullets per role, action verb + task + result</li>
          <li><strong>Projects:</strong> 2-3 projects with links, technologies, and outcomes</li>
          <li><strong>Skills:</strong> Categorized by type, mirroring job description keywords</li>
          <li><strong>Education:</strong> Degree, institution, year. GPA only if 3.5+ and recent grad</li>
          <li><strong>Certifications:</strong> AWS, GCP, Kubernetes, etc. (only if relevant)</li>
        </ul>

        <h2>8. Keep It to 1-2 Pages</h2>
        <p>
          One page for early career (0-4 years). Two pages for senior engineers (5+ years) with significant project history. Never exceed two pages — recruiters spend an average of 7 seconds on initial scans. If you cannot fit it in 2 pages, you are including too much.
        </p>
        <p>
          Use a 10-11pt font (Arial, Calibri, or Inter), 0.5-0.75 inch margins, and consistent formatting. Save as PDF to preserve layout across devices.
        </p>
      </>
    ),
  },
  "indian-resume-vs-us-resume": {
    title: "Indian Resume vs US Resume: 10 Key Differences",
    description: "Confused about how Indian resumes differ from US resumes? This side-by-side comparison covers photo, personal details, length, format, and cultural expectations.",
    category: "International",
    date: "Jul 7, 2026",
    readTime: "5 min read",
    content: (
      <>
        <p>
          Indian and US resumes follow <strong>fundamentally different conventions</strong>. What is standard in India — photo, personal details, 3-page length — is considered unprofessional or even illegal to include in the US. Understanding these differences is critical if you are an Indian professional applying to US companies, or a recruiter working with international candidates.
        </p>
        <p>
          The differences stem from <strong>cultural and legal context</strong>. India&apos;s hiring culture values completeness and personal transparency — employers expect to know who you are as a person. The US, shaped by anti-discrimination laws and ATS technology, values brevity, neutrality, and machine-readability.
        </p>

        <h2>1. Photo</h2>
        <p>
          <strong>India:</strong> A professional headshot is <strong>common and expected</strong>. Most Indian resume templates include a photo in the top-right corner. Recruiters expect to see your face, and omitting a photo can make your application look incomplete.
        </p>
        <p>
          <strong>US:</strong> <strong>Never include a photo</strong> on a US resume. It can trigger unconscious bias claims, violate anti-discrimination norms, and confuse ATS parsers. Even on LinkedIn, the photo is separate from the resume.
        </p>
        <p>
          <strong>Why the difference?</strong> US employment law (Title VII of the Civil Rights Act) prohibits discrimination based on race, gender, age, and other protected characteristics. Including a photo gives employers information they legally cannot use in hiring decisions. India does not have equivalent legislation covering resume photos.
        </p>

        <h2>2. Personal Details</h2>
        <p>
          <strong>India:</strong> Indian resumes often include <strong>extensive personal information</strong>: date of birth, father&apos;s name, gender, marital status, passport number, nationality, and sometimes even religion or caste (though this is increasingly discouraged).
        </p>
        <p>
          <strong>US:</strong> Only include <strong>name, email, phone number, city/state, and LinkedIn URL</strong>. Never include DOB, gender, marital status, nationality, or any other personal detail. These are considered private and irrelevant to your qualifications.
        </p>
        <p>
          <strong>Why the difference?</strong> Indian companies historically used personal details for background verification and cultural fit assessment. US companies rely on background checks conducted after an offer is made, not during the resume screening stage.
        </p>

        <h2>3. Resume Length</h2>
        <p>
          <strong>India:</strong> <strong>2-3 pages is standard</strong>, especially for experienced professionals. Indian resumes tend to be comprehensive, covering education, experience, skills, projects, certifications, and personal details in detail.
        </p>
        <p>
          <strong>US:</strong> <strong>1 page preferred</strong> for early-mid career (0-10 years). <strong>2 pages maximum</strong> for senior professionals. Recruiters spend an average of 7.4 seconds on initial scans — brevity is essential.
        </p>

        <h2>4. Section Order</h2>
        <p>
          <strong>India:</strong> Personal Details → Career Objective → Education → Work Experience → Technical Skills → Projects → Certifications → Personal Interests
        </p>
        <p>
          <strong>US:</strong> Contact Information → Professional Summary → Work Experience → Education → Skills → (Optional: Certifications, Projects)
        </p>
        <p>
          Notice that education comes <strong>before experience</strong> in Indian resumes (especially for freshers), while US resumes put experience first (unless you are a recent graduate). The US format also leads with a summary, not an objective.
        </p>

        <h2>5. Education Placement</h2>
        <p>
          <strong>India:</strong> Education is often the <strong>first major section</strong> after personal details, reflecting the high value placed on academic credentials in Indian hiring culture. Include: degree, institution, university, graduation year, percentage/GPA, and relevant coursework.
        </p>
        <p>
          <strong>US:</strong> Education comes <strong>after work experience</strong> (unless you are a recent graduate). Keep it brief: degree, institution, year. GPA only if 3.5+ and within the last 3 years. No coursework listing unless directly relevant.
        </p>

        <h2>6. Bullet Point Style</h2>
        <p>
          <strong>India:</strong> Descriptive and detailed — explains responsibilities thoroughly. Indian resumes often read like job descriptions, listing all duties performed.
        </p>
        <p>
          <strong>US:</strong> <strong>Achievement-first</strong> — every bullet starts with an action verb and includes quantified results. US resumes focus on impact, not duties.
        </p>
        <p>
          <strong>Weak (Indian style):</strong> <em>&quot;Responsible for managing the sales team and achieving quarterly targets&quot;</em>
        </p>
        <p>
          <strong>Strong (US style):</strong> <em>&quot;Led a 12-person sales team that exceeded quarterly targets by 23%, generating $2.4M in new revenue&quot;</em>
        </p>

        <h2>7. Skills Format</h2>
        <p>
          <strong>India:</strong> Often a <strong>detailed technical skills table or grid</strong> listing technologies, proficiency levels, and years of experience. Tables are common and accepted.
        </p>
        <p>
          <strong>US:</strong> A <strong>clean list grouped by category</strong>. No tables (ATS-unfriendly). Just list the technologies, organized by type (Languages, Frameworks, Tools, Databases).
        </p>

        <h2>8. References</h2>
        <p>
          <strong>India:</strong> Sometimes included directly on the resume, or noted as &quot;available on request.&quot;
        </p>
        <p>
          <strong>US:</strong> <strong>Never included</strong> on the resume. Do not even write &quot;References available upon request&quot; — it wastes space and is assumed.
        </p>

        <h2>9. Hobbies & Interests</h2>
        <p>
          <strong>India:</strong> Often included at the end of the resume. Common entries include reading, traveling, blogging, and sports.
        </p>
        <p>
          <strong>US:</strong> <strong>Only include if directly relevant to the role.</strong> &quot;Reading&quot; and &quot;traveling&quot; are too generic. Only mention hobbies that demonstrate skills or cultural fit (e.g., &quot;Open-source contributor,&quot; &quot;Hackathon organizer&quot;).
        </p>

        <h2>10. File Format</h2>
        <p>
          <strong>India:</strong> Both PDF and DOCX are accepted. Many recruiters still prefer DOCX for easy editing.
        </p>
        <p>
          <strong>US:</strong> <strong>PDF preferred</strong> — it preserves formatting across all devices and ATS systems. Never submit a DOCX unless specifically requested.
        </p>

        <h2>How to Convert Your Indian Resume for US Applications</h2>
        <p>
          If you are an Indian professional applying to US companies, follow these steps:
        </p>
        <ul>
          <li><strong>Remove the photo</strong> entirely — crop it out or use a text-only template</li>
          <li><strong>Strip personal details</strong> — remove DOB, father&apos;s name, gender, marital status, passport number</li>
          <li><strong>Trim to 1-2 pages</strong> — cut the least relevant experiences and consolidate similar roles</li>
          <li><strong>Replace objectives with a summary</strong> — &quot;Seeking a challenging role&quot; → &quot;Software engineer with 5 years experience building scalable microservices&quot;</li>
          <li><strong>Quantify every bullet</strong> — add numbers, percentages, and dollar amounts to show impact</li>
          <li><strong>Reorder sections</strong> — Contact → Summary → Experience → Education → Skills</li>
          <li><strong>Remove tables</strong> — replace skills tables with clean categorized lists</li>
          <li><strong>Remove references</strong> — delete the references section entirely</li>
          <li><strong>Save as PDF</strong> — ensure formatting is preserved</li>
        </ul>
        <p>
          The key mindset shift: US resumes are <strong>marketing documents</strong>, not comprehensive records. Every line should earn its place by demonstrating value to the employer.
        </p>
      </>
    ),
  },
  "best-resume-format-for-freshers-2026": {
    title: "Best Resume Format for Freshers in 2026",
    description: "No experience? No problem. The best resume formats for freshers, students, and entry-level candidates — with examples, templates, and ATS tips.",
    category: "Career Advice",
    date: "Jul 7, 2026",
    readTime: "5 min read",
    content: (
      <>
        <p>
          As a fresher or entry-level candidate, your resume needs to compensate for limited work experience by highlighting education, projects, internships, and transferable skills. The right format makes all the difference — and the wrong one can get you auto-rejected before a human even sees your name.
        </p>
        <p>
          According to a 2025 LinkedIn survey, <strong>87% of recruiters</strong> say that a well-structured fresher resume with strong projects can be just as impressive as one with years of work experience. The key is knowing what to emphasize and how to present it.
        </p>

        <h2>1. Use a Hybrid (Combination) Format</h2>
        <p>
          The best format for freshers is a <strong>hybrid format</strong> that leads with a skills/projects section and follows with education. This puts your strongest assets upfront while still providing a chronological education timeline. Here is the recommended section order:
        </p>
        <ul>
          <li><strong>Contact Information</strong> — Name, email, phone, city, LinkedIn, GitHub/portfolio</li>
          <li><strong>Professional Summary</strong> — 2-3 lines capturing your degree, skills, and what you bring</li>
          <li><strong>Technical Skills</strong> — Grouped by category (Languages, Frameworks, Tools, Databases)</li>
          <li><strong>Projects</strong> — 2-4 projects with problem, tech stack, and outcome</li>
          <li><strong>Education</strong> — Degree, institution, GPA (if 3.5+), relevant coursework</li>
          <li><strong>Experience</strong> — Internships, part-time work, freelancing, volunteer work</li>
          <li><strong>Certifications</strong> — Online courses, bootcamps, professional certifications</li>
        </ul>
        <p>
          Why this order? Recruiters spend an average of <strong>7.4 seconds</strong> on a first scan (TheLadders eye-tracking study). Your skills and projects — the things that prove you can do the job — must be visible in that window.
        </p>

        <h2>2. Lead with a Strong Professional Summary</h2>
        <p>
          Write 2-3 lines that immediately signal your value. Avoid generic statements like &quot;Hard-working team player seeking an opportunity.&quot; Instead, be specific about what you know and what you have built.
        </p>
        <p>
          <strong>Weak summary:</strong> <em>&quot;Motivated computer science graduate looking for a challenging role in software development where I can learn and grow.&quot;</em>
        </p>
        <p>
          <strong>Strong summary:</strong> <em>&quot;Computer Science graduate with hands-on experience building full-stack applications using React, Node.js, and PostgreSQL. Built 3 production-ready projects including a real-time collaboration tool serving 200+ users. Seeking a software engineer role where I can contribute to scalable systems from day one.&quot;</em>
        </p>
        <p>
          Notice how the strong version names specific technologies, mentions a concrete project with metrics, and states the type of role being sought. This immediately tells the recruiter: this person can code, has shipped things, and knows what they want.
        </p>

        <h2>3. Projects Are Your Gold Mine</h2>
        <p>
          For freshers, the projects section is often <strong>more important than work experience</strong>. This is where you prove you can actually build things. Include 2-4 projects, and for each one, follow this structure:
        </p>
        <p>
          <strong>Project Name</strong> — <em>Technologies Used</em><br />
          One-sentence description of the problem you solved. One sentence about the technical approach. One sentence about the outcome or impact.
        </p>
        <p>
          <strong>Example 1:</strong>
        </p>
        <ul>
          <li><strong>RealTime Chat App</strong> — <em>React, Socket.io, Node.js, Redis</em></li>
          <li>Built a real-time messaging platform with typing indicators, read receipts, and file sharing. Handled 500+ concurrent WebSocket connections with Redis pub/sub for horizontal scaling. Deployed on AWS with CI/CD via GitHub Actions.</li>
        </ul>
        <p>
          <strong>Example 2:</strong>
        </p>
        <ul>
          <li><strong>ExpenseTracker ML</strong> — <em>Python, TensorFlow, Flask, React</em></li>
          <li>Developed a personal finance app that categorizes transactions using a trained NLP model (89% accuracy). Built REST API with Flask and interactive dashboard with React. Reduced manual categorization time by 70%.</li>
        </ul>
        <p>
          Always link to the GitHub repository and, if possible, a live demo. Hiring managers <strong>will</strong> click these links. Make sure your README is clean and your code is well-organized.
        </p>

        <h2>4. Education: Include Relevant Details</h2>
        <p>
          List your degree, institution, graduation year, and GPA if it is 3.5/4.0 or higher (or equivalent). But do not stop there — include details that strengthen your candidacy:
        </p>
        <ul>
          <li><strong>Relevant coursework:</strong> Data Structures, Algorithms, Database Systems, Machine Learning</li>
          <li><strong>Academic honors:</strong> Dean&apos;s List, Merit Scholarship, GPA ranking</li>
          <li><strong>Thesis or capstone:</strong> If it is relevant to the role, describe it in 1-2 lines</li>
          <li><strong>Teaching assistant or lab assistant:</strong> Shows deep understanding of the subject</li>
        </ul>
        <p>
          If your GPA is below 3.5, simply omit it. Focus on coursework and projects instead.
        </p>

        <h2>5. Skills: Be Specific and Honest</h2>
        <p>
          List specific technologies, tools, and platforms you have actually used in projects or coursework. Group them by category to make scanning easy:
        </p>
        <ul>
          <li><strong>Languages:</strong> Python, JavaScript, TypeScript, Java, SQL</li>
          <li><strong>Frameworks:</strong> React, Next.js, Express.js, Django, Flask</li>
          <li><strong>Tools:</strong> Git, Docker, AWS (EC2, S3), Vercel, Postman</li>
          <li><strong>Databases:</strong> PostgreSQL, MongoDB, Redis, Firebase</li>
          <li><strong>Concepts:</strong> REST APIs, GraphQL, CI/CD, Agile/Scrum</li>
        </ul>
        <p>
          <strong>Never list a skill you cannot demonstrate in an interview.</strong> If you list &quot;Docker,&quot; be prepared to explain containers, Dockerfiles, and docker-compose. If you list &quot;AWS,&quot; know the difference between EC2 and Lambda. Interviewers will probe every skill on your resume.
        </p>

        <h2>6. Internships and Volunteering Count</h2>
        <p>
          Even short internships, freelance projects, or volunteer contributions count as experience. The key is describing them using the same <strong>action verb + task + result</strong> formula as experienced professionals:
        </p>
        <p>
          <strong>Weak:</strong> <em>&quot;Intern at TechCorp — worked on frontend development&quot;</em>
        </p>
        <p>
          <strong>Strong:</strong> <em>&quot;Frontend Engineering Intern at TechCorp — Built a customer dashboard using React and Chart.js that reduced support ticket resolution time by 25%. Collaborated with a 4-person team using Agile sprints.&quot;</em>
        </p>
        <p>
          If you have no internships, include relevant volunteer work, open-source contributions, hackathon projects, or teaching/mentoring roles. All of these demonstrate initiative and skills.
        </p>

        <h2>7. What to Put When You Have Zero Experience</h2>
        <p>
          If you truly have no work experience, no internships, and no freelance work, your resume should focus entirely on:
        </p>
        <ul>
          <li><strong>Projects:</strong> Personal projects, hackathon builds, open-source contributions</li>
          <li><strong>Education:</strong> Coursework, GPA, academic achievements, thesis</li>
          <li><strong>Certifications:</strong> AWS Cloud Practitioner, Google Data Analytics, freeCodeCamp certificates</li>
          <li><strong>Competitions:</strong> Coding competitions, hackathons, math olympiads</li>
          <li><strong>Leadership:</strong> Club president, event organizer, teaching assistant</li>
        </ul>
        <p>
          Remember: <strong>everyone starts somewhere.</strong> A fresher with 3 strong projects and a clean resume will always beat a fresher with no projects and a generic &quot;objective statement.&quot;
        </p>

        <h2>8. Common Fresher Resume Mistakes</h2>
        <ul>
          <li><strong>Using an objective statement:</strong> Objectives are outdated. Use a professional summary that focuses on what you offer, not what you want.</li>
          <li><strong>Listing every course you took:</strong> Only include courses directly relevant to the role. &quot;Introduction to Psychology&quot; does not belong on a software engineer resume.</li>
          <li><strong>Including a photo:</strong> Never include a photo on a US/Canada resume. It can trigger bias and ATS parsing issues.</li>
          <li><strong>Using fancy templates:</strong> Canva templates with columns, icons, and graphics look nice but break ATS parsers. Use a clean, single-column layout.</li>
          <li><strong>Forgetting to proofread:</strong> A single typo can get your resume rejected. Read it aloud, use Grammarly, and have a friend review it.</li>
          <li><strong>One resume for all applications:</strong> Tailor your summary and skills to each specific job description. Mirror their exact keywords.</li>
        </ul>

        <h2>9. Keep It to 1 Page</h2>
        <p>
          As a fresher, your resume should be <strong>exactly 1 page</strong>. Every line must earn its place. Remove irrelevant experiences, outdated certifications, and generic soft skills like &quot;hard worker&quot; or &quot;team player.&quot; If you are struggling to fit, prioritize your strongest projects and most relevant skills.
        </p>
        <p>
          Use a 10-11pt font (Arial, Calibri, or Inter), 0.5-0.75 inch margins, and consistent formatting throughout. Save as PDF to preserve layout across devices.
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