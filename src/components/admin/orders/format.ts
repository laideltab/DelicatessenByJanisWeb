import type { Order } from "square"

const ZERO_DECIMAL = new Set([
  "BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA",
  "PYG", "RWF", "UGX", "VND", "VUV", "XAF", "XOF", "XPF",
])

export function formatMoney(
  money?: { amount?: bigint | null; currency?: string | null } | null,
): string {
  if (!money?.amount || !money.currency) return "—"
  const amt = Number(money.amount)
  const div = ZERO_DECIMAL.has(money.currency) ? 1 : 100
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currency,
  }).format(amt / div)
}

export function formatDateTime(iso?: string | null): string {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

export function customerName(order: Order): string {
  const pickup = order.fulfillments?.find((f) => f.type === "PICKUP")
  const delivery = order.fulfillments?.find((f) => f.type === "DELIVERY")
  return (
    pickup?.pickupDetails?.recipient?.displayName ??
    delivery?.deliveryDetails?.recipient?.displayName ??
    "—"
  )
}

export function fulfillmentSummary(order: Order): {
  type: "Pickup" | "Delivery" | "—"
  state: string
  uid: string | null
  whenIso: string | null
} {
  const pickup = order.fulfillments?.find((f) => f.type === "PICKUP")
  if (pickup) {
    return {
      type: "Pickup",
      state: pickup.state ?? "—",
      uid: pickup.uid ?? null,
      whenIso: pickup.pickupDetails?.pickupAt ?? null,
    }
  }
  const delivery = order.fulfillments?.find((f) => f.type === "DELIVERY")
  if (delivery) {
    return {
      type: "Delivery",
      state: delivery.state ?? "—",
      uid: delivery.uid ?? null,
      whenIso: delivery.deliveryDetails?.deliverAt ?? null,
    }
  }
  return { type: "—", state: "—", uid: null, whenIso: null }
}

/** Color hint for a state pill — uses Payload theme variables. */
export function stateColor(state: string): {
  bg: string
  fg: string
  border: string
} {
  switch (state) {
    case "OPEN":
    case "RESERVED":
    case "PROPOSED":
      return {
        bg: "var(--theme-warning-100)",
        fg: "var(--theme-warning-800)",
        border: "var(--theme-warning-300)",
      }
    case "PREPARED":
      return {
        bg: "var(--theme-success-100)",
        fg: "var(--theme-success-800)",
        border: "var(--theme-success-300)",
      }
    case "COMPLETED":
      return {
        bg: "var(--theme-elevation-100)",
        fg: "var(--theme-elevation-800)",
        border: "var(--theme-elevation-200)",
      }
    case "CANCELED":
    case "FAILED":
      return {
        bg: "var(--theme-error-100, #fde8e8)",
        fg: "var(--theme-error-800, #7a1f1f)",
        border: "var(--theme-error-300, #f7c1c1)",
      }
    default:
      return {
        bg: "var(--theme-elevation-100)",
        fg: "var(--theme-elevation-800)",
        border: "var(--theme-elevation-200)",
      }
  }
}
