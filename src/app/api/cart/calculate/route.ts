import { NextResponse } from "next/server"
import type { Order } from "square"
import { getCatalog } from "@/lib/square/queries"
import { getSquareClient, getLocationId } from "@/lib/square/client"
import { withSquare } from "@/lib/square/errors"
import { findDiscountByCode } from "@/lib/square/discounts"
import {
  calculateCartSchema,
  type CalculatedTotals,
  type Money,
  type StockIssue,
} from "@/lib/schemas/cart"

export const runtime = "nodejs"

const ZERO_DECIMAL = new Set([
  "BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA",
  "PYG", "RWF", "UGX", "VND", "VUV", "XAF", "XOF", "XPF",
])

function moneyToFloat(money: Order["totalMoney"]): Money {
  if (!money?.amount || !money.currency) return { amount: 0, currency: "USD" }
  const amount = Number(money.amount)
  const divisor = ZERO_DECIMAL.has(money.currency) ? 1 : 100
  return { amount: amount / divisor, currency: money.currency }
}

export async function POST(req: Request) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = calculateCartSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 },
    )
  }
  const { items, promoCode } = parsed.data

  // Resolve current catalog so we can validate stock and look up real prices.
  const { products } = await getCatalog()
  const variationIndex = new Map<
    string,
    { product: (typeof products)[number]; variationId: string }
  >()
  for (const p of products) {
    for (const v of p.variations) {
      variationIndex.set(v.id, { product: p, variationId: v.id })
    }
  }

  const stockIssues: StockIssue[] = []
  const validLineItems: { catalogObjectId: string; quantity: string }[] = []

  for (const item of items) {
    const entry = variationIndex.get(item.variationId)
    if (!entry) {
      stockIssues.push({
        lineId: `${item.productId}:${item.variationId}`,
        productId: item.productId,
        variationId: item.variationId,
        requested: item.qty,
        available: 0,
      })
      continue
    }
    const variation = entry.product.variations.find(
      (v) => v.id === item.variationId,
    )
    if (!variation) continue

    if (!variation.inStock) {
      stockIssues.push({
        lineId: `${item.productId}:${item.variationId}`,
        productId: item.productId,
        variationId: item.variationId,
        requested: item.qty,
        available: 0,
      })
      continue
    }

    if (
      variation.trackInventory &&
      variation.stock !== null &&
      variation.stock < item.qty
    ) {
      stockIssues.push({
        lineId: `${item.productId}:${item.variationId}`,
        productId: item.productId,
        variationId: item.variationId,
        requested: item.qty,
        available: variation.stock,
      })
    }

    const allowable =
      variation.trackInventory && variation.stock !== null
        ? Math.min(item.qty, variation.stock)
        : item.qty
    if (allowable > 0) {
      validLineItems.push({
        catalogObjectId: item.variationId,
        quantity: String(allowable),
      })
    }
  }

  if (validLineItems.length === 0) {
    const empty: Money = { amount: 0, currency: "USD" }
    const result: CalculatedTotals = {
      subtotal: empty,
      tax: empty,
      discount: empty,
      total: empty,
      taxBreakdown: [],
      discountBreakdown: [],
      stockIssues,
      promo: null,
    }
    return NextResponse.json(result)
  }

  // Resolve promo code (if any) against Square's catalog discounts.
  let promoStatus: CalculatedTotals["promo"] = null
  let promoDiscountObject:
    | { catalogObjectId: string; scope: "ORDER" }
    | null = null
  if (promoCode && promoCode.length > 0) {
    const found = await findDiscountByCode(promoCode)
    if (found) {
      promoDiscountObject = {
        catalogObjectId: found.id,
        scope: "ORDER",
      }
      promoStatus = {
        applied: true,
        code: promoCode,
        name: found.name,
        discount: { amount: 0, currency: "USD" },
      }
    } else {
      promoStatus = {
        applied: false,
        code: promoCode,
        reason: "Code not recognized.",
      }
    }
  }

  const client = getSquareClient()
  const locationId = getLocationId()

  const order: Order = {
    locationId,
    lineItems: validLineItems,
    discounts: promoDiscountObject ? [promoDiscountObject] : undefined,
  }

  let response
  try {
    response = await withSquare("orders.calculate", () =>
      client.orders.calculate({ order }),
    )
  } catch (err) {
    console.error("[cart/calculate] Square calculate failed:", err)
    return NextResponse.json(
      { error: "Could not calculate totals." },
      { status: 502 },
    )
  }

  const calculated = response.order
  const subtotal = moneyToFloat(calculated?.netAmounts?.totalMoney)
  const discount = moneyToFloat(calculated?.totalDiscountMoney)
  const tax = moneyToFloat(calculated?.totalTaxMoney)
  const total = moneyToFloat(calculated?.totalMoney)
  const itemSubtotal: Money = {
    amount: subtotal.amount + discount.amount,
    currency: subtotal.currency || "USD",
  }

  const taxBreakdown =
    calculated?.taxes?.map((t) => ({
      name: t.name ?? "Tax",
      money: moneyToFloat(t.appliedMoney),
    })) ?? []

  const discountBreakdown =
    calculated?.discounts?.map((d) => ({
      name: d.name ?? "Discount",
      money: moneyToFloat(d.appliedMoney),
    })) ?? []

  if (promoStatus && promoStatus.applied) {
    const promoName = promoStatus.name
    const matched = discountBreakdown.find(
      (d) => d.name.toLowerCase() === promoName.toLowerCase(),
    )
    if (matched) {
      promoStatus = {
        applied: true,
        code: promoStatus.code,
        name: promoName,
        discount: matched.money,
      }
    }
  }

  const result: CalculatedTotals = {
    subtotal: itemSubtotal,
    tax,
    discount,
    total,
    taxBreakdown,
    discountBreakdown,
    stockIssues,
    promo: promoStatus,
  }
  return NextResponse.json(result)
}
