import Link from "next/link";
import Script from "next/script";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb navigation with schema.org/BreadcrumbList JSON-LD.
 * Usage: <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "How to", href: "/how-to" }]} />
 */
export default function Breadcrumb({ items }: BreadcrumbProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `https://www.rawcv.com${item.href}`,
    })),
  };

  return (
    <>
      <Script
        id={`breadcrumb-jsonld-${items.map((i) => i.href).join("-").replace(/\//g, "_")}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-500 dark:text-gray-400">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1">
                {index > 0 && (
                  <span aria-hidden="true" className="text-gray-300 dark:text-gray-600 select-none">
                    ›
                  </span>
                )}
                {isLast ? (
                  <span
                    className="text-gray-700 dark:text-gray-300 font-medium"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
