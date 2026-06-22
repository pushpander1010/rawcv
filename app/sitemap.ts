import type { MetadataRoute } from "next";

// Use fixed dates — dynamic new Date() causes sitemap "temporary processing error"
// in Google Search Console because the lastmod changes on every request.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.rawcv.com";
  return [
    // Public pages only — auth-protected routes are excluded to prevent redirect crawl loops
    { url: base,                    lastModified: "2025-01-01", changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/build`,         lastModified: "2025-01-01", changeFrequency: "weekly",  priority: 0.95 },
    { url: `${base}/how-to`,        lastModified: "2025-01-01", changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/cover-letter`,  lastModified: "2025-01-01", changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/about`,         lastModified: "2025-01-01", changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact`,       lastModified: "2025-01-01", changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/register`,      lastModified: "2025-01-01", changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/login`,         lastModified: "2025-01-01", changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/credits`,       lastModified: "2025-01-01", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/international`, lastModified: "2025-01-01", changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/privacy`,       lastModified: "2025-01-01", changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/terms`,         lastModified: "2025-01-01", changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/blog`,          lastModified: "2026-05-20", changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/blog/how-to-write-ats-friendly-resume`, lastModified: "2026-05-20", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/quantifying-achievements-resume-examples`, lastModified: "2026-05-18", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/resume-keywords-matcher-guide`, lastModified: "2026-05-15", changeFrequency: "monthly", priority: 0.7 },
  ];
}
