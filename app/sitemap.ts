import type { MetadataRoute } from "next";

// Use fixed dates — dynamic new Date() causes sitemap "temporary processing error"
// in Google Search Console because the lastmod changes on every request.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.rawcv.com";
  return [
    // Public pages only — auth-protected routes are excluded
    { url: base,                    lastModified: "2025-01-01", changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/how-to`,        lastModified: "2025-01-01", changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/register`,      lastModified: "2025-01-01", changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/login`,         lastModified: "2025-01-01", changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/credits`,       lastModified: "2025-01-01", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/dashboard`,     lastModified: "2025-01-01", changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/analyze`,       lastModified: "2025-01-01", changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/chat`,          lastModified: "2025-01-01", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tailor`,        lastModified: "2025-01-01", changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacy`,       lastModified: "2025-01-01", changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/terms`,         lastModified: "2025-01-01", changeFrequency: "yearly",  priority: 0.3 },
  ];
}
