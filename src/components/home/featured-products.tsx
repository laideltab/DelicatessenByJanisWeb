import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/square/catalog"

type FeaturedProduct = Product & { categorySlug: string | null }

function formatPrice(price: Product["basePrice"]): string {
  if (!price) return ""
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
  }).format(price.amount)
}

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

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => {
            const href = p.categorySlug
              ? `/shop/${p.categorySlug}/${p.slug}`
              : `/shop/${p.slug}`
            const image = p.imageUrls[0]
            return (
              <li key={p.id}>
                <Link
                  href={href}
                  className="group block overflow-hidden rounded-xl bg-card ring-1 ring-blush-100 transition hover:-translate-y-0.5 hover:ring-2 hover:ring-blush-200"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-blush-100">
                    {image ? (
                      <Image
                        src={image}
                        alt={p.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="font-display text-5xl text-blush-200">
                          {p.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg leading-tight text-ink-800">
                      {p.name}
                    </h3>
                    {p.basePrice ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        From {formatPrice(p.basePrice)}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
