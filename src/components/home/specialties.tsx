import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Category } from "@/lib/square/catalog"

type CategoryWithCount = Category & { productCount: number }

export function Specialties({ categories }: { categories: CategoryWithCount[] }) {
  if (categories.length === 0) return null

  return (
    <section
      aria-labelledby="specialties-heading"
      className="bg-blush-100 py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-ink-800">
            Our specialties
          </p>
          <h2
            id="specialties-heading"
            className="mt-3 font-display text-3xl leading-tight text-ink-900 sm:text-4xl md:text-5xl"
          >
            Every category, made by the same hands.
          </h2>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/shop/${c.slug}`}
                className="group relative flex h-full flex-col justify-between gap-6 rounded-xl bg-card p-6 ring-1 ring-inset ring-blush-200/50 transition hover:-translate-y-0.5 hover:ring-2 hover:ring-blush-200"
              >
                <div>
                  <h3 className="font-display text-2xl leading-tight text-ink-800">
                    {c.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {c.productCount === 0
                      ? "Coming soon"
                      : c.productCount === 1
                      ? "1 product available"
                      : `${c.productCount} products available`}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-800">
                  View category
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
