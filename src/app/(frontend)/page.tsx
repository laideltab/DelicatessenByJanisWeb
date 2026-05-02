import type { Metadata } from "next"
import type { Product } from "@/lib/square/catalog"
import { getCatalogGrouped } from "@/lib/square/queries"
import { Hero } from "@/components/home/hero"
import { Specialties } from "@/components/home/specialties"
import { FeaturedProducts } from "@/components/home/featured-products"
import { AboutJanis } from "@/components/home/about-janis"
import { VisitUs } from "@/components/home/visit-us"
import { Newsletter } from "@/components/home/newsletter"
import { LocalBusinessJsonLd } from "@/components/seo/local-business-jsonld"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Bakery & Coffee Shop",
  description:
    "Artisan cakes, coffee, and delicatessen baked every morning by Janis with hand-selected ingredients. Tampa, FL.",
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

export default async function HomePage() {
  const { categories, products, idToCategory } = await getCatalogGrouped()

  const specialtiesData = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    productCount: c.products.length,
  }))

  const featured: FeaturedProduct[] = products.slice(0, 4).map((p) => ({
    ...p,
    categorySlug: p.categoryIds
      .map((id) => idToCategory.get(id)?.slug)
      .find((s): s is string => Boolean(s)) ?? null,
  }))

  return (
    <>
      <LocalBusinessJsonLd />
      <Hero />
      <Specialties categories={specialtiesData} />
      <FeaturedProducts products={featured} />
      <AboutJanis />
      <VisitUs />
      <Newsletter />
    </>
  )
}
