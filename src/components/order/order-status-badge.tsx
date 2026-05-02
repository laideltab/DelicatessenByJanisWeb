import type { Order } from "square"
import { cn } from "@/lib/utils"

type Tone = "neutral" | "amber" | "green" | "red"

const toneStyles: Record<Tone, string> = {
  neutral:
    "bg-blush-100 text-ink-800 ring-1 ring-blush-200/70",
  amber:
    "bg-brass-500/15 text-ink-800 ring-1 ring-brass-500/40",
  green: "bg-green-100 text-green-900 ring-1 ring-green-200",
  red: "bg-destructive/10 text-destructive ring-1 ring-destructive/30",
}

export type OrderStatus = {
  label: string
  description: string
  tone: Tone
}

/**
 * Maps Square's order + fulfillment + payment state into a single
 * customer-facing status. Square's enums are noisy (PROPOSED, RESERVED, etc.),
 * so we collapse them into 4 tones.
 */
export function deriveOrderStatus(order: Order): OrderStatus {
  const fulfillmentState =
    order.fulfillments?.[0]?.state ?? null
  const orderState = order.state ?? null
  const tenders = order.tenders ?? []
  const allCaptured =
    tenders.length > 0 &&
    tenders.every((t) => t.cardDetails?.status === "CAPTURED" || t.type === "CASH")

  if (orderState === "CANCELED") {
    return {
      label: "Cancelled",
      description: "This order was cancelled.",
      tone: "red",
    }
  }
  if (fulfillmentState === "COMPLETED" || orderState === "COMPLETED") {
    return {
      label: "Completed",
      description: "Picked up — thanks for stopping by.",
      tone: "green",
    }
  }
  if (fulfillmentState === "PREPARED") {
    return {
      label: "Ready for pickup",
      description: "Come by anytime during open hours.",
      tone: "green",
    }
  }
  if (fulfillmentState === "RESERVED") {
    return {
      label: "In the kitchen",
      description: "Janis is working on it — we&rsquo;ll text when it&rsquo;s ready.",
      tone: "amber",
    }
  }
  if (allCaptured) {
    return {
      label: "Confirmed",
      description: "Payment received. We&rsquo;ll start prep at the right time.",
      tone: "amber",
    }
  }
  return {
    label: "Received",
    description: "We&rsquo;ve got your order — it&rsquo;s being processed.",
    tone: "neutral",
  }
}

export function OrderStatusBadge({ order }: { order: Order }) {
  const status = deriveOrderStatus(order)
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]",
        toneStyles[status.tone],
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status.tone === "green" && "bg-green-600",
          status.tone === "amber" && "bg-brass-600",
          status.tone === "red" && "bg-destructive",
          status.tone === "neutral" && "bg-ink-700",
        )}
      />
      {status.label}
    </span>
  )
}
