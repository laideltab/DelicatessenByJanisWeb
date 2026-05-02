import { createHmac, timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { CATALOG_CACHE_TAG } from "@/lib/square/queries"

export const runtime = "nodejs"

/**
 * Square webhook receiver. Verifies the HMAC signature header, then triggers
 * cache invalidation for relevant catalog/inventory events.
 *
 * Signature scheme (Square docs):
 *   HMAC-SHA256(notification_url + raw_body, signature_key)
 *   compared base64-encoded against header `x-square-hmacsha256-signature`.
 *
 * The `notification_url` must be the exact URL Square was configured with —
 * we read it from SQUARE_WEBHOOK_URL so it works behind tunnels (ngrok) and
 * across deploy environments.
 */
export async function POST(req: Request) {
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY
  if (!signatureKey) {
    console.error("[square/webhook] SQUARE_WEBHOOK_SIGNATURE_KEY not set")
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
  }

  const notificationUrl =
    process.env.SQUARE_WEBHOOK_URL ?? new URL(req.url).toString()

  const provided = req.headers.get("x-square-hmacsha256-signature")
  if (!provided) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 })
  }

  const rawBody = await req.text()
  const expected = createHmac("sha256", signatureKey)
    .update(notificationUrl + rawBody)
    .digest("base64")

  if (!safeEqual(provided, expected)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let payload: SquareWebhookPayload
  try {
    payload = JSON.parse(rawBody) as SquareWebhookPayload
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const type = payload.type ?? ""
  console.info("[square/webhook] event:", type, payload.event_id ?? "")

  // Catalog mutations and inventory updates invalidate the catalog snapshot.
  if (
    type.startsWith("catalog.") ||
    type === "inventory.count.updated"
  ) {
    // Second arg ("max") drops the cached entry immediately. Without it Next
    // would only stale-while-revalidate, which defeats the point of webhook
    // invalidation.
    revalidateTag(CATALOG_CACHE_TAG, "max")
    revalidatePath("/", "layout")
    revalidatePath("/shop", "layout")
    revalidatePath("/menu")
  }

  // Order, fulfillment, and payment events refresh the corresponding
  // /order/[orderId] page so the public status reflects the change.
  if (
    type.startsWith("order.") ||
    type.startsWith("payment.") ||
    type === "refund.created" ||
    type === "refund.updated"
  ) {
    const orderId = extractOrderId(type, payload.data)
    if (orderId) {
      revalidatePath(`/order/${orderId}`)
      revalidatePath(`/checkout/confirmation/${orderId}`)
    }
  }

  return NextResponse.json({ ok: true })
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  if (aBuf.length !== bBuf.length) return false
  return timingSafeEqual(aBuf, bBuf)
}

/**
 * Square wraps the changed entity inside `data.object.<entity>`. For order /
 * fulfillment events the entity is `order_*`, for payment / refund events it
 * is `payment` / `refund` and the order id lives on those.
 */
function extractOrderId(type: string, data: unknown): string | null {
  if (!data || typeof data !== "object") return null
  const obj = (data as { object?: Record<string, unknown> }).object
  if (!obj) return null

  if (type.startsWith("order.")) {
    return readId(obj.order_updated) ?? readId(obj.order_fulfillment_updated) ?? readId(obj.order)
  }
  if (type.startsWith("payment.")) {
    const payment = obj.payment as Record<string, unknown> | undefined
    return typeof payment?.order_id === "string" ? payment.order_id : null
  }
  if (type.startsWith("refund.")) {
    const refund = obj.refund as Record<string, unknown> | undefined
    return typeof refund?.order_id === "string" ? refund.order_id : null
  }
  return null
}

function readId(maybe: unknown): string | null {
  if (!maybe || typeof maybe !== "object") return null
  const id = (maybe as { order_id?: unknown; id?: unknown }).order_id ?? (maybe as { id?: unknown }).id
  return typeof id === "string" ? id : null
}

type SquareWebhookPayload = {
  type?: string
  event_id?: string
  data?: unknown
}
