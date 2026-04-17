import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.rawcv.com";
  return [
    { url: base,                  lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/register`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/login`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/credits`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/dashboard`,   lastModified: new Date(), changeFrequency: "weekly",  priority: 0.6 },
    { url: `${base}/analyze`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tailor`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/chat`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacy`,     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/terms`,       lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];
}
