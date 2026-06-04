import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { pricingPlans } from "@/data/pricing";
import { PricingCTA, FooterNav } from "@/components/LandingCTA";

export const metadata: Metadata = {
  title: "Pricing — rawcv | AI Resume Builder Plans",
  description:
    "Choose the right plan for your job search. Starter (₹99), Pro (₹499), or Power (₹999). Credits never expire.",
  alternates: { canonical: "https://www.rawcv.com/pricing" },
  openGraph: {
    title: "Pricing — rawcv | AI Resume Builder Plans",
    description: "Pay only for what you use. Buy credit packs starting at ₹99 for AI resume analysis.",
    url: "https://www.rawcv.com/pricing",
  },
};

const faqs = [
  { q: "Do credits expire?", a: "No — credits never expire. Use them at your own pace." },
  { q: "Can I cancel anytime?", a: "Yes. There are no subscriptions or long-term commitments." },
  { q: "What counts as one AI operation?", a: "ATS scoring (2 credits), JD matching (2 credits), AI suggestions (2 credits), and enhancement (2 credits)." },
  { q: "Can I get a refund?", a: "All purchases are final. Since credits are consumed incrementally, we cannot refund unused balances." },
  { q: "Do you offer enterprise pricing?", a: "Yes — contact us for custom pricing for career coaches, placement agencies, and teams." },
];

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": "https://www.rawcv.com/pricing#starter",
        "name": "Starter Pack",
        "description": "50 AI credits for quick resume checks.",
        "offers": { "@type": "Offer", price: "99", priceCurrency: "INR", availability: "https://schema.org/InStock" },
      },
      {
        "@type": "Product",
        "@id": "https://www.rawcv.com/pricing#pro",
        "name": "Pro Pack",
        "description": "250 AI credits for active job seekers.",
        "offers": { "@type": "Offer", price: "499", priceCurrency: "INR", availability: "https://schema.org/InStock" },
      },
      {
        "@type": "Product",
        "@id": "https://www.rawcv.com/pricing#power",
        "name": "Power Pack",
        "description": "500 AI credits for power users and coaches.",
        "offers": { "@type": "Offer", price: "999", priceCurrency: "INR", availability: "https://schema.org/InStock" },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Script id="pricing-json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <section className="pt-20 pb-12 px-6 text-center">
        <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 uppercase">
          Simple Pricing
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Pay only for what you use
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Credits are consumed per AI operation. Get 20 free credits when you sign up — no credit card needed.
        </p>
      </section>

      {/* Pricing cards */}
      <section className="pb-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 border flex flex-col ${
                plan.highlight
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30 shadow-lg"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold bg-violet-600 text-white">
                  Most popular
                </span>
              )}
              <div className="mb-4">
                <p className="font-semibold text-base">{plan.name}</p>
                <p className="text-3xl font-extrabold mt-1">
                  {plan.price}<span className="text-sm font-normal text-gray-400 ml-1">/ {plan.credits}</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{plan.priceUsd} USD</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.description}</p>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <svg className="w-4 h-4 text-violet-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <PricingCTA highlight={plan.highlight} />
            </div>
          ))}
        </div>
      </section>

      {/* How credits work */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900/30 border-t border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">How credits work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              { icon: "📤", title: "Upload your resume", desc: "Free — uses no credits." },
              { icon: "📊", title: "ATS scoring", desc: "2 credits per analysis." },
              { icon: "🎯", title: "JD matching", desc: "2 credits per match." },
              { icon: "✨", title: "AI suggestions", desc: "2 credits per batch." },
              { icon: "🔧", title: "Enhancement", desc: "2 credits per section." },
              { icon: "💬", title: "Chat building", desc: "1 credit per message." },
            ].map((item) => (
              <div key={item.title} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="font-semibold text-sm mb-0.5">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-8">
            Your first 20 free credits = ~10 analyses. That&apos;s enough to check and improve your resume several times.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6" aria-labelledby="faq-heading">
        <div className="max-w-2xl mx-auto">
          <h2 id="faq-heading" className="text-2xl font-bold text-center mb-8">Pricing FAQ</h2>
          <dl className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <dt className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{faq.q}</dt>
                <dd className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-3">Ready to optimize your resume?</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Sign up free, get 20 credits, and see your ATS score in seconds.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center px-7 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          Get started free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span className="font-bold text-gray-700 dark:text-gray-300">rawcv</span>
          <FooterNav />
          <p>© {new Date().getFullYear()} rawcv. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}