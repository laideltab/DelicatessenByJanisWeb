"use client"

import { useState } from "react"
import Link from "next/link"
import * as Dialog from "@radix-ui/react-dialog"
import { ShoppingBag, X, ArrowRight } from "lucide-react"
import { useCartStore, selectSubtotal, type CartItem } from "@/store/cart"
import type { StockIssue } from "@/lib/schemas/cart"
import { useCartTotals } from "./use-cart-totals"
import { useHydrated } from "./use-hydrated"
import { CartLine } from "./cart-line"
import { CartSummary } from "./cart-summary"
import { PromoCode } from "./promo-code"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const close = useCartStore((s) => s.close)
  const open = useCartStore((s) => s.open)
  const items = useCartStore((s) => s.items)

  const fallbackSubtotal = selectSubtotal({ items })
  const [promoCode, setPromoCode] = useState("")
  const { status, totals, error } = useCartTotals(items, promoCode)

  // Build a stockIssue lookup for quick rendering.
  const issueByLine = new Map<string, StockIssue>(
    (totals?.stockIssues ?? []).map((s) => [s.lineId, s] as const),
  )

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(next) => (next ? open() : close())}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-sugar-100 shadow-2xl ring-1 ring-brass-500/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
        >
          <header className="flex items-center justify-between border-b border-brass-500/20 px-6 py-5">
            <Dialog.Title className="inline-flex items-center gap-2 font-display text-2xl text-ink-900">
              <ShoppingBag className="h-5 w-5 text-brass-600" aria-hidden />
              Your bag
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close cart"
              className="grid h-9 w-9 place-items-center rounded-md text-ink-800 transition hover:bg-blush-100"
            >
              <X className="h-4 w-4" aria-hidden />
            </Dialog.Close>
          </header>

          <div className="flex-1 overflow-y-auto px-6">
            {items.length === 0 ? (
              <EmptyState />
            ) : (
              <CartLines items={items} issueByLine={issueByLine} />
            )}
          </div>

          {items.length > 0 ? (
            <footer className="border-t border-brass-500/20 bg-card/80 px-6 py-5 backdrop-blur">
              <PromoCode
                promoCode={promoCode}
                setPromoCode={setPromoCode}
                promoStatus={totals?.promo ?? null}
              />
              <div className="mt-5">
                <CartSummary
                  status={status}
                  totals={totals}
                  fallbackSubtotal={fallbackSubtotal}
                  error={error}
                />
              </div>
              <Button
                asChild
                size="lg"
                className="mt-5 w-full"
                disabled={items.length === 0}
              >
                <Link href="/checkout" onClick={close}>
                  Checkout
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <button
                type="button"
                onClick={close}
                className="mt-3 w-full text-xs uppercase tracking-[0.22em] text-muted-foreground underline-offset-4 hover:underline"
              >
                Continue shopping
              </button>
            </footer>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function EmptyState() {
  const close = useCartStore((s) => s.close)
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-20 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-blush-100 text-brass-600">
        <ShoppingBag className="h-6 w-6" aria-hidden />
      </span>
      <p className="font-display text-2xl text-ink-900">Your bag is empty.</p>
      <p className="max-w-xs text-sm text-muted-foreground">
        Browse the shop to add cakes, pastries, drinks, or savories.
      </p>
      <Button asChild size="md" className="mt-2">
        <Link href="/shop" onClick={close}>
          Start shopping
          <ArrowRight aria-hidden />
        </Link>
      </Button>
    </div>
  )
}

function CartLines({
  items,
  issueByLine,
}: {
  items: CartItem[]
  issueByLine: Map<string, StockIssue>
}) {
  // Hydration safety: items come from localStorage so the count differs between
  // server and first client render.
  const hydrated = useHydrated()
  if (!hydrated) return null

  return (
    <ul className="divide-y divide-brass-500/15">
      {items.map((item) => (
        <CartLine
          key={item.lineId}
          item={item}
          issue={issueByLine.get(item.lineId)}
        />
      ))}
      <li className="flex items-baseline justify-between py-4 text-sm">
        <span className="text-muted-foreground">Items in bag</span>
        <span className="font-display text-ink-900">
          {items.reduce((s, i) => s + i.qty, 0)}
        </span>
      </li>
      <li className="flex items-baseline justify-between py-4 text-sm">
        <span className="text-muted-foreground">Item total (no tax)</span>
        <span className="font-display text-ink-900">
          {formatPrice(
            items.reduce((s, i) => s + i.unitPrice * i.qty, 0),
            items[0]?.currency ?? "USD",
          )}
        </span>
      </li>
    </ul>
  )
}
