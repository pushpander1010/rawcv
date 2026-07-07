import type { MetadataRoute } from "next";

// Use fixed dates — dynamic new Date() causes sitemap "temporary processing error"
// in Google Search Console because the lastmod changes on every request.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.rawcv.com";
  return [
    // Public pages only — auth-protected routes are excluded to prevent redirect crawl loops
    { url: base,                    lastModified: "2026-07-07", changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/build`,         lastModified: "2026-07-07", changeFrequency: "weekly",  priority: 0.95 },
    { url: `${base}/how-to`,        lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/cover-letter`,  lastModified: "2026-07-07", changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/about`,         lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact`,       lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/register`,      lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/login`,         lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/credits`,       lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/pricing`,       lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/privacy`,       lastModified: "2026-07-07", changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/terms`,         lastModified: "2026-07-07", changeFrequency: "yearly",  priority: 0.3 },
    // International format pages (high SEO value)
    { url: `${base}/international`, lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/international/eu`,     lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/international/canada`, lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/international/us`,     lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.85 },
    // Resume formats hub
    { url: `${base}/resume-formats`,  lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/resume-templates`, lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.8 },
    // Blog
    { url: `${base}/blog`,          lastModified: "2026-07-07", changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/blog/how-to-write-ats-friendly-resume`, lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/quantifying-achievements-resume-examples`, lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/resume-keywords-matcher-guide`, lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/ats-resume-formatting-guide`, lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/resume-summary-examples`, lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/best-free-resume-builders-2026`, lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/resume-skills-section-guide`, lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/fresher-resume-tips`, lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/ats-vs-human-recruiter`, lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/linkedin-profile-tips-2026`, lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/resume-format-for-germany`, lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/software-engineer-resume-guide-2026`, lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/indian-resume-vs-us-resume`, lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/best-resume-format-for-freshers-2026`, lastModified: "2026-07-07", changeFrequency: "monthly", priority: 0.7 },
  ];
}
