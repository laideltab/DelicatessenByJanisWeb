import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ProductCard, ProductGrid } from "@/components/shop/product-card"
import type { Product } from "@/lib/square/catalog"

type FeaturedProduct = Product & { categorySlug: string | null }

export function FeaturedProducts({ products }: { products: FeaturedProduct[] }) {
  if (products.length === 0) return null

  return (
    <section
      aria-labelledby="featured-heading"
      className="relative bg-sugar-100 py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
              <span className="h-px w-6 bg-brass-500" aria-hidden />
              Counter favorites
            </p>
            <h2
              id="featured-heading"
              className="mt-4 font-display text-3xl leading-[1.05] tracking-tight text-ink-900 sm:text-4xl md:text-5xl"
            >
              What everyone is
              <span className="italic text-ink-800"> reaching for.</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-[0.22em] text-ink-800 underline-offset-4 hover:underline"
          >
            View all
            <ArrowUpRight className="h-4 w-4" aria-hidden />
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
