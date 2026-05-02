"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}

const BENEFITS = [
  {
    icon: "📊",
    title: "ATS Score in seconds",
    desc: "Find out exactly why your resume gets filtered out before a human ever reads it. Our ATS checker scores your resume out of 100 and lists every issue to fix.",
  },
  {
    icon: "🎯",
    title: "Match any job description",
    desc: "Paste a job posting and instantly see your relevance score, missing keywords, and which skills to highlight. Stop guessing what recruiters want.",
  },
  {
    icon: "✨",
    title: "AI-powered suggestions",
    desc: "Get 3–15 targeted improvements covering weak action verbs, missing quantified achievements, and incomplete sections — all specific to your resume.",
  },
  {
    icon: "🔧",
    title: "Enhance bullet points",
    desc: "Transform vague responsibilities into strong, results-driven statements. Our AI rewrites weak lines while keeping your voice and facts intact.",
  },
  {
    icon: "💬",
    title: "Build from scratch with AI chat",
    desc: "No resume yet? Chat with our AI to build one from scratch. Describe your experience conversationally and get a formatted, professional resume in minutes.",
  },
  {
    icon: "🎨",
    title: "Download polished PDFs",
    desc: "Choose from Classic, Modern, Minimal, Executive, or Creative themes. Download a clean, ATS-safe PDF ready to submit to any employer.",
  },
];

const FAQS = [
  {
    q: "Is rawcv really free?",
    a: "Yes. Every new account gets 20 free credits — enough to run several ATS analyses, get AI suggestions, and download a PDF. No credit card required.",
  },
  {
    q: "What file formats can I upload?",
    a: "rawcv accepts PDF, DOCX, and plain TXT files up to 5 MB. You can also build a resume from scratch using the AI chat interface without uploading anything.",
  },
  {
    q: "Is my resume data private?",
    a: "Your resume content is processed in-memory to generate AI responses and is never permanently stored on our servers. We do not sell or share your data.",
  },
  {
    q: "How does the ATS score work?",
    a: "We run rule-based checks (missing sections, keyword density, date formatting, contact info) combined with AI analysis to give you a score out of 100 with specific, actionable issues.",
  },
  {
    q: "Can I use rawcv on my phone?",
    a: "Yes — rawcv is fully responsive and works on any device. The chat builder, ATS analysis, and download features all work on mobile.",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") router.replace("/analyze");
  }, [status, router]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      if (data.error === "email_in_use") {
        setError("This email is already registered.");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
      return;
    }

    setSuccess(data.message);
    if (data.autoVerified) {
      setTimeout(() => router.push("/login"), 1500);
    }
  }

  async function handleGoogleSignUp() {
    setLoading(true);
    await signIn("google", { callbackUrl: "/analyze" });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-6 pt-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Create account", href: "/register" }]} />
      </div>

      {/* Sign-up form */}
      <div className="flex justify-center px-4 pb-12">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Create your account</h1>
          <p className="text-sm text-gray-500 mb-6">
            Start building better resumes with AI —{" "}
            <span className="font-medium text-emerald-600 dark:text-emerald-400">20 free credits included</span>
          </p>

          {error && (
            <div role="alert" className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div role="alert" className="mb-6 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-300 dark:border-indigo-700 px-5 py-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none" aria-hidden="true">📧</span>
                <div>
                  <p className="font-semibold text-indigo-800 dark:text-indigo-200 text-base">Verification email sent!</p>
                  <p className="mt-1 text-indigo-700 dark:text-indigo-300">
                    We sent a verification link to <span className="font-medium">{email}</span>. Please check your inbox (and spam folder) and click the link to activate your account before signing in.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-5">
            <div className="flex items-center justify-center mb-2">
              <span className="text-xs font-semibold tracking-wide text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-full px-3 py-0.5">
                ✦ Recommended
              </span>
            </div>
            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border-2 border-indigo-400 dark:border-indigo-500 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-500 shadow-sm hover:shadow-md transition-all disabled:opacity-50"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <hr className="flex-1 border-gray-200 dark:border-gray-700" />
            <span className="text-xs text-gray-400">or sign up with email</span>
            <hr className="flex-1 border-gray-200 dark:border-gray-700" />
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Jane Smith"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Min. 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2.5 text-sm transition disabled:opacity-50"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ── Value content for AdSense & SEO ── */}
      <div className="max-w-4xl mx-auto px-6 pb-20">

        {/* What you get */}
        <section aria-labelledby="benefits-heading" className="mb-16">
          <h2 id="benefits-heading" className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
            Everything you get with a free account
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-10 text-sm">
            20 free credits on sign-up. No credit card required.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm"
              >
                <div className="text-2xl mb-3" aria-hidden="true">{b.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm">{b.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="how-it-works-heading" className="mb-16">
          <h2 id="how-it-works-heading" className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            How rawcv works
          </h2>
          <ol className="space-y-6 max-w-2xl mx-auto">
            {[
              { n: 1, title: "Create your free account", body: "Sign up with Google or email in under 30 seconds. You instantly receive 20 free credits — no payment details needed." },
              { n: 2, title: "Upload your resume or build from scratch", body: "Drag and drop a PDF or DOCX file, or use the AI chat interface to build a resume from scratch by describing your experience conversationally." },
              { n: 3, title: "Run ATS analysis", body: "Click Run ATS Analysis to get a score out of 100. You'll see exactly which sections are missing, which keywords are weak, and how to fix each issue." },
              { n: 4, title: "Match to a job description", body: "Paste any job posting to see your relevance score, missing skills, and which parts of your resume to emphasise for that specific role." },
              { n: 5, title: "Download your polished PDF", body: "Pick a visual theme — Classic, Modern, Minimal, Executive, or Creative — and download a clean, ATS-safe PDF ready to submit." },
            ].map((step) => (
              <li key={step.n} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-600 text-white text-sm font-bold flex items-center justify-center mt-0.5">
                  {step.n}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="mb-10">
          <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Frequently asked questions
          </h2>
          <dl className="max-w-2xl mx-auto space-y-5">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-5 py-4">
                <dt className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">{faq.q}</dt>
                <dd className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline font-medium">
            Sign in here
          </Link>
          {" · "}
          <Link href="/how-to" className="text-indigo-600 hover:underline font-medium">
            Read the guide
          </Link>
        </p>
      </div>
    </div>
  );
}
