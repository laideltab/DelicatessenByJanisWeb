import type { Order } from "square"
import { siteConfig } from "@/lib/site-config"
import {
  EMAIL_ADMIN,
  EMAIL_FROM,
  getResendClient,
  isResendConfigured,
} from "./resend"
import { buildOrderConfirmationEmail } from "./templates/order-confirmation"
import { buildOrderAdminEmail } from "./templates/order-admin"
import type {
  EmailLineItem,
  EmailMoney,
  EmailOrder,
} from "./templates/shared"

const ZERO_DECIMAL = new Set([
  "BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA",
  "PYG", "RWF", "UGX", "VND", "VUV", "XAF", "XOF", "XPF",
])

function moneyToFloat(
  money: { amount?: bigint | null; currency?: string | null } | null | undefined,
): EmailMoney | null {
  if (!money?.amount || !money.currency) return null
  const amt = Number(money.amount)
  const div = ZERO_DECIMAL.has(money.currency) ? 1 : 100
  return { amount: amt / div, currency: money.currency }
}

function statusUrl(orderId: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? siteConfig.url
  return `${base}/order/${encodeURIComponent(orderId)}`
}

function formatAddressLine(
  addr:
    | {
        addressLine1?: string | null
        addressLine2?: string | null
        locality?: string | null
        administrativeDistrictLevel1?: string | null
        postalCode?: string | null
      }
    | null
    | undefined,
): string {
  if (!addr) return ""
  return [
    addr.addressLine1,
    addr.addressLine2,
    [
      addr.locality,
      addr.administrativeDistrictLevel1,
      addr.postalCode,
    ]
      .filter(Boolean)
      .join(", "),
  ]
    .filter(Boolean)
    .join("\n")
}

/**
 * Maps a Square Order into the snapshot the email templates need. Defensive
 * about missing fields — emails should never throw on shape mismatches.
 */
export function emailOrderFromSquare(
  order: Order,
  fallbackCustomer: { name: string; email: string; phone: string },
): EmailOrder | null {
  if (!order.id) return null

  const total = moneyToFloat(order.totalMoney)
  if (!total) return null

  const subtotal = moneyToFloat(order.netAmounts?.totalMoney)
  const discount = moneyToFloat(order.totalDiscountMoney)
  const tax = moneyToFloat(order.totalTaxMoney)
  const itemSubtotal =
    subtotal && discount
      ? { amount: subtotal.amount + discount.amount, currency: subtotal.currency }
      : subtotal

  const lineItems: EmailLineItem[] =
    order.lineItems?.map((li) => ({
      name: li.name ?? "Item",
      variantName: li.variationName ?? null,
      qty: Number(li.quantity ?? "1"),
      total: moneyToFloat(li.totalMoney) ?? { amount: 0, currency: total.currency },
    })) ?? []

  const pickup = order.fulfillments?.find((f) => f.type === "PICKUP")
  const delivery = order.fulfillments?.find((f) => f.type === "DELIVERY")
  const recipient =
    pickup?.pickupDetails?.recipient ?? delivery?.deliveryDetails?.recipient

  return {
    id: order.id,
    customerName: recipient?.displayName || fallbackCustomer.name,
    customerEmail: recipient?.emailAddress || fallbackCustomer.email,
    customerPhone: recipient?.phoneNumber || fallbackCustomer.phone,
    fulfillment: pickup
      ? {
          type: "pickup",
          pickupAt: pickup.pickupDetails?.pickupAt ?? null,
          notes: pickup.pickupDetails?.note ?? null,
        }
      : {
          type: "delivery",
          addressLine: formatAddressLine(delivery?.deliveryDetails?.recipient?.address),
          notes: delivery?.deliveryDetails?.note ?? null,
        },
    lineItems,
    subtotal: itemSubtotal,
    tax,
    discount,
    total,
    statusUrl: statusUrl(order.id),
  }
}

/**
 * Sends both the customer confirmation and the admin notification. Errors
 * are logged and swallowed — the caller (place-order route) should not
 * surface email failures to the buyer.
 */
export async function sendOrderEmails(emailOrder: EmailOrder): Promise<void> {
  if (!isResendConfigured()) {
    console.warn("[email] Resend not configured — skipping order emails.")
    return
  }
  const resend = getResendClient()

  const customerTemplate = buildOrderConfirmationEmail(emailOrder)
  const adminTemplate = buildOrderAdminEmail(emailOrder)

  const tasks = [
    resend.emails
      .send({
        from: EMAIL_FROM,
        to: emailOrder.customerEmail,
        subject: customerTemplate.subject,
        html: customerTemplate.html,
        replyTo: EMAIL_ADMIN,
      })
      .catch((err) => {
        console.error("[email] customer confirmation failed:", err)
      }),
    resend.emails
      .send({
        from: EMAIL_FROM,
        to: EMAIL_ADMIN,
        subject: adminTemplate.subject,
        html: adminTemplate.html,
        replyTo: emailOrder.customerEmail,
      })
      .catch((err) => {
        console.error("[email] admin notification failed:", err)
      }),
  ]

  await Promise.allSettled(tasks)
}
