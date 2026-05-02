import type { CatalogObject, CatalogItem, CatalogItemVariation, Money } from "square"
import { getSquareClient } from "./client"
import { withSquare } from "./errors"
import { fetchInventoryCounts, type InventorySnapshot } from "./inventory"
import { slugify } from "@/lib/utils"

export type Money_ = { amount: number; currency: string }

export type ProductVariation = {
  id: string
  name: string
  price: Money_ | null
  sku: string | null
  ordinal: number
  /**
   * Whether Square tracks inventory for this variation. When false, the
   * variation is always considered available (e.g. a bottomless coffee).
   */
  trackInventory: boolean
  /** IN_STOCK quantity at the configured location, or null if untracked. */
  stock: number | null
  /** Convenience: untracked or stock > 0. */
  inStock: boolean
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  descriptionHtml: string | null
  imageUrls: string[]
  categoryIds: string[]
  variations: ProductVariation[]
  basePrice: Money_ | null
  isArchived: boolean
  /** True if any variation is in stock (or any variation is untracked). */
  inStock: boolean
}

export type Category = {
  id: string
  name: string
  slug: string
}

const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA",
  "PYG", "RWF", "UGX", "VND", "VUV", "XAF", "XOF", "XPF",
])

function moneyToFloat(money: Money | null | undefined): Money_ | null {
  if (!money?.amount || !money.currency) return null
  const amount = Number(money.amount)
  const divisor = ZERO_DECIMAL_CURRENCIES.has(money.currency) ? 1 : 100
  return { amount: amount / divisor, currency: money.currency }
}

function isItem(o: CatalogObject): o is CatalogObject & { type: "ITEM"; itemData?: CatalogItem } {
  return o.type === "ITEM"
}
function isImage(o: CatalogObject): o is CatalogObject & { type: "IMAGE" } {
  return o.type === "IMAGE"
}
function isCategory(o: CatalogObject): o is CatalogObject & { type: "CATEGORY" } {
  return o.type === "CATEGORY"
}
function isVariation(
  o: CatalogObject,
): o is CatalogObject & { type: "ITEM_VARIATION"; itemVariationData?: CatalogItemVariation } {
  return o.type === "ITEM_VARIATION"
}

function mapVariation(
  obj: CatalogObject,
  inventory: InventorySnapshot,
): ProductVariation | null {
  if (!isVariation(obj)) return null
  const data = obj.itemVariationData
  const trackInventory = data?.trackInventory === true
  const stock = trackInventory ? inventory.get(obj.id) ?? 0 : null
  const inStock = !trackInventory || (stock !== null && stock > 0)

  return {
    id: obj.id,
    name: data?.name ?? "",
    price: moneyToFloat(data?.priceMoney),
    sku: data?.sku ?? null,
    ordinal: data?.ordinal ?? 0,
    trackInventory,
    stock,
    inStock,
  }
}

function mapItem(
  obj: CatalogObject & { type: "ITEM" },
  imageUrlById: Map<string, string>,
  inventory: InventorySnapshot,
): Product {
  const data = obj.itemData
  const name = data?.name ?? ""
  const variations =
    data?.variations
      ?.map((v) => mapVariation(v, inventory))
      .filter((v): v is ProductVariation => v !== null)
      .sort((a, b) => a.ordinal - b.ordinal) ?? []

  const imageIds = data?.imageIds ?? []
  const imageUrls = imageIds
    .map((id) => imageUrlById.get(id))
    .filter((u): u is string => Boolean(u))

  const categoryIds = [
    ...(data?.categories?.map((c) => c.id).filter((id): id is string => Boolean(id)) ?? []),
    ...(data?.categoryId ? [data.categoryId] : []),
  ]

  // A product is in stock if at least one variation is available; if there are
  // no variations we conservatively treat the product as available.
  const inStock =
    variations.length === 0 || variations.some((v) => v.inStock)

  return {
    id: obj.id,
    name,
    slug: slugify(name),
    description: data?.descriptionPlaintext ?? data?.description ?? "",
    descriptionHtml: data?.descriptionHtml ?? null,
    imageUrls,
    categoryIds: Array.from(new Set(categoryIds)),
    variations,
    basePrice: variations[0]?.price ?? null,
    isArchived: Boolean(data?.isArchived),
    inStock,
  }
}

export type CatalogSnapshot = {
  products: Product[]
  categories: Category[]
}

export async function fetchCatalog(): Promise<CatalogSnapshot> {
  return withSquare("catalog.list", async () => {
    const client = getSquareClient()
    const page = await client.catalog.list({ types: "ITEM,IMAGE,CATEGORY" })

    const items: (CatalogObject & { type: "ITEM" })[] = []
    const imageUrlById = new Map<string, string>()
    const categories: Category[] = []

    for await (const obj of page) {
      if (!obj.id) continue
      if (isItem(obj)) {
        items.push(obj)
      } else if (isImage(obj)) {
        const url = obj.imageData?.url
        if (url) imageUrlById.set(obj.id, url)
      } else if (isCategory(obj)) {
        const name = obj.categoryData?.name
        if (name) categories.push({ id: obj.id, name, slug: slugify(name) })
      }
    }

    const activeItems = items.filter((it) => !it.itemData?.isArchived)

    // Collect tracked variation IDs so we only ask Square for inventory we
    // actually use (calls billed per page).
    const trackedVariationIds: string[] = []
    for (const it of activeItems) {
      for (const v of it.itemData?.variations ?? []) {
        if (
          v.type === "ITEM_VARIATION" &&
          v.id &&
          v.itemVariationData?.trackInventory === true
        ) {
          trackedVariationIds.push(v.id)
        }
      }
    }

    const inventory = await fetchInventoryCounts(trackedVariationIds)

    const products = activeItems.map((it) =>
      mapItem(it, imageUrlById, inventory),
    )

    // TODO (Sesion 3.1 follow-up): mirror imageUrls into Cloudflare R2 for
    // permanence and a custom CDN domain. For now images are served directly
    // from Square's CDN — see next.config remotePatterns.
    return { products, categories }
  })
}

export async function getProductById(id: string): Promise<Product | null> {
  return withSquare("catalog.object.get", async () => {
    const client = getSquareClient()
    const response = await client.catalog.object.get({
      objectId: id,
      includeRelatedObjects: true,
    })

    const main = response.object
    if (!main || !isItem(main)) return null

    const imageUrlById = new Map<string, string>()
    for (const related of response.relatedObjects ?? []) {
      if (isImage(related) && related.imageData?.url) {
        imageUrlById.set(related.id, related.imageData.url)
      }
    }

    const trackedIds: string[] = []
    for (const v of main.itemData?.variations ?? []) {
      if (
        v.type === "ITEM_VARIATION" &&
        v.id &&
        v.itemVariationData?.trackInventory === true
      ) {
        trackedIds.push(v.id)
      }
    }
    const inventory = await fetchInventoryCounts(trackedIds)

    return mapItem(main, imageUrlById, inventory)
  })
}
