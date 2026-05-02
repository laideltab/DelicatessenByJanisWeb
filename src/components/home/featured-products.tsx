import Link from "next/link"
import { ProductCard, ProductGrid } from "@/components/shop/product-card"
import type { Product } from "@/lib/square/catalog"

type FeaturedProduct = Product & { categorySlug: string | null }

export function FeaturedProducts({ products }: { products: FeaturedProduct[] }) {
  if (products.length === 0) return null

  return (
    <section
      aria-labelledby="featured-heading"
      className="bg-sugar-100 py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-ink-800">
              Best sellers
            </p>
            <h2
              id="featured-heading"
              className="mt-3 font-display text-3xl leading-tight text-ink-900 sm:text-4xl md:text-5xl"
            >
              Counter favorites.
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-medium text-ink-800 underline-offset-4 hover:underline"
          >
            View all →
          </Link>
        </div>

        <ProductGrid>
          {products.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} categorySlug={p.categorySlug} />
            </li>
          ))}
        </ProductGrid>
      </div>
    </section>
  )
}
