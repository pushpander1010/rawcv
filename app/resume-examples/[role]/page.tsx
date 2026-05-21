import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Define supported roles for static generation / examples
const roleData: Record<string, {
  title: string;
  summary: string;
  skills: string[];
  experience: { company: string; title: string; dates: string; bullets: string[] }[];
}> = {
  "software-engineer": {
    title: "Software Engineer",
    summary: "Detail-oriented and collaborative Software Engineer with 4+ years of experience building scalable web applications. Expert in React, Next.js, Node.js, and TypeScript.",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "GraphQL", "PostgreSQL", "Docker", "AWS"],
    experience: [
      {
        company: "TechSolutions Inc.",
        title: "Senior Software Engineer",
        dates: "2023 - Present",
        bullets: [
          "Led development of a high-performance Next.js application, reducing page load times by 40% and increasing engagement by 18%.",
          "Architected REST and GraphQL API services in Node.js, handling over 10M daily requests with 99.9% uptime.",
          "Mentored 4 junior developers and established code quality guidelines, improving sprint velocity by 15%."
        ]
      },
      {
        company: "Innovate Web Corp",
        title: "Software Engineer",
        dates: "2021 - 2023",
        bullets: [
          "Developed reusable UI component library using React and Tailwind CSS, reducing front-end development time by 30%.",
          "Integrated third-party payment gateways and authentication services securely using OAuth and Stripe APIs.",
          "Optimized PostgreSQL queries, decreasing database response latencies by 25%."
        ]
      }
    ]
  },
  "product-manager": {
    title: "Product Manager",
    summary: "Strategic Product Manager with 5+ years of experience leading cross-functional teams to launch SaaS products. Proven success in product lifecycle management, user research, and data-driven decisions.",
    skills: ["Product Roadmap", "User Research", "Agile/Scrum", "Data Analytics", "SQL", "Amplitude", "Jira", "A/B Testing"],
    experience: [
      {
        company: "CloudScale Systems",
        title: "Senior Product Manager",
        dates: "2022 - Present",
        bullets: [
          "Defined and executed product roadmap for enterprise security platform, increasing monthly active users (MAU) by 45% in 12 months.",
          "Spearheaded user research and feedback loops, resulting in a revamped onboarding flow that cut user churn by 22%.",
          "Coordinated product launches with engineering, design, and marketing teams in an agile environment."
        ]
      },
      {
        company: "AppSphere Ventures",
        title: "Associate Product Manager",
        dates: "2020 - 2022",
        bullets: [
          "Owned product lifecycle for mobile application analytics feature, generating $150K in incremental annual recurring revenue (ARR).",
          "Wrote detailed PRDs, managed product backlogs, and prioritized user stories based on business impact and technical effort."
        ]
      }
    ]
  },
  "data-analyst": {
    title: "Data Analyst",
    summary: "Analytical Data Analyst with 3+ years of experience translating complex datasets into actionable business insights. Highly skilled in Python, SQL, Tableau, and statistical modeling.",
    skills: ["SQL", "Python (Pandas/NumPy)", "Tableau", "PowerBI", "R", "Statistical Modeling", "A/B Testing", "Excel"],
    experience: [
      {
        company: "DataMetrics Partners",
        title: "Lead Data Analyst",
        dates: "2023 - Present",
        bullets: [
          "Designed and deployed Tableau dashboards for executive leadership, streamlining monthly KPI reporting processes and saving 10+ hours per week.",
          "Conducted comprehensive customer churn analysis, uncovering insights that informed retention strategies and saved $80K in revenue.",
          "Wrote complex SQL queries to clean, transform, and join data from multiple database structures."
        ]
      },
      {
        company: "Apex Retail Group",
        title: "Junior Data Analyst",
        dates: "2021 - 2023",
        bullets: [
          "Monitored and reported daily sales performance metrics, detecting anomalies and notifying stakeholders within hours.",
          "Assisted in configuring statistical tests for marketing A/B tests, ensuring mathematical validity."
        ]
      }
    ]
  }
};

// Generate static params for static site generation (optional, Next.js optimization)
export function generateStaticParams() {
  return Object.keys(roleData).map((role) => ({
    role,
  }));
}

interface Props {
  params: {
    role: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const roleName = params.role;
  const role = roleData[roleName];
  if (!role) {
    return {
      title: "Resume Example - rawcv",
    };
  }
  return {
    title: `${role.title} Resume Example & Guide | rawcv`,
    description: `Create a professional ${role.title} resume using our free ATS-safe template and examples. Optimize your resume with industry keywords and get hired.`,
  };
}

export default function ResumeExamplePage({ params }: Props) {
  const roleName = params.role;
  const role = roleData[roleName];

  if (!role) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-br from-violet-200/40 via-blue-100/20 to-transparent dark:from-violet-900/20 dark:via-blue-900/10 blur-3xl" />
        <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 text-center md:text-left space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 uppercase">
              Resume Examples &amp; Guides
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-950 dark:text-white leading-tight">
              {role.title} Resume Guide &amp; Example
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto md:mx-0">
              Use this ATS-friendly resume sample and build guide to stand out to hiring managers and pass applicant tracking systems.
            </p>
          </div>
          <div className="md:col-span-4 hidden md:block">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-violet-100 dark:border-violet-900/40 bg-white dark:bg-gray-900 p-1.5 transform hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="/resume_guide_illustration.png" 
                alt={`${role.title} Guide Illustration`} 
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Build Guide */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to write a {role.title} resume</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                When writing a resume for a {role.title} role, you must emphasize your technical skill set, quantifiable accomplishments, and projects. Use standard formats and highlight relevant keywords from the job description.
              </p>
            </div>

            {/* Tip 1 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-violet-600">01.</span> Write a strong summary
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Briefly introduce your professional background, main skill sets, and how you bring value. Mention your years of experience and key domains of expertise.
              </p>
            </div>

            {/* Tip 2 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-violet-600">02.</span> Highlight key skills
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                List the core platforms, programming languages, and methodologies you know. Group them logically so they are easy for recruiters and ATS machines to read.
              </p>
            </div>

            {/* Tip 3 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-violet-600">03.</span> Focus on achievements
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Instead of just listing tasks, quantify your bullets. For example, mention percentages, dollars, metrics, and size of databases or projects you worked with.
              </p>
            </div>

            {/* Interactive Builder Call-To-Action */}
            <div className="p-6 rounded-3xl bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Customize this resume with AI</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Open rawcv&apos;s free resume builder, choose your favorite layout, paste your details, and export a perfectly formatted PDF.
              </p>
              <Link
                href="/build"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Create with Free Builder
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Interactive Resume Template Example */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-violet-200 dark:border-violet-900/40 shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Score: 98% ATS-Friendly ✅
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="font-bold text-lg text-gray-900 dark:text-white">JANE SMITH</div>
                <div className="text-xs text-gray-400 mt-1">jane.smith@example.com · (555) 123-4567 · San Francisco, CA</div>
              </div>

              {/* Summary section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-violet-600 dark:text-violet-400 tracking-wider uppercase">Professional Summary</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{role.summary}</p>
              </div>

              {/* Skills section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-violet-600 dark:text-violet-400 tracking-wider uppercase">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {role.skills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-700 dark:text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-violet-600 dark:text-violet-400 tracking-wider uppercase">Work Experience</h4>
                {role.experience.map((exp, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-gray-900 dark:text-white">
                      <span>{exp.company} — {exp.title}</span>
                      <span className="text-gray-400">{exp.dates}</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {exp.bullets.map((bullet, bulletIdx) => (
                        <li key={bulletIdx} className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Navigation */}
      <section className="max-w-4xl mx-auto px-6 pt-12 border-t border-gray-100 dark:border-gray-800">
        <h3 className="text-center text-gray-500 dark:text-gray-400 font-semibold mb-6">Other Resume Examples</h3>
        <div className="flex justify-center flex-wrap gap-4">
          {Object.keys(roleData).map((r) => {
            if (r === roleName) return null;
            return (
              <Link
                key={r}
                href={`/resume-examples/${r}`}
                className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-850 text-sm transition-all hover:scale-[1.02] active:scale-[0.98] duration-200 text-violet-600 dark:text-violet-400 font-semibold shadow-sm"
              >
                {roleData[r].title} Example
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
