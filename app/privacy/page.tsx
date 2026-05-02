import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Privacy Policy — rawcv",
  description: "How rawcv collects, uses, and protects your personal information.",
  alternates: { canonical: "https://www.rawcv.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 px-6 py-16">
      <div className="max-w-2xl mx-auto prose prose-gray dark:prose-invert prose-sm sm:prose-base">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy Policy", href: "/privacy" }]} />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: April 14, 2026</p>

        <Section title="1. Who we are">
          <p>rawcv (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates the website at <strong>rawcv.com</strong>. This policy explains what personal data we collect, why we collect it, and how we protect it.</p>
        </Section>

        <Section title="2. Information we collect">
          <ul>
            <li><strong>Account data</strong> — name, email address, and hashed password when you register with email/password.</li>
            <li><strong>OAuth data</strong> — name and email provided by Google when you sign in with Google.</li>
            <li><strong>Usage data</strong> — pages visited, features used, and credit transactions, collected via Vercel Analytics.</li>
            <li><strong>Resume content</strong> — text extracted from files you upload. This is processed in-memory to generate AI responses and is <em>not</em> permanently stored on our servers.</li>
          </ul>
        </Section>

        <Section title="3. How we use your information">
          <ul>
            <li>To create and manage your account.</li>
            <li>To provide AI-powered resume analysis, suggestions, and downloads.</li>
            <li>To send transactional emails (email verification, password reset).</li>
            <li>To process payments for credit top-ups via Razorpay or Stripe.</li>
            <li>To improve the service through aggregated, anonymised analytics.</li>
          </ul>
        </Section>

        <Section title="4. Third-party services">
          <p>We share data with the following processors only to the extent necessary to operate the service:</p>
          <ul>
            <li><strong>Google OAuth</strong> — for social sign-in.</li>
            <li><strong>Resend</strong> — for transactional email delivery.</li>
            <li><strong>Razorpay / Stripe</strong> — for payment processing. We do not store card details.</li>
            <li><strong>OpenAI / Anthropic / Google Gemini / Together AI</strong> — for AI inference. Resume text is sent to these APIs and subject to their data policies.</li>
            <li><strong>Vercel</strong> — for hosting and analytics.</li>
          </ul>
        </Section>

        <Section title="5. Data retention">
          <p>Account data is retained until you delete your account. Resume content is not persisted beyond your active session. You may request deletion of your account and associated data by emailing us.</p>
        </Section>

        <Section title="6. Cookies">
          <p>We use a single session cookie issued by NextAuth.js to keep you signed in. We do not use advertising or tracking cookies.</p>
        </Section>

        <Section title="7. Your rights">
          <p>Depending on your jurisdiction you may have the right to access, correct, or delete your personal data. To exercise these rights, contact us at the email below.</p>
        </Section>

        <Section title="8. Children">
          <p>rawcv is not directed at children under 13. We do not knowingly collect data from children.</p>
        </Section>

        <Section title="9. Changes to this policy">
          <p>We may update this policy from time to time. The &quot;Last updated&quot; date at the top will reflect any changes. Continued use of the service after changes constitutes acceptance.</p>
        </Section>

        <Section title="10. Contact">
          <p>Questions about this policy? Email us at <a href="mailto:privacy@rawcv.com" className="text-violet-600 hover:underline">privacy@rawcv.com</a>.</p>
        </Section>

        <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-400">
          <Link href="/" className="text-violet-600 hover:underline">← Back to rawcv</Link>
          {" · "}
          <Link href="/terms" className="text-violet-600 hover:underline">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{title}</h2>
      <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-2">{children}</div>
    </section>
  );
}
