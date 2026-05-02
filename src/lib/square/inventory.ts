import type { InventoryCount } from "square"
import { getSquareClient, getLocationId } from "./client"
import { withSquare } from "./errors"

export type InventorySnapshot = Map<string, number>

/**
 * Fetches in-stock counts for the given variation IDs at the configured
 * location. Returns a map variationId → quantity. Variations not found in the
 * response are simply absent from the map (caller decides how to interpret).
 */
export async function fetchInventoryCounts(
  variationIds: string[],
): Promise<InventorySnapshot> {
  const map: InventorySnapshot = new Map()
  if (variationIds.length === 0) return map

  return withSquare("inventory.batchGetCounts", async () => {
    const client = getSquareClient()
    const locationId = getLocationId()

    const page = await client.inventory.batchGetCounts({
      catalogObjectIds: variationIds,
      locationIds: [locationId],
    })

    for await (const count of page) {
      addCount(map, count)
    }
    return map
  })
}

function addCount(map: InventorySnapshot, count: InventoryCount) {
  if (count.state !== "IN_STOCK") return
  const id = count.catalogObjectId
  if (!id) return
  const qty = Number(count.quantity ?? 0)
  if (Number.isNaN(qty)) return
  map.set(id, (map.get(id) ?? 0) + qty)
}
