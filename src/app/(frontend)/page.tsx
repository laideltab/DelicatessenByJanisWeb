import type { Metadata } from "next"
import { fetchCatalog, type Category, type Product } from "@/lib/square/catalog"
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

type CategoryWithCount = Category & { productCount: number }
type FeaturedProduct = Product & { categorySlug: string | null }

async function getHomeData(): Promise<{
  categories: CategoryWithCount[]
  featured: FeaturedProduct[]
}> {
  try {
    const { products, categories } = await fetchCatalog()
    const slugById = new Map(categories.map((c) => [c.id, c.slug]))
    const countById = new Map<string, number>()
    for (const p of products) {
      for (const cid of p.categoryIds) {
        countById.set(cid, (countById.get(cid) ?? 0) + 1)
      }
    }
    return {
      categories: categories.map((c) => ({
        ...c,
        productCount: countById.get(c.id) ?? 0,
      })),
      featured: products.slice(0, 4).map((p) => ({
        ...p,
        categorySlug: p.categoryIds[0]
          ? slugById.get(p.categoryIds[0]) ?? null
          : null,
      })),
    }
  } catch (err) {
    console.error("[home] Square catalog unavailable:", err)
    return { categories: [], featured: [] }
  }
}

export default async function HomePage() {
  const { categories, featured } = await getHomeData()

  return (
    <>
      <LocalBusinessJsonLd />
      <Hero />
      <Specialties categories={categories} />
      <FeaturedProducts products={featured} />
      <AboutJanis />
      <VisitUs />
      <Newsletter />
    </>
  )
}
