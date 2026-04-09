/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "mammoth", "pdfjs-dist", "mupdf"],
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
