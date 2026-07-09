import { cache } from "react"
import { getPayload } from "payload"
import config from "@payload-config"
import type { MediaUpload } from "@/lib/square/product-overrides"

export type Banner = {
  id: string | number
  title: string
  subtitle?: string | null
  image?: MediaUpload | string | number | null
  cta?: {
    text?: string | null
    url?: string | null
  } | null
  active?: boolean | null
  order?: number | null
}

export type Testimonial = {
  id: string | number
  name: string
  message: string
  rating: "1" | "2" | "3" | "4" | "5"
  photo?: MediaUpload | string | number | null
  active?: boolean | null
}

export type GalleryImage = {
  id: string | number
  title: string
  image?: MediaUpload | string | number | null
  caption?: string | null
  category: "shop" | "products" | "events"
  order?: number | null
  active?: boolean | null
}

export type Promotion = {
  id: string | number
  title: string
  description?: string | null
  image?: MediaUpload | string | number | null
  badge?: string | null
  startDate?: string | null
  endDate?: string | null
  active?: boolean | null
}

export type BlogPost = {
  id: string | number
  title: string
  slug: string
  excerpt?: string | null
  content?: unknown
  featuredImage?: MediaUpload | string | number | null
  seo?: {
    metaTitle?: string | null
    metaDescription?: string | null
  } | null
  published?: boolean | null
  publishedAt?: string | null
}

/**
 * The first active banner (lowest display order) drives the homepage hero.
 * Returns null when Janis hasn't published one, so the hero falls back to
 * its built-in copy and video.
 */
export const getActiveBanner = cache(async (): Promise<Banner | null> => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: "banners",
    where: { active: { equals: true } },
    sort: "order",
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })
  return (result.docs[0] as Banner | undefined) ?? null
})

export const getActiveTestimonials = cache(
  async (limit = 6): Promise<Testimonial[]> => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: "testimonials",
      where: { active: { equals: true } },
      sort: "-createdAt",
      limit,
      depth: 1,
      overrideAccess: true,
    })
    return result.docs as Testimonial[]
  },
)

export const getActiveGalleryImages = cache(
  async (limit = 8): Promise<GalleryImage[]> => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: "gallery",
      where: { active: { equals: true } },
      sort: "order",
      limit,
      depth: 1,
      overrideAccess: true,
    })
    return result.docs as GalleryImage[]
  },
)

/**
 * Active promotions whose date window (when set) includes `now`. Date
 * filtering happens here rather than in the query so promos with no dates
 * still show while active.
 */
export const getCurrentPromotions = cache(
  async (limit = 4): Promise<Promotion[]> => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: "promotions",
      where: { active: { equals: true } },
      sort: "-createdAt",
      limit: 50,
      depth: 1,
      overrideAccess: true,
    })
    const now = Date.now()
    return (result.docs as Promotion[])
      .filter((p) => {
        if (p.startDate && new Date(p.startDate).getTime() > now) return false
        if (p.endDate && new Date(p.endDate).getTime() < now) return false
        return true
      })
      .slice(0, limit)
  },
)

export const getPublishedPosts = cache(
  async (limit = 50): Promise<BlogPost[]> => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: "blog",
      where: { published: { equals: true } },
      sort: "-publishedAt",
      limit,
      depth: 1,
      overrideAccess: true,
    })
    return result.docs as BlogPost[]
  },
)

export const getPostBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: "blog",
      where: {
        and: [{ slug: { equals: slug } }, { published: { equals: true } }],
      },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    })
    return (result.docs[0] as BlogPost | undefined) ?? null
  },
)
