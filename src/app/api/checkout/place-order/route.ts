import { after, NextResponse } from "next/server"
import type { Order, Currency } from "square"
import { getSquareClient, getLocationId } from "@/lib/square/client"
import { withSquare } from "@/lib/square/errors"
import { getCatalog } from "@/lib/square/queries"
import { findDiscountByCode } from "@/lib/square/discounts"
import { placeOrderSchema } from "@/lib/schemas/checkout"
import { emailOrderFromSquare, sendOrderEmails } from "@/lib/email/send"

export const runtime = "nodejs"

export async function POST(req: Request) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = placeOrderSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 },
    )
  }

  const {
    customer,
    fulfillment,
    items,
    promoCode,
    paymentToken,
    idempotencyKey,
  } = parsed.data

  // ── Validate cart against current catalog snapshot ────────────────────────
  const { products } = await getCatalog()
  const variationIndex = new Map<
    string,
    {
      productName: string
      variation: (typeof products)[number]["variations"][number]
    }
  >()
  for (const p of products) {
    for (const v of p.variations) {
      variationIndex.set(v.id, { productName: p.name, variation: v })
    }
  }

  const lineItems: { catalogObjectId: string; quantity: string }[] = []
  for (const item of items) {
    const entry = variationIndex.get(item.variationId)
    if (!entry) {
      return NextResponse.json(
        { error: `Item ${item.variationId} no longer available.` },
        { status: 409 },
      )
    }
    const { variation } = entry
    if (!variation.inStock) {
      return NextResponse.json(
        { error: `${entry.productName} is sold out.` },
        { status: 409 },
      )
    }
    if (
      variation.trackInventory &&
      variation.stock !== null &&
      variation.stock < item.qty
    ) {
      return NextResponse.json(
        {
          error: `Only ${variation.stock} left of ${entry.productName}. Please adjust your cart.`,
        },
        { status: 409 },
      )
    }
    lineItems.push({
      catalogObjectId: item.variationId,
      quantity: String(item.qty),
    })
  }

  // ── Resolve promo code ────────────────────────────────────────────────────
  let discounts: { catalogObjectId: string; scope: "ORDER" }[] | undefined
  if (promoCode) {
    const found = await findDiscountByCode(promoCode)
    if (found) {
      discounts = [{ catalogObjectId: found.id, scope: "ORDER" }]
    }
  }

  const locationId = getLocationId()
  const recipient = {
    displayName: customer.name,
    emailAddress: customer.email,
    phoneNumber: customer.phone,
  }

  const fulfillmentForOrder: Order["fulfillments"] =
    fulfillment.type === "pickup"
      ? [
          {
            type: "PICKUP",
            state: "PROPOSED",
            pickupDetails: {
              recipient,
              pickupAt: fulfillment.pickupAt
                ? toRfc3339(fulfillment.pickupAt)
                : undefined,
              note: fulfillment.notes || undefined,
            },
          },
        ]
      : [
          {
            type: "DELIVERY",
            state: "PROPOSED",
            deliveryDetails: {
              recipient: {
                ...recipient,
                address: {
                  addressLine1: fulfillment.address.street,
                  addressLine2: fulfillment.address.unit || undefined,
                  locality: fulfillment.address.city,
                  administrativeDistrictLevel1: fulfillment.address.state,
                  postalCode: fulfillment.address.postalCode,
                  country: "US",
                },
              },
              note: fulfillment.notes || undefined,
            },
          },
        ]

  const order: Order = {
    locationId,
    lineItems,
    discounts,
    fulfillments: fulfillmentForOrder,
  }

  const client = getSquareClient()

  // ── Create order ──────────────────────────────────────────────────────────
  let orderId: string
  let totalAmount: bigint
  let currency: Currency
  let createdOrder: Order | null = null
  try {
    const createOrderResp = await withSquare("orders.create", () =>
      client.orders.create({
        idempotencyKey: `order-${idempotencyKey}`,
        order,
      }),
    )
    const created = createOrderResp.order
    if (
      !created?.id ||
      !created.totalMoney?.amount ||
      !created.totalMoney.currency
    ) {
      return NextResponse.json(
        { error: "Square did not return a complete order." },
        { status: 502 },
      )
    }
    orderId = created.id
    totalAmount = created.totalMoney.amount
    currency = created.totalMoney.currency
    createdOrder = created
  } catch (err) {
    console.error("[checkout] orders.create failed:", err)
    return NextResponse.json(
      { error: "Could not create the order." },
      { status: 502 },
    )
  }

  // ── Charge the source token ───────────────────────────────────────────────
  try {
    await withSquare("payments.create", () =>
      client.payments.create({
        sourceId: paymentToken,
        idempotencyKey: `pay-${idempotencyKey}`,
        amountMoney: {
          amount: totalAmount,
          currency,
        },
        orderId,
        locationId,
        buyerEmailAddress: customer.email,
        autocomplete: true,
        note: `Web checkout — ${customer.name}`,
        referenceId: orderId.slice(0, 40),
      }),
    )
  } catch (err) {
    console.error("[checkout] payments.create failed:", err)
    return NextResponse.json(
      {
        error:
          "Payment was declined. Your card was not charged. Please try a different card or contact us.",
        orderId,
      },
      { status: 402 },
    )
  }

  // Fire confirmation + admin emails after the response is sent so the buyer
  // doesn't wait on Resend. Failures are logged inside sendOrderEmails.
  if (createdOrder) {
    const emailOrder = emailOrderFromSquare(createdOrder, customer)
    if (emailOrder) {
      after(async () => {
        await sendOrderEmails(emailOrder)
      })
    }
  }

  return NextResponse.json({ ok: true, orderId })
}

/**
 * Accepts either a full ISO 8601 string ("2026-05-10T15:00:00Z") or a local
 * datetime-local input value ("2026-05-10T15:00") and returns RFC 3339.
 */
function toRfc3339(input: string): string {
  if (input.includes("Z") || /[+-]\d\d:?\d\d$/.test(input)) return input
  // Treat local datetime-local input as the local timezone of the server.
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString()
  }
  return date.toISOString()
}

