import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — rawcv",
  description: "Terms and conditions for using rawcv.",
  alternates: { canonical: "https://www.rawcv.com/terms" },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: April 14, 2026</p>

        <Section title="1. Acceptance">
          <p>By accessing or using rawcv (&quot;the Service&quot;) you agree to be bound by these Terms. If you do not agree, do not use the Service.</p>
        </Section>

        <Section title="2. Description of service">
          <p>rawcv provides AI-powered resume analysis, optimisation, and PDF generation tools. Features are accessed using credits that are either granted free on sign-up or purchased.</p>
        </Section>

        <Section title="3. Accounts">
          <ul>
            <li>You must provide accurate information when creating an account.</li>
            <li>You are responsible for maintaining the security of your credentials.</li>
            <li>You must be at least 13 years old to use the Service.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
          </ul>
        </Section>

        <Section title="4. Credits and payments">
          <ul>
            <li>Credits are consumed per AI operation as described on the pricing page.</li>
            <li>Purchased credits are non-refundable except where required by applicable law.</li>
            <li>We reserve the right to change credit pricing with reasonable notice.</li>
            <li>Payments are processed by Razorpay or Stripe. We do not store payment card details.</li>
          </ul>
        </Section>

        <Section title="5. Acceptable use">
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service to generate false, misleading, or fraudulent resumes.</li>
            <li>Attempt to reverse-engineer, scrape, or abuse the API.</li>
            <li>Upload content that is illegal, harmful, or infringes third-party rights.</li>
            <li>Circumvent credit limits or access controls.</li>
          </ul>
        </Section>

        <Section title="6. Intellectual property">
          <p>You retain ownership of the resume content you upload. By using the Service you grant rawcv a limited licence to process that content solely to provide the Service. rawcv retains all rights to the platform, UI, and underlying code.</p>
        </Section>

        <Section title="7. AI-generated content">
          <p>AI suggestions and enhancements are generated automatically and may contain errors. You are solely responsible for reviewing and verifying any content before submitting it to employers.</p>
        </Section>

        <Section title="8. Disclaimer of warranties">
          <p>The Service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that the Service will be uninterrupted, error-free, or that AI outputs will be accurate or suitable for any particular purpose.</p>
        </Section>

        <Section title="9. Limitation of liability">
          <p>To the maximum extent permitted by law, rawcv shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
        </Section>

        <Section title="10. Changes to terms">
          <p>We may update these Terms at any time. The &quot;Last updated&quot; date will reflect changes. Continued use after changes constitutes acceptance.</p>
        </Section>

        <Section title="11. Governing law">
          <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of India.</p>
        </Section>

        <Section title="12. Contact">
          <p>Questions? Email us at <a href="mailto:support@rawcv.com" className="text-violet-600 hover:underline">support@rawcv.com</a>.</p>
        </Section>

        <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-400">
          <Link href="/" className="text-violet-600 hover:underline">← Back to rawcv</Link>
          {" · "}
          <Link href="/privacy" className="text-violet-600 hover:underline">Privacy Policy</Link>
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
