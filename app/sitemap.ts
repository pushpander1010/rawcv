import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.rawcv.com";
  return [
    // Public pages only — auth-protected routes are excluded
    { url: base,                lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/how-to`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/register`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/login`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`,   lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/terms`,     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];
}
