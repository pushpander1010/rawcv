const nextCoreWebVitals = await import("eslint-config-next/core-web-vitals");
const nextConfig = nextCoreWebVitals?.default ?? nextCoreWebVitals;

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**"],
  },
  ...nextConfig,
];

export default eslintConfig;
