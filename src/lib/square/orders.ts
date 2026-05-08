import type { Order, OrderState } from "square"
import { getLocationId, getSquareClient } from "./client"
import { withSquare } from "./errors"

export type SearchOrdersOptions = {
  states?: OrderState[]
  cursor?: string
  limit?: number
}

export type SearchOrdersResult = {
  orders: Order[]
  cursor: string | null
}

/**
 * Returns recent orders for the configured location, newest first.
 * Pass `cursor` from a previous result to page forward.
 */
export async function searchOrders({
  states,
  cursor,
  limit = 50,
}: SearchOrdersOptions = {}): Promise<SearchOrdersResult> {
  const locationId = getLocationId()
  const client = getSquareClient()

  const resp = await withSquare("orders.search", () =>
    client.orders.search({
      locationIds: [locationId],
      cursor,
      limit,
      query: {
        filter: states?.length ? { stateFilter: { states } } : undefined,
        sort: {
          sortField: "CREATED_AT",
          sortOrder: "DESC",
        },
      },
    }),
  )

  return {
    orders: resp.orders ?? [],
    cursor: resp.cursor ?? null,
  }
}

export async function retrieveOrder(orderId: string): Promise<Order | null> {
  const client = getSquareClient()
  const resp = await withSquare("orders.get", () =>
    client.orders.get({ orderId }),
  )
  return resp.order ?? null
}

export type FulfillmentTransition = "PREPARED" | "COMPLETED" | "CANCELED"

/**
 * Updates a single fulfillment's state. Square's UpdateOrder requires the
 * current order `version`; the caller should pass the version it just read
 * from `retrieveOrder`. The returned order carries the new version for any
 * subsequent updates.
 */
export async function updateFulfillmentState(args: {
  orderId: string
  fulfillmentUid: string
  newState: FulfillmentTransition
  version: number
  locationId?: string
}): Promise<Order | null> {
  const client = getSquareClient()
  const locationId = args.locationId ?? getLocationId()

  const resp = await withSquare("orders.update", () =>
    client.orders.update({
      orderId: args.orderId,
      idempotencyKey: `fulfill-${args.orderId}-${args.fulfillmentUid}-${args.newState}-${Date.now()}`,
      order: {
        locationId,
        version: args.version,
        fulfillments: [
          {
            uid: args.fulfillmentUid,
            state: args.newState,
          },
        ],
      },
    }),
  )

  return resp.order ?? null
}
