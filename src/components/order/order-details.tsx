import type { Order } from "square"
import { Clock, MapPin, Receipt } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { formatPrice } from "@/lib/utils"
import {
  deriveOrderStatus,
  OrderStatusBadge,
} from "./order-status-badge"

const ZERO_DECIMAL = new Set([
  "BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA",
  "PYG", "RWF", "UGX", "VND", "VUV", "XAF", "XOF", "XPF",
])

function moneyToFloat(money?: { amount?: bigint | null; currency?: string | null }) {
  if (!money?.amount || !money.currency) return null
  const amt = Number(money.amount)
  const div = ZERO_DECIMAL.has(money.currency) ? 1 : 100
  return { amount: amt / div, currency: money.currency }
}

function formatDateTime(iso?: string | null): string {
  if (!iso) return ""
  try {
    const d = new Date(iso)
    return d.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

export function OrderDetails({ order }: { order: Order }) {
  const status = deriveOrderStatus(order)
  const total = moneyToFloat(order.totalMoney)
  const tax = moneyToFloat(order.totalTaxMoney)
  const discount = moneyToFloat(order.totalDiscountMoney)
  const subtotal = moneyToFloat(order.netAmounts?.totalMoney)
  const itemSubtotal =
    subtotal && discount
      ? { amount: subtotal.amount + discount.amount, currency: subtotal.currency }
      : subtotal

  const pickup = order.fulfillments?.find((f) => f.type === "PICKUP")
  const delivery = order.fulfillments?.find((f) => f.type === "DELIVERY")
  const pickupAt = pickup?.pickupDetails?.pickupAt
  const note = pickup?.pickupDetails?.note ?? delivery?.deliveryDetails?.note

  return (
    <>
      <div className="flex flex-col gap-3">
        <OrderStatusBadge order={order} />
        <p
          className="text-base text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: status.description }}
        />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {/* Pickup / delivery details */}
        <div className="rounded-2xl bg-card p-6 ring-1 ring-blush-200/60 shadow-sm sm:p-7">
          <h2 className="inline-flex items-center gap-2 font-display text-xl text-ink-900">
            <MapPin className="h-4 w-4 text-brass-600" aria-hidden />
            {pickup ? "Pickup at" : "Delivery to"}
          </h2>
          {pickup ? (
            <address className="mt-3 not-italic text-sm text-ink-800">
              Miami International Mall
              <br />
              {siteConfig.address.streetAddress}
              <br />
              {siteConfig.address.addressLocality},{" "}
              {siteConfig.address.addressRegion}{" "}
              {siteConfig.address.postalCode}
            </address>
          ) : delivery ? (
            <p className="mt-3 text-sm text-muted-foreground">
              We&rsquo;ll be in touch by phone to confirm delivery details.
            </p>
          ) : null}

          {pickupAt ? (
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-ink-800">
              <Clock className="h-4 w-4 text-brass-600" aria-hidden />
              Ready by {formatDateTime(pickupAt)}
            </p>
          ) : pickup ? (
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-ink-800">
              <Clock className="h-4 w-4 text-brass-600" aria-hidden />
              Ready ASAP — we&rsquo;ll text when it&rsquo;s ready.
            </p>
          ) : null}

          {note ? (
            <p className="mt-4 rounded-md bg-blush-100/60 p-3 text-xs text-ink-800">
              <span className="font-medium">Notes: </span>
              {note}
            </p>
          ) : null}
        </div>

        {/* Order summary */}
        <div className="rounded-2xl bg-card p-6 ring-1 ring-blush-200/60 shadow-sm sm:p-7">
          <h2 className="inline-flex items-center gap-2 font-display text-xl text-ink-900">
            <Receipt className="h-4 w-4 text-brass-600" aria-hidden />
            Receipt
          </h2>

          <ul className="mt-3 divide-y divide-brass-500/15">
            {order.lineItems?.map((li, i) => {
              const lineTotal = moneyToFloat(li.totalMoney)
              return (
                <li
                  key={li.uid ?? i}
                  className="flex items-baseline justify-between gap-3 py-2 text-sm"
                >
                  <span className="min-w-0 flex-1 truncate text-ink-800">
                    {li.name ?? "Item"}{" "}
                    <span className="text-muted-foreground">× {li.quantity}</span>
                  </span>
                  <span className="shrink-0 font-display text-ink-900">
                    {lineTotal
                      ? formatPrice(lineTotal.amount, lineTotal.currency)
                      : "—"}
                  </span>
                </li>
              )
            })}
          </ul>

          <dl className="mt-4 space-y-1.5 border-t border-brass-500/30 pt-4 text-sm">
            {itemSubtotal ? (
              <Row
                label="Subtotal"
                value={formatPrice(itemSubtotal.amount, itemSubtotal.currency)}
              />
            ) : null}
            {discount && discount.amount > 0 ? (
              <Row
                label="Discount"
                value={`− ${formatPrice(discount.amount, discount.currency)}`}
              />
            ) : null}
            {tax ? (
              <Row label="Tax" value={formatPrice(tax.amount, tax.currency)} />
            ) : null}
            {total ? (
              <div className="mt-3 flex items-baseline justify-between border-t border-brass-500/30 pt-3">
                <dt className="text-xs font-medium uppercase tracking-[0.22em] text-ink-800">
                  Total
                </dt>
                <dd className="font-display text-2xl text-ink-900">
                  {formatPrice(total.amount, total.currency)}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-ink-900">{value}</dd>
    </div>
  )
}
