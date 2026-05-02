import type { Metadata } from "next"
import type { Product } from "@/lib/square/catalog"
import { getCatalogGrouped } from "@/lib/square/queries"
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

/**
 * Round-robin pick: walk categories in order, take one product from each, loop
 * until we have `count` products. Gives the homepage variety instead of N
 * products from the same category.
 */
function pickFeatured(
  categories: { products: Product[] }[],
  idToCategory: Map<string, { slug: string }>,
  count = 4,
): FeaturedProduct[] {
  const queues = categories.map((c) => [...c.products])
  const out: FeaturedProduct[] = []
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
      const categorySlug =
        next.categoryIds
          .map((id) => idToCategory.get(id)?.slug)
          .find((s): s is string => Boolean(s)) ?? null
      out.push({ ...next, categorySlug })
    }
  }
  return out
}

export default async function HomePage() {
  const { categories, idToCategory } = await getCatalogGrouped()

  const specialtiesData: SpecialtyCard[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    productCount: c.products.length,
    coverImage: c.products.find((p) => p.imageUrls[0])?.imageUrls[0] ?? null,
  }))

  const featured = pickFeatured(categories, idToCategory, 4)

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
