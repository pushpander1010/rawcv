"use client";

import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-white pb-20">
      {/* Hero section */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6 border-b border-gray-100 bg-gray-50 dark:bg-slate-800">
        <div className="relative max-w-3xl mx-auto text-center">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }]} />
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-brand-600">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-500 dark:text-slate-300">
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
              <p className="text-gray-500 dark:text-slate-300 text-sm leading-relaxed">
                We value your feedback and strive to reply to all queries within 24–48 hours on business days.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-600 text-lg">
                  ✉️
                </span>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Email Support</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-300 mt-0.5">For account, billing, or general queries</p>
                  <a href="mailto:support@rawcv.com" className="text-sm font-semibold text-brand-600 hover:underline mt-1 block">
                    support@rawcv.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-600 text-lg">
                  🕒
                </span>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Operating Hours</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-300 mt-0.5">Our support team is available during</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">
                    Mon – Fri, 9:00 AM – 6:00 PM IST
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-50/50 to-gray-50/50 border border-brand-100/80 shadow-inner">
              <h3 className="font-bold text-gray-950 mb-2 text-sm flex items-center gap-1.5">
                <span className="text-sm">💡</span> Quick Tip
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-300 leading-relaxed">
                If you are asking about credit usage or account details, please make sure to send the email from your registered account email address.
              </p>
            </div>

            {/* Illustration Frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-brand-100 bg-white dark:bg-slate-900 p-1.5 transform hover:scale-[1.02] transition-transform duration-300">
              <img
                src="/contact_illustration.jpg"
                alt="rawcv Help &amp; Support Illustration"
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>

              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <span className="text-5xl">🎉</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-slate-300 text-sm max-w-xs">
                    Thanks for reaching out. We&apos;ve sent a confirmation to your email and will reply within 24–48 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-4 px-6 py-2.5 rounded-xl border border-brand-200 text-sm font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider mb-2">
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="jane@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      required
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Enter details here..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-sm"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                      ⚠️ {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {status === "sending" ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Sending…
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation Back Link */}
      <div className="text-center pt-8">
        <Link href="/" className="text-sm font-semibold text-brand-600 hover:underline">
          ← Back to Homepage
        </Link>
      </div>
    </div>
  );
}