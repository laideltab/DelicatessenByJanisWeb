import type { Metadata } from "next"
import type { Product } from "@/lib/square/catalog"
import { getCatalogGrouped } from "@/lib/square/queries"
import {
  getProductOverridesByItemId,
  type ProductOverride,
} from "@/lib/square/product-overrides"
import { Hero } from "@/components/home/hero"
import { Marquee } from "@/components/home/marquee"
import { Specialties, type SpecialtyCard } from "@/components/home/specialties"
import { FeaturedProducts } from "@/components/home/featured-products"
import { AboutJanis } from "@/components/home/about-janis"
import { VisitUs } from "@/components/home/visit-us"
import { Newsletter } from "@/components/home/newsletter"
import { LocalBusinessJsonLd } from "@/components/seo/local-business-jsonld"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Bakery & Coffee Shop",
  description:
    "Artisan cakes, coffee, and delicatessen baked every morning by Janis with hand-selected ingredients. Miami International Mall, Doral, FL.",
  openGraph: {
    title: "Delicatessen by Janis | Bakery & Coffee Shop",
    description:
      "Artisan cakes, coffee, and delicatessen baked every morning by Janis.",
    type: "website",
    locale: "en_US",
    siteName: "Delicatessen by Janis",
  },
}

type FeaturedProduct = Product & { categorySlug: string | null }

function withCategorySlug(
  p: Product,
  idToCategory: Map<string, { slug: string }>,
): FeaturedProduct {
  const categorySlug =
    p.categoryIds
      .map((id) => idToCategory.get(id)?.slug)
      .find((s): s is string => Boolean(s)) ?? null
  return { ...p, categorySlug }
}

/**
 * Pick featured products. Manually-featured overrides win first (sorted by
 * displayOrder), then round-robin across categories fills the remaining slots
 * so the homepage stays varied even if Janis only pins one or two.
 */
function pickFeatured(
  categories: { products: Product[] }[],
  idToCategory: Map<string, { slug: string }>,
  overrides: Map<string, ProductOverride>,
  count = 4,
): FeaturedProduct[] {
  const seen = new Set<string>()
  const out: FeaturedProduct[] = []

  // 1) Manually featured first.
  const allProducts = categories.flatMap((c) => c.products)
  const manuallyFeatured = allProducts
    .filter((p) => overrides.get(p.id)?.featuredOnHomepage)
    .sort((a, b) => {
      const ao = overrides.get(a.id)?.displayOrder ?? 0
      const bo = overrides.get(b.id)?.displayOrder ?? 0
      if (ao !== bo) return ao - bo
      return a.name.localeCompare(b.name)
    })

  for (const p of manuallyFeatured) {
    if (out.length >= count) break
    out.push(withCategorySlug(p, idToCategory))
    seen.add(p.id)
  }

  // 2) Round-robin fallback.
  const queues = categories.map((c) =>
    c.products.filter((p) => !seen.has(p.id)),
  )
  let exhausted = 0
  while (out.length < count && exhausted < queues.length) {
    exhausted = 0
    for (const q of queues) {
      if (out.length >= count) break
      const next = q.shift()
      if (!next) {
        exhausted += 1
        continue
      }
      out.push(withCategorySlug(next, idToCategory))
    }
  }
  return out
}

export default async function HomePage() {
  const [{ categories, idToCategory }, overrides] = await Promise.all([
    getCatalogGrouped(),
    getProductOverridesByItemId(),
  ])

  const specialtiesData: SpecialtyCard[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    productCount: c.products.length,
    coverImage: c.products.find((p) => p.imageUrls[0])?.imageUrls[0] ?? null,
  }))

  const featured = pickFeatured(categories, idToCategory, overrides, 4)

  return (
    <>
      <LocalBusinessJsonLd />
      <Hero />
      <Marquee />
      <Specialties categories={specialtiesData} />
      <FeaturedProducts products={featured} />
      <AboutJanis />
      <VisitUs />
      <Newsletter />
    </>
  )
}
