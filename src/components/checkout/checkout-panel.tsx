"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { useCartStore, selectSubtotal } from "@/store/cart"
import { useCartTotals } from "@/components/cart/use-cart-totals"
import { useHydrated } from "@/components/cart/use-hydrated"
import { CartSummary } from "@/components/cart/cart-summary"
import { PromoCode } from "@/components/cart/promo-code"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { SquarePaymentsProvider } from "./square-payments-context"
import { CheckoutForm } from "./checkout-form"

export function CheckoutPanel() {
  const items = useCartStore((s) => s.items)
  const fallbackSubtotal = selectSubtotal({ items })
  const [promoCode, setPromoCode] = useState("")
  const { status, totals, error } = useCartTotals(items, promoCode)
  const router = useRouter()
  const hydrated = useHydrated()

  // Empty cart redirect — only fire after hydration so we don't bounce
  // a real cart that hasn't loaded yet from localStorage.
  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace("/shop")
    }
  }, [hydrated, items.length, router])

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
        <Button asChild size="md">
          <Link href="/shop">Start shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <SquarePaymentsProvider>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <div className="space-y-4">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.22em] text-ink-800 underline-offset-4 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to bag
          </Link>
          <CheckoutForm promoCode={promoCode} total={totals?.total ?? null} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-card p-7 ring-1 ring-brass-500/30 shadow-sm sm:p-8">
            <h2 className="font-display text-2xl text-ink-900">Order summary</h2>

            <ul className="mt-5 divide-y divide-brass-500/15">
              {items.map((item) => (
                <li
                  key={item.lineId}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.variantName ? `${item.variantName} · ` : ""}Qty{" "}
                      {item.qty}
                    </p>
                  </div>
                  <p className="shrink-0 font-display text-ink-900">
                    {formatPrice(item.unitPrice * item.qty, item.currency)}
                  </p>
                </li>
              ))}
            </ul>

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
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Secure payment via Square. We never see or store your card number.
          </p>
        </aside>
      </div>
    </SquarePaymentsProvider>
  )
}
