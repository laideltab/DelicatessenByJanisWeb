import { siteConfig } from "@/lib/site-config"

type ListItemInput = {
  name: string
  path: string
}

/**
 * Renders a Schema.org ItemList JSON-LD block — used on category and menu
 * pages so search engines can ingest the product collection structure.
 */
export function ItemListJsonLd({
  name,
  items,
}: {
  name: string
  items: ListItemInput[]
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: `${siteConfig.url}${item.path}`,
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
