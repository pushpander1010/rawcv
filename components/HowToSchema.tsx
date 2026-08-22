export interface HowToStep {
  name: string;
  text: string;
}

/**
 * Renders schema.org HowTo JSON-LD so search engines and AI assistants can
 * traverse and understand the step-by-step workflow for a given tool/page.
 */
export default function HowToSchema({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: HowToStep[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
