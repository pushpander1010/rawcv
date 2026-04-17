import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/reset-password", "/forgot-password", "/verify-email"],
      },
    ],
    sitemap: "https://www.rawcv.com/sitemap.xml",
    host: "https://www.rawcv.com",
  };
}
