import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCatalog, getCatalogGrouped } from "@/lib/square/queries"
import { getProductOverridesByItemId } from "@/lib/square/product-overrides"
import { ProductCard, ProductGrid } from "@/components/shop/product-card"
import { Breadcrumb } from "@/components/shop/breadcrumb"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld"
import { ItemListJsonLd } from "@/components/seo/item-list-jsonld"

export const revalidate = 60

type RouteParams = { category: string }

export async function generateStaticParams(): Promise<RouteParams[]> {
  const { categories } = await getCatalog()
  return categories.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>
}): Promise<Metadata> {
  const { category: slug } = await params
  const { slugToCategory } = await getCatalogGrouped()
  const category = slugToCategory.get(slug)
  if (!category) return {}

  const title = category.name
  const description = `Discover our ${category.name.toLowerCase()} — handcrafted by Janis with hand-selected ingredients.`
  const path = `/shop/${slug}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | Delicatessen by Janis`,
      description,
      type: "website",
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Delicatessen by Janis`,
      description,
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<RouteParams>
}) {
  const { category: slug } = await params
  const [{ categories }, overrides] = await Promise.all([
    getCatalogGrouped(),
    getProductOverridesByItemId(),
  ])
  const category = categories.find((c) => c.slug === slug)

  if (!category) notFound()

  // Sort by override displayOrder ASC; equal orders preserve Square's order.
  const inCategory = category.products
    .map((p, i) => ({ p, i }))
    .sort((a, b) => {
      const ao = overrides.get(a.p.id)?.displayOrder ?? 0
      const bo = overrides.get(b.p.id)?.displayOrder ?? 0
      if (ao !== bo) return ao - bo
      return a.i - b.i
    })
    .map(({ p }) => p)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: category.name, path: `/shop/${category.slug}` },
        ]}
      />
      <ItemListJsonLd
        name={category.name}
        items={inCategory.map((p) => ({
          name: p.name,
          path: `/shop/${category.slug}/${p.slug}`,
        }))}
      />

      <div className="bg-sugar-100 py-12 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "Shop", href: "/shop" },
              { name: category.name },
            ]}
          />
        </div>
      </div>

      <section
        aria-labelledby="category-heading"
        className="bg-sugar-100 pb-20 sm:pb-24"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-ink-800">
              Category
            </p>
            <h1
              id="category-heading"
              className="mt-3 font-display text-4xl leading-tight text-ink-900 sm:text-5xl md:text-6xl"
            >
              {category.name}
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              {inCategory.length === 0
                ? "Coming soon"
                : inCategory.length === 1
                ? "1 product available"
                : `${inCategory.length} products available`}
            </p>
          </div>

          {inCategory.length === 0 ? (
            <p className="text-muted-foreground">
              Nothing in this category yet — check back soon.
            </p>
          ) : (
            <>
              <h2 className="sr-only">Products in {category.name}</h2>
              <ProductGrid>
                {inCategory.map((p) => (
                  <li key={p.id}>
                    <ProductCard product={p} categorySlug={category.slug} />
                  </li>
                ))}
              </ProductGrid>
            </>
          )}
        </div>
      </section>
    </>
  )
}
