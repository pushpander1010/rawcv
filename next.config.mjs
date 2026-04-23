/** @type {import('next').NextConfig} */
const nextConfig = {
  // Redirect non-www to www so Google sees a consistent canonical URL
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "rawcv.com" }],
        destination: "https://www.rawcv.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "X-Frame-Options",            value: "DENY" },
          { key: "X-XSS-Protection",           value: "1; mode=block" },
          { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",         value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://pagead2.googlesyndication.com https://partner.googleadservices.com https://www.googletagmanager.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://adservice.google.com https://www.google.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://pagead2.googlesyndication.com https://www.google-analytics.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://adservice.google.com https://googleads.g.doubleclick.net",
              "frame-src https://api.razorpay.com https://checkout.razorpay.com https://www.youtube.com https://youtube.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "mammoth", "pdfjs-dist", "mupdf", "puppeteer", "puppeteer-core", "@sparticuz/chromium-min"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals].filter(Boolean)),
        "pdfjs-dist",
        "pdf-parse",
        "mammoth",
        // mupdf is ESM with top-level await — must be imported as module, not require()'d
        ({ request }, callback) => {
          if (request === "mupdf" || request?.startsWith("mupdf/")) {
            return callback(null, `module ${request}`);
          }
          callback();
        },
      ];
    }
    return config;
  },
};

export default nextConfig;
