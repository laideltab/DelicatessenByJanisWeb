import { siteConfig } from "@/lib/site-config"
import type { Product } from "@/lib/square/catalog"

interface ProductJsonLdProps {
  product: Product
  /** Canonical path for the product on this site, e.g. "/shop/cakes/chocolate". */
  path: string
}

/**
 * Schema.org Product JSON-LD with one Offer per variation (or AggregateOffer
 * when more than one). Falls back to a single Offer using basePrice when there
 * are no variations with price.
 */
export function ProductJsonLd({ product, path }: ProductJsonLdProps) {
  const url = `${siteConfig.url}${path}`
  const images =
    product.imageUrls.length > 0 ? product.imageUrls : undefined

  const pricedVariations = product.variations.filter((v) => v.price)
  const availability = product.inStock
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock"

  const offers = (() => {
    if (pricedVariations.length > 1) {
      const amounts = pricedVariations.map((v) => v.price!.amount)
      const currency = pricedVariations[0].price!.currency
      return {
        "@type": "AggregateOffer",
        priceCurrency: currency,
        lowPrice: Math.min(...amounts).toFixed(2),
        highPrice: Math.max(...amounts).toFixed(2),
        offerCount: pricedVariations.length,
        availability,
        url,
      }
    }
    const price = pricedVariations[0]?.price ?? product.basePrice
    if (!price) return undefined
    return {
      "@type": "Offer",
      priceCurrency: price.currency,
      price: price.amount.toFixed(2),
      availability,
      url,
    }
  })()

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || siteConfig.description,
    sku: product.variations[0]?.sku ?? product.id,
    url,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
  }

  if (images) data.image = images
  if (offers) data.offers = offers

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
