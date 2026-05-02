import { cache } from "react"
import { unstable_cache as nextCache } from "next/cache"
import type { CatalogObject } from "square"
import { getSquareClient } from "./client"
import { withSquare } from "./errors"
import { CATALOG_CACHE_TAG } from "./queries"

export type CatalogDiscount = {
  id: string
  name: string
  /** "FIXED_PERCENTAGE" or "FIXED_AMOUNT" — informational only. */
  discountType: string
  percentage: string | null
  amountMoney: { amount: number; currency: string } | null
}

/** Fetches all CatalogDiscount objects from Square. Cached with the catalog tag. */
const cachedFetchDiscounts = nextCache(
  async (): Promise<CatalogDiscount[]> => {
    try {
      return await fetchDiscounts()
    } catch (err) {
      console.error("[discounts] Square fetch failed:", err)
      return []
    }
  },
  ["square-discounts"],
  { tags: [CATALOG_CACHE_TAG], revalidate: 3600 },
)

export const getDiscounts = cache(
  async (): Promise<CatalogDiscount[]> => cachedFetchDiscounts(),
)

async function fetchDiscounts(): Promise<CatalogDiscount[]> {
  return withSquare("catalog.list.discounts", async () => {
    const client = getSquareClient()
    const page = await client.catalog.list({ types: "DISCOUNT" })
    const out: CatalogDiscount[] = []
    for await (const obj of page) {
      const d = mapDiscount(obj)
      if (d) out.push(d)
    }
    return out
  })
}

function mapDiscount(obj: CatalogObject): CatalogDiscount | null {
  if (obj.type !== "DISCOUNT" || !obj.id) return null
  const data = obj.discountData
  if (!data?.name) return null
  const amount = data.amountMoney
  return {
    id: obj.id,
    name: data.name,
    discountType: data.discountType ?? "",
    percentage: data.percentage ?? null,
    amountMoney:
      amount?.amount && amount.currency
        ? {
            amount: Number(amount.amount) / 100,
            currency: amount.currency,
          }
        : null,
  }
}

/** Find a discount whose name matches the user-entered code (case-insensitive). */
export async function findDiscountByCode(
  code: string,
): Promise<CatalogDiscount | null> {
  const trimmed = code.trim()
  if (!trimmed) return null
  const all = await getDiscounts()
  const lower = trimmed.toLowerCase()
  return all.find((d) => d.name.toLowerCase() === lower) ?? null
}
