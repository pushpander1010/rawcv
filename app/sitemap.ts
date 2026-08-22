import type { MetadataRoute } from "next";

// Use fixed dates — dynamic new Date() causes sitemap "temporary processing error"
// in Google Search Console because the lastmod changes on every request.
const D = "2026-08-22";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.rawcv.com";
  const u = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({
    url: `${base}${path}`,
    lastModified: D,
    changeFrequency,
    priority,
  });

  const roles = [
    "software-engineer", "product-manager", "data-analyst", "frontend-developer",
    "backend-developer", "devops-engineer", "data-scientist", "ui-ux-designer",
    "marketing-manager", "hr-manager", "business-analyst", "graphic-designer",
    "content-writer", "sales-manager", "financial-analyst",
  ];

  const blogPosts = [
    "how-to-write-ats-friendly-resume",
    "quantifying-achievements-resume-examples",
    "resume-keywords-matcher-guide",
    "ats-resume-formatting-guide",
    "resume-summary-examples",
    "best-free-resume-builders-2026",
    "resume-skills-section-guide",
    "fresher-resume-tips",
    "ats-vs-human-recruiter",
    "linkedin-profile-tips-2026",
    "resume-format-for-germany",
    "software-engineer-resume-guide-2026",
    "indian-resume-vs-us-resume",
    "best-resume-format-for-freshers-2026",
  ];

  return [
    // Core tool pages
    u("/", 1.0, "weekly"),
    u("/build", 0.95, "weekly"),
    u("/analyze", 0.95, "weekly"),
    u("/tailor", 0.9, "weekly"),
    u("/chat", 0.9, "weekly"),
    u("/cover-letter", 0.9, "weekly"),
    // Resume resources
    u("/resume-templates", 0.85),
    u("/resume-formats", 0.85),
    u("/how-to", 0.9),
    // International formats
    u("/international", 0.9),
    u("/international/eu", 0.85),
    u("/international/canada", 0.85),
    u("/international/us", 0.85),
    // Resume examples
    ...roles.map((role) => u(`/resume-examples/${role}`, 0.75)),
    // Blog
    u("/blog", 0.8, "weekly"),
    ...blogPosts.map((slug) => u(`/blog/${slug}`, 0.7)),
    // Company / legal
    u("/about", 0.7),
    u("/contact", 0.7),
    u("/privacy", 0.3, "yearly"),
    u("/terms", 0.3, "yearly"),
  ];
}
