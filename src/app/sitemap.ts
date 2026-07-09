import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site-config"
import { getCatalogGrouped } from "@/lib/square/queries"
import { getPublishedPosts } from "@/lib/payload/content"

/**
 * Single-file sitemap for delicatessenbyjanis.com. Square catalog drives the
 * dynamic URLs; nextCache + the Square webhook keep this fresh. The 1-hour
 * revalidate is a fallback for missed webhook deliveries.
 */
export const revalidate = 3600

const STATIC_PAGES: Array<{
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  priority: number
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/shop", changeFrequency: "daily", priority: 0.9 },
  { path: "/menu", changeFrequency: "daily", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/memberships", changeFrequency: "monthly", priority: 0.7 },
  { path: "/special-orders", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.6 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
]

function url(path: string): string {
  if (path === "/") return siteConfig.url
  return `${siteConfig.url}${path}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: url(p.path),
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))

  let categoryEntries: MetadataRoute.Sitemap = []
  const productEntries: MetadataRoute.Sitemap = []

  try {
    const { categories, idToCategory } = await getCatalogGrouped()

    categoryEntries = categories.map((c) => ({
      url: url(`/shop/${c.slug}`),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    }))

    for (const cat of categories) {
      for (const p of cat.products) {
        // Use the first valid category as the canonical URL parent so each
        // product appears once even when assigned to multiple categories.
        const primaryCatId = p.categoryIds.find((id) => idToCategory.has(id))
        const primaryCat = primaryCatId ? idToCategory.get(primaryCatId) : null
        if (primaryCat?.slug !== cat.slug) continue

        productEntries.push({
          url: url(`/shop/${cat.slug}/${p.slug}`),
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
          images: p.imageUrls.length > 0 ? [p.imageUrls[0]] : undefined,
        })
      }
    }
  } catch (err) {
    console.error("[sitemap] Square catalog unavailable:", err)
  }

  let blogEntries: MetadataRoute.Sitemap = []
  try {
    const posts = await getPublishedPosts()
    blogEntries = posts.map((p) => ({
      url: url(`/blog/${p.slug}`),
      lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
      changeFrequency: "monthly",
      priority: 0.5,
    }))
  } catch (err) {
    console.error("[sitemap] Blog posts unavailable:", err)
  }

  return [
    ...staticEntries,
    ...categoryEntries,
    ...productEntries,
    ...blogEntries,
  ]
}
