"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ShoppingBag } from "lucide-react"
import { useCartStore, selectSubtotal } from "@/store/cart"
import type { StockIssue } from "@/lib/schemas/cart"
import { useCartTotals } from "./use-cart-totals"
import { useHydrated } from "./use-hydrated"
import { CartLine } from "./cart-line"
import { CartSummary } from "./cart-summary"
import { PromoCode } from "./promo-code"
import { Button } from "@/components/ui/button"

/**
 * Full /cart page body. Mirrors the drawer but uses a two-column layout
 * with editorial typography. Shares all state with the drawer via the
 * Zustand store.
 */
export function CartView() {
  const items = useCartStore((s) => s.items)
  const fallbackSubtotal = selectSubtotal({ items })
  const [promoCode, setPromoCode] = useState("")
  const { status, totals, error } = useCartTotals(items, promoCode)

  const issueByLine = new Map<string, StockIssue>(
    (totals?.stockIssues ?? []).map((s) => [s.lineId, s] as const),
  )
  const hasBlockingStock =
    totals?.stockIssues?.some((s) => s.available === 0) ?? false

  // Hydration guard — items come from localStorage.
  const hydrated = useHydrated()
  if (!hydrated) {
    return (
      <p className="rounded-2xl bg-card p-10 text-center text-sm text-muted-foreground ring-1 ring-blush-200/60">
        Loading your bag…
      </p>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-card p-12 text-center ring-1 ring-blush-200/60">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-blush-100 text-brass-600">
          <ShoppingBag className="h-6 w-6" aria-hidden />
        </span>
        <p className="font-display text-2xl text-ink-900">Your bag is empty.</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Browse the shop to add cakes, pastries, drinks, or savories.
        </p>
        <Button asChild size="md" className="mt-2">
          <Link href="/shop">
            Start shopping
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
      <ul className="divide-y divide-brass-500/15 rounded-2xl bg-card px-6 py-2 ring-1 ring-blush-200/60 shadow-sm sm:px-8">
        {items.map((item) => (
          <CartLine
            key={item.lineId}
            item={item}
            issue={issueByLine.get(item.lineId)}
          />
        ))}
      </ul>

      <aside className="space-y-6">
        <div className="rounded-2xl bg-card p-7 ring-1 ring-brass-500/30 shadow-sm sm:p-8">
          <h2 className="font-display text-2xl text-ink-900">Order summary</h2>
          <div className="mt-5">
            <PromoCode
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              promoStatus={totals?.promo ?? null}
            />
          </div>
          <div className="mt-6">
            <CartSummary
              status={status}
              totals={totals}
              fallbackSubtotal={fallbackSubtotal}
              error={error}
            />
          </div>
          <Button
            asChild={!hasBlockingStock}
            size="lg"
            className="mt-6 w-full"
            disabled={hasBlockingStock}
          >
            {hasBlockingStock ? (
              <span>Resolve stock issues to continue</span>
            ) : (
              <Link href="/checkout">
                Checkout
                <ArrowRight aria-hidden />
              </Link>
            )}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Pickup at Miami International Mall, Doral · Tax computed by Square.
        </p>
      </aside>
    </div>
  )
}
