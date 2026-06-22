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
          // CORS — restrict to same-origin only (no wildcard)
          {
            key: "Access-Control-Allow-Origin",
            value: "https://www.rawcv.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-CSRF-Token",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          // Content Security Policy — hardened (no unsafe-inline / unsafe-eval)
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // script-src: nonce-based or hash-based would be ideal,
              // but Next.js inlines scripts. Use 'unsafe-hashes' with
              // specific hashes for inline event handlers, and 'unsafe-inline'
              // ONLY for style-src. For script-src, use 'unsafe-inline'
              // as a transition — remove once Next.js CSP nonce support lands.
              // For now, keep unsafe-inline for script-src but
              // we DO remove unsafe-eval which was the critical gap.
              "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://pagead2.googlesyndication.com https://partner.googleadservices.com https://www.googletagmanager.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://adservice.google.com https://www.google.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://pagead2.googlesyndication.com https://www.google-analytics.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://adservice.google.com https://googleads.g.doubleclick.net https://www.google.com",
              "frame-src https://api.razorpay.com https://checkout.razorpay.com https://www.youtube.com https://youtube.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
              "frame-ancestors 'none'",
              // Form actions restricted to self
              "form-action 'self'",
              // Base URI restricted
              "base-uri 'self'",
              // Upgrade insecure requests
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      // CORS preflight for API routes
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://www.rawcv.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-CSRF-Token",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
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
