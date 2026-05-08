import { cache } from "react"
import { getPayload } from "payload"
import config from "@payload-config"

export type ProductOverride = {
  id: string | number
  squareItemId: string
  productNameSnapshot?: string | null
  featuredOnHomepage?: boolean | null
  displayOrder?: number | null
  longDescription?: unknown
  additionalImage?: unknown
  seo?: {
    metaTitle?: string | null
    metaDescription?: string | null
  } | null
}

/**
 * Loads every product override in a single query, keyed by Square item id.
 * Memoized per-request so multiple components can read overrides without
 * hitting the database repeatedly.
 */
export const getProductOverridesByItemId = cache(
  async (): Promise<Map<string, ProductOverride>> => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: "product-overrides",
      limit: 1000,
      depth: 1,
      overrideAccess: true,
    })
    const map = new Map<string, ProductOverride>()
    for (const doc of result.docs as ProductOverride[]) {
      if (doc.squareItemId) map.set(doc.squareItemId, doc)
    }
    return map
  },
)

export async function getProductOverride(
  squareItemId: string,
): Promise<ProductOverride | null> {
  const map = await getProductOverridesByItemId()
  return map.get(squareItemId) ?? null
}

/**
 * Cheap check for whether a Lexical editorState has any visible text. Lets
 * pages skip rendering an empty rich-text block (which Lexical otherwise
 * draws as an empty paragraph).
 */
export function lexicalHasText(data: unknown): boolean {
  if (!data || typeof data !== "object") return false
  const root = (data as { root?: unknown }).root
  return walk(root)
}

function walk(node: unknown): boolean {
  if (!node || typeof node !== "object") return false
  const n = node as { text?: unknown; children?: unknown }
  if (typeof n.text === "string" && n.text.trim().length > 0) return true
  if (Array.isArray(n.children)) {
    for (const child of n.children) {
      if (walk(child)) return true
    }
  }
  return false
}

/**
 * Shape of a populated Media upload field (depth >= 1). Only the bits the
 * storefront cares about — alt text and the public URL.
 */
export type MediaUpload = {
  id: string | number
  alt?: string | null
  url?: string | null
}

export function asMedia(value: unknown): MediaUpload | null {
  if (!value || typeof value !== "object") return null
  const v = value as MediaUpload
  if (typeof v.url === "string" && v.url.length > 0) return v
  return null
}
