import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCatalogGrouped } from "@/lib/square/queries"
import type { Product } from "@/lib/square/catalog"
import { Breadcrumb } from "@/components/shop/breadcrumb"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld"
import { ProductJsonLd } from "@/components/seo/product-jsonld"
import { ProductGallery } from "@/components/shop/product-gallery"
import { ProductPurchasePanel } from "@/components/shop/product-purchase-panel"
import { ProductCard, ProductGrid } from "@/components/shop/product-card"
import { formatPrice } from "@/lib/utils"

export const revalidate = 60

type RouteParams = { category: string; product: string }

export async function generateStaticParams(): Promise<RouteParams[]> {
  const { categories, idToCategory } = await getCatalogGrouped()
  const out: RouteParams[] = []
  for (const cat of categories) {
    for (const p of cat.products) {
      const primaryCatId = p.categoryIds.find((id) => idToCategory.has(id))
      const primaryCat = primaryCatId
        ? idToCategory.get(primaryCatId)
        : undefined
      if (primaryCat?.slug !== cat.slug) continue
      out.push({ category: cat.slug, product: p.slug })
    }
  }
  return out
}

async function resolveProduct(
  categorySlug: string,
  productSlug: string,
): Promise<{
  category: { id: string; name: string; slug: string }
  product: Product
  related: Product[]
} | null> {
  const { categories, slugToCategory } = await getCatalogGrouped()
  const category = slugToCategory.get(categorySlug)
  if (!category) return null

  const enriched = categories.find((c) => c.id === category.id)
  if (!enriched) return null

  const product = enriched.products.find((p) => p.slug === productSlug)
  if (!product) return null

  const related = enriched.products
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  return { category, product, related }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>
}): Promise<Metadata> {
  const { category, product } = await params
  const data = await resolveProduct(category, product)
  if (!data) return {}

  const { product: p } = data
  const priceLabel = p.basePrice
    ? `From ${formatPrice(p.basePrice.amount, p.basePrice.currency)}.`
    : ""
  const description =
    [p.description, priceLabel].filter(Boolean).join(" ").slice(0, 160) ||
    `${p.name} — handcrafted by Delicatessen by Janis.`
  const path = `/shop/${data.category.slug}/${p.slug}`
  const ogImage = p.imageUrls[0]

  return {
    title: p.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${p.name} | Delicatessen by Janis`,
      description,
      type: "website",
      url: path,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<RouteParams>
}) {
  const { category: catSlug, product: prodSlug } = await params
  const data = await resolveProduct(catSlug, prodSlug)
  if (!data) notFound()

  const { category, product, related } = data
  const path = `/shop/${category.slug}/${product.slug}`

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: category.name, path: `/shop/${category.slug}` },
          { name: product.name, path },
        ]}
      />
      <ProductJsonLd product={product} path={path} />

      <div className="bg-sugar-100 py-10 sm:py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "Shop", href: "/shop" },
              { name: category.name, href: `/shop/${category.slug}` },
              { name: product.name },
            ]}
          />
        </div>
      </div>

      <section
        aria-labelledby="product-heading"
        className="bg-sugar-100 pb-20 sm:pb-24"
      >
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <ProductGallery
            images={product.imageUrls}
            productName={product.name}
          />

          <div className="flex flex-col gap-8">
            <header>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-blush-200">
                <Link
                  href={`/shop/${category.slug}`}
                  className="hover:text-ink-800 hover:underline"
                >
                  {category.name}
                </Link>
              </p>
              <h1
                id="product-heading"
                className="mt-3 font-display text-4xl leading-tight text-ink-900 sm:text-5xl"
              >
                {product.name}
              </h1>
              {product.basePrice ? (
                <p className="mt-4 font-display text-2xl text-ink-800">
                  {product.variations.length > 1 ? "From " : ""}
                  {formatPrice(
                    product.basePrice.amount,
                    product.basePrice.currency,
                  )}
                </p>
              ) : null}
            </header>

            {product.description ? (
              <div className="prose prose-sm max-w-none text-ink-700">
                <p className="whitespace-pre-line leading-relaxed">
                  {product.description}
                </p>
              </div>
            ) : null}

            <ProductPurchasePanel
              product={product}
              categorySlug={category.slug}
            />
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section
          aria-labelledby="related-heading"
          className="border-t border-blush-100 bg-card py-16 sm:py-20"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-ink-800">
                  Pairs well with
                </p>
                <h2
                  id="related-heading"
                  className="mt-3 font-display text-3xl leading-tight text-ink-900 sm:text-4xl"
                >
                  More from {category.name}
                </h2>
              </div>
              <Link
                href={`/shop/${category.slug}`}
                className="text-xs font-medium uppercase tracking-widest text-ink-800 hover:underline"
              >
                See all →
              </Link>
            </div>
            <ProductGrid>
              {related.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} categorySlug={category.slug} />
                </li>
              ))}
            </ProductGrid>
          </div>
        </section>
      ) : null}

      <section
        aria-labelledby="reviews-heading"
        className="border-t border-blush-100 bg-sugar-100 py-16 sm:py-20"
      >
        <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-ink-800">
            Reviews
          </p>
          <h2
            id="reviews-heading"
            className="mt-3 font-display text-3xl leading-tight text-ink-900 sm:text-4xl"
          >
            Tasted this one?
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Customer reviews are rolling out soon. In the meantime, share your
            bite with{" "}
            <a
              href="https://instagram.com/delicatessenbyjanis"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink-800 underline-offset-4 hover:underline"
            >
              @delicatessenbyjanis
            </a>
            .
          </p>
        </div>
      </section>
    </>
  )
}
