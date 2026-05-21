import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us - Support & Queries | rawcv",
  description:
    "Get in touch with the rawcv support team. We're here to help you with your resume building, optimization, and account queries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-20">
      {/* Hero section */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-br from-violet-200/40 via-blue-100/20 to-transparent dark:from-violet-900/20 dark:via-blue-900/10 blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Have questions about credits, subscription, or need help building your resume? Our support team is here to assist.
          </p>
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                We value your feedback and strive to reply to all queries within 24–48 hours on business days.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-lg">
                  ✉️
                </span>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Email Support</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">For account, billing, or general queries</p>
                  <a href="mailto:support@rawcv.com" className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline mt-1 block">
                    support@rawcv.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-lg">
                  🕒
                </span>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Operating Hours</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Our support team is available during</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                    Mon – Fri, 9:00 AM – 6:00 PM IST
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-50/50 to-gray-50/50 dark:from-violet-950/10 dark:to-gray-900/50 border border-violet-100/80 dark:border-violet-900/20 shadow-inner">
              <h3 className="font-bold text-gray-950 dark:text-white mb-2 text-sm flex items-center gap-1.5">
                <span className="text-sm">💡</span> Quick Tip
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                If you are asking about credit usage or account details, please make sure to send the email from your registered account email address.
              </p>
            </div>

            {/* Illustration Frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-violet-100 dark:border-violet-900/40 bg-white dark:bg-gray-900 p-1.5 transform hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="/contact_illustration.png" 
                alt="rawcv Help & Support Illustration" 
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Enter details here..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation Back Link */}
      <div className="text-center pt-8">
        <Link href="/" className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline">
          ← Back to Homepage
        </Link>
      </div>
    </div>
  );
}
