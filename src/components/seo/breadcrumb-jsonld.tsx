import { siteConfig } from "@/lib/site-config"

type Crumb = { name: string; path: string }

/**
 * Renders a Schema.org BreadcrumbList JSON-LD block. Pass an ordered array of
 * { name, path }, where `path` is the absolute path on this site (e.g. "/shop").
 */
export function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
