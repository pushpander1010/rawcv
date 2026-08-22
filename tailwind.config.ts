import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-lora)", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)",
        "card-hover":
          "0 4px 6px -1px rgb(15 23 42 / 0.06), 0 2px 4px -1px rgb(15 23 42 / 0.05), 0 0 0 1px rgb(37 99 235 / 0.08)",
        brand: "0 4px 14px -2px rgb(37 99 235 / 0.35)",
        "brand-lg": "0 8px 24px -4px rgb(37 99 235 / 0.4)",
      },
      animation: {
        "float-slow": "float-slow 20s ease-in-out infinite",
        "float-medium": "float-medium 25s ease-in-out infinite",
        "float-fast": "float-fast 30s ease-in-out infinite",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -30px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
        "float-medium": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-40px, 20px) scale(1.05)" },
          "66%": { transform: "translate(30px, -40px) scale(0.95)" },
        },
        "float-fast": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(20px, 40px) scale(0.95)" },
          "66%": { transform: "translate(-30px, -20px) scale(1.1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
