"use client";

import { useState, Suspense, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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

const TIPS = [
  {
    icon: "🔑",
    title: "Forgot your password?",
    desc: "Use the \"Forgot password?\" link on the sign-in form to receive a reset link by email. The link expires in 1 hour.",
  },
  {
    icon: "📧",
    title: "Email not verified?",
    desc: "Check your spam folder for the verification email. If it's been more than 10 minutes, try registering again — a new link will be sent.",
  },
  {
    icon: "🔒",
    title: "Signed up with Google?",
    desc: "If you originally signed in with Google, use the \"Continue with Google\" button — email/password login won't work for Google accounts.",
  },
  {
    icon: "💡",
    title: "New to rawcv?",
    desc: "Create a free account in under 30 seconds. You get 20 free credits instantly — enough to run ATS analysis, get AI suggestions, and download a PDF.",
  },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/analyze";
  const verified = searchParams.get("verified");
  const errorParam = searchParams.get("error");
  const { status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    errorParam === "email_not_verified"
      ? "Your email isn't verified yet. Please check your inbox for the verification link."
      : errorParam === "CredentialsSignin"
      ? "Invalid email or password."
      : null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = callbackUrl;
    }
  }, [status, callbackUrl]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" aria-label="Loading" />
      </div>
    );
  }

  async function handleCredentialsLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (result?.error) {
      if (result.error === "email_not_verified") {
        setError("Your email isn't verified yet. Please check your inbox for the verification link.");
      } else {
        setError("Invalid email or password.");
      }
    } else {
      window.location.href = callbackUrl;
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    await signIn("google", { callbackUrl });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-6 pt-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Sign in", href: "/login" }]} />
      </div>

      {/* Sign-in form */}
      <div className="flex justify-center px-4 pb-12">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-6">Sign in to your rawcv account</p>

          {verified && (
            <div className="mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <span className="text-base">✓</span>
              <span>Email verified. You can now sign in.</span>
            </div>
          )}

          {error && (
            <div role="alert" className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
              <span className="text-base shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="mb-5">
            <div className="flex items-center justify-center mb-2">
              <span className="text-xs font-semibold tracking-wide text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-full px-3 py-0.5">
                ✦ Recommended
              </span>
            </div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 hover:border-indigo-500/50 shadow-sm hover:shadow hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <hr className="flex-1 border-gray-200 dark:border-gray-700" />
            <span className="text-xs text-gray-400">or sign in with email</span>
            <hr className="flex-1 border-gray-200 dark:border-gray-700" />
          </div>

          <form onSubmit={handleCredentialsLogin} className="space-y-4">
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
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-indigo-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl px-4 py-3.5 text-sm shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-600 hover:underline font-medium">
              Create one free
            </Link>
          </p>
        </div>
      </div>

      {/* ── Value content for AdSense & SEO ── */}
      <div className="max-w-4xl mx-auto px-6 pb-20">

        {/* Sign-in help tips */}
        <section aria-labelledby="signin-tips-heading" className="mb-16">
          <h2 id="signin-tips-heading" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Having trouble signing in?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {TIPS.map((tip) => (
              <div
                key={tip.title}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/80 p-5 shadow-sm hover:shadow-md transition-shadow flex gap-4"
              >
                <div className="text-2xl flex-shrink-0" aria-hidden="true">{tip.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">{tip.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What rawcv does */}
        <section aria-labelledby="about-rawcv-heading" className="mb-16 max-w-2xl mx-auto">
          <h2 id="about-rawcv-heading" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
            What is rawcv?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            rawcv is a free AI-powered resume platform that helps job seekers build, analyze, and optimize their resumes. Whether you&apos;re starting from scratch or improving an existing CV, rawcv gives you the tools to stand out.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            Our ATS score checker tells you exactly why your resume might be getting filtered out before a recruiter ever reads it. The job description matcher shows you which keywords and skills you&apos;re missing for any specific role. And the AI enhancement tools help you rewrite weak bullet points into strong, results-driven statements.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Every new account starts with 20 free credits — enough to run a full analysis, get AI suggestions, and download a polished PDF resume in your choice of theme.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 hover:-translate-y-0.5 shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 text-white text-sm font-semibold transition-all"
            >
              Create free account
            </Link>
            <Link
              href="/how-to"
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:-translate-y-0.5 shadow-sm transition-all"
            >
              Read the guide
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
