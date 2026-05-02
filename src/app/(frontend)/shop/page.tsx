import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getCatalogGrouped } from "@/lib/square/queries"
import { Breadcrumb } from "@/components/shop/breadcrumb"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse every category of cakes, pastries, drinks, and savories from Delicatessen by Janis.",
  openGraph: {
    title: "Shop | Delicatessen by Janis",
    description:
      "Browse every category of cakes, pastries, drinks, and savories from Delicatessen by Janis.",
    type: "website",
  },
}

export default async function ShopPage() {
  const { categories } = await getCatalogGrouped()

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
        ]}
      />

      <div className="bg-sugar-100 py-12 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "Shop" },
            ]}
          />
        </div>
      </div>

      <section
        aria-labelledby="shop-heading"
        className="bg-sugar-100 pb-20 sm:pb-24"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-ink-800">
              All categories
            </p>
            <h1
              id="shop-heading"
              className="mt-3 font-display text-4xl leading-tight text-ink-900 sm:text-5xl md:text-6xl"
            >
              Shop
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              From birthday cakes to morning espresso — pick a category to see
              what&rsquo;s in the case today.
            </p>
          </div>

          {categories.length === 0 ? (
            <p className="text-muted-foreground">
              The catalog is currently empty. Check back soon.
            </p>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/shop/${c.slug}`}
                    className="group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-2xl bg-card p-8 ring-1 ring-blush-100 transition hover:-translate-y-0.5 hover:ring-2 hover:ring-blush-200"
                  >
                    <div
                      aria-hidden
                      className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-blush-100 opacity-60 transition-transform group-hover:scale-110"
                    />
                    <div className="relative">
                      <p className="text-xs font-medium uppercase tracking-[0.28em] text-blush-200">
                        Category
                      </p>
                      <h2 className="mt-3 font-display text-3xl leading-tight text-ink-900">
                        {c.name}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {c.products.length === 0
                          ? "Coming soon"
                          : c.products.length === 1
                          ? "1 product"
                          : `${c.products.length} products`}
                      </p>
                    </div>

                    <span className="relative inline-flex items-center gap-1.5 text-sm font-medium text-ink-800">
                      Browse
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
