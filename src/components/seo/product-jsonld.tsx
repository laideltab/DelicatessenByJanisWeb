import { siteConfig } from "@/lib/site-config"
import type { Product } from "@/lib/square/catalog"
import type { ProductReview } from "@/lib/payload/content"

interface ProductJsonLdProps {
  product: Product
  /** Canonical path for the product on this site, e.g. "/shop/cakes/chocolate". */
  path: string
  /** Approved customer reviews — adds AggregateRating + Review when present. */
  reviews?: ProductReview[]
}

/**
 * Schema.org Product JSON-LD with one Offer per variation (or AggregateOffer
 * when more than one). Falls back to a single Offer using basePrice when there
 * are no variations with price.
 */
export function ProductJsonLd({ product, path, reviews }: ProductJsonLdProps) {
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

  if (reviews && reviews.length > 0) {
    const average =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: average.toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    }
    data.review = reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: r.message,
      ...(r.createdAt ? { datePublished: r.createdAt.slice(0, 10) } : {}),
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
