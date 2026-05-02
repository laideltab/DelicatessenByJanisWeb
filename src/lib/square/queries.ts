import { cache } from "react"
import { fetchCatalog, type Category, type Product, type CatalogSnapshot } from "./catalog"

/**
 * Request-scoped cache around fetchCatalog. Multiple page components on the
 * same render share a single Square call.
 */
export const getCatalog = cache(async (): Promise<CatalogSnapshot> => {
  try {
    return await fetchCatalog()
  } catch (err) {
    console.error("[catalog] Square unavailable, returning empty snapshot:", err)
    return { products: [], categories: [] }
  }
})

export type CategoryWithProducts = Category & {
  products: Product[]
}

/**
 * Returns categories enriched with the products that belong to each, plus a
 * lookup of category-slug → Category for breadcrumbs / linking.
 */
export const getCatalogGrouped = cache(async () => {
  const { categories, products } = await getCatalog()

  const productsByCategory = new Map<string, Product[]>()
  for (const c of categories) productsByCategory.set(c.id, [])
  for (const p of products) {
    for (const cid of p.categoryIds) {
      productsByCategory.get(cid)?.push(p)
    }
  }

  const enriched: CategoryWithProducts[] = categories.map((c) => ({
    ...c,
    products: productsByCategory.get(c.id) ?? [],
  }))

  const slugToCategory = new Map(categories.map((c) => [c.slug, c]))
  const idToCategory = new Map(categories.map((c) => [c.id, c]))

  return { categories: enriched, slugToCategory, idToCategory, products }
})

/** Find a category by URL slug (used by /shop/[category] and product pages). */
export async function getCategoryBySlug(slug: string): Promise<CategoryWithProducts | null> {
  const { categories } = await getCatalogGrouped()
  return categories.find((c) => c.slug === slug) ?? null
}

/** Return the first/primary category slug for a product, used for URL building. */
export function primaryCategorySlug(
  product: Product,
  idToSlug: Map<string, string>,
): string | null {
  for (const cid of product.categoryIds) {
    const slug = idToSlug.get(cid)
    if (slug) return slug
  }
  return null
}
