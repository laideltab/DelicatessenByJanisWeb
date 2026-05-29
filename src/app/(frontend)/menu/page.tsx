import type { Metadata } from "next"
import Link from "next/link"
import { getCatalogGrouped } from "@/lib/square/queries"
import { Breadcrumb } from "@/components/shop/breadcrumb"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld"
import type { Product } from "@/lib/square/catalog"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The full Delicatessen by Janis menu — cakes, pastries, drinks, and savories, all in one place.",
  alternates: { canonical: "/menu" },
  openGraph: {
    title: "Menu | Delicatessen by Janis",
    description:
      "The full Delicatessen by Janis menu — cakes, pastries, drinks, and savories, all in one place.",
    type: "website",
    url: "/menu",
  },
  twitter: {
    card: "summary_large_image",
    title: "Menu | Delicatessen by Janis",
    description:
      "The full Delicatessen by Janis menu — cakes, pastries, drinks, and savories, all in one place.",
  },
}

function formatPrice(price: Product["basePrice"]): string {
  if (!price) return ""
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
  }).format(price.amount)
}

export default async function MenuPage() {
  const { categories } = await getCatalogGrouped()
  const populated = categories.filter((c) => c.products.length > 0)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Menu", path: "/menu" },
        ]}
      />

      <div className="bg-sugar-100 py-12 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ name: "Home", href: "/" }, { name: "Menu" }]}
          />
        </div>
      </div>

      <section
        aria-labelledby="menu-heading"
        className="bg-sugar-100 pb-12 sm:pb-16"
      >
        <div className="mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-ink-800">
            Everything we make
          </p>
          <h1
            id="menu-heading"
            className="mt-3 font-display text-4xl leading-tight text-ink-900 sm:text-5xl md:text-6xl"
          >
            Menu
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Baked fresh daily. Prices &ldquo;from&rdquo; reflect the smallest
            available size — full options live on each product page.
          </p>

          {populated.length > 1 ? (
            <nav
              aria-label="Menu sections"
              className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs"
            >
              {populated.map((c) => (
                <a
                  key={c.id}
                  href={`#${c.slug}`}
                  className="rounded-full border border-blush-200 bg-card px-3 py-1.5 font-medium uppercase tracking-widest text-ink-800 transition hover:bg-blush-100"
                >
                  {c.name}
                </a>
              ))}
            </nav>
          ) : null}
        </div>
      </section>

      <div className="mx-auto w-full max-w-4xl space-y-16 px-4 pb-24 sm:px-6 sm:space-y-20 lg:px-8">
        {populated.length === 0 ? (
          <p className="text-center text-muted-foreground">
            The menu is currently empty. Check back soon.
          </p>
        ) : (
          populated.map((c) => (
            <section
              key={c.id}
              id={c.slug}
              aria-labelledby={`section-${c.slug}`}
              className="scroll-mt-24"
            >
              <div className="mb-8 flex items-end justify-between gap-4 border-b border-blush-200 pb-4">
                <h2
                  id={`section-${c.slug}`}
                  className="font-display text-2xl leading-tight text-ink-900 sm:text-3xl"
                >
                  {c.name}
                </h2>
                <Link
                  href={`/shop/${c.slug}`}
                  className="text-xs font-medium uppercase tracking-widest text-ink-800 hover:underline"
                >
                  See all →
                </Link>
              </div>

              <ul className="divide-y divide-blush-100">
                {c.products.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/shop/${c.slug}/${p.slug}`}
                      className="group flex items-baseline justify-between gap-6 py-4 transition hover:bg-card/60"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg leading-tight text-ink-800 group-hover:underline">
                          {p.name}
                        </h3>
                        {p.description ? (
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {p.description}
                          </p>
                        ) : null}
                      </div>
                      {p.basePrice ? (
                        <span className="shrink-0 font-display text-lg text-ink-800">
                          {formatPrice(p.basePrice)}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </>
  )
}
