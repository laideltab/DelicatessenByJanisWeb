import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/square/catalog"

function formatPrice(price: Product["basePrice"]): string {
  if (!price) return ""
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
  }).format(price.amount)
}

interface ProductCardProps {
  product: Product
  /** Used to build the canonical URL `/shop/[category]/[slug]`. */
  categorySlug: string | null
}

export function ProductCard({ product, categorySlug }: ProductCardProps) {
  const href = categorySlug
    ? `/shop/${categorySlug}/${product.slug}`
    : `/shop/${product.slug}`
  const image = product.imageUrls[0]

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl bg-card ring-1 ring-blush-100 transition hover:-translate-y-0.5 hover:ring-2 hover:ring-blush-200"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-blush-100">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-5xl text-blush-200">
              {product.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg leading-tight text-ink-800">
          {product.name}
        </h3>
        {product.basePrice ? (
          <p className="mt-1 text-sm text-muted-foreground">
            From {formatPrice(product.basePrice)}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

export function ProductGrid({ children }: { children: React.ReactNode }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{children}</ul>
  )
}
