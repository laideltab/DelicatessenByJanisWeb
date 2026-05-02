"use client"

import { Loader2 } from "lucide-react"
import type { CalculatedTotals } from "@/lib/schemas/cart"
import { formatPrice } from "@/lib/utils"

interface CartSummaryProps {
  status: "idle" | "loading" | "ready" | "error"
  totals: CalculatedTotals | null
  /** Optimistic subtotal computed locally — used while Square responds. */
  fallbackSubtotal: { amount: number; currency: string }
  error: string | null
}

export function CartSummary({
  status,
  totals,
  fallbackSubtotal,
  error,
}: CartSummaryProps) {
  const loading = status === "loading"
  const subtotal = totals?.subtotal ?? fallbackSubtotal
  const tax = totals?.tax ?? null
  const discount = totals?.discount ?? null
  const total =
    totals?.total ??
    ({
      amount: fallbackSubtotal.amount,
      currency: fallbackSubtotal.currency,
    } as const)

  return (
    <dl className="space-y-2 text-sm">
      <Row label="Subtotal" value={formatPrice(subtotal.amount, subtotal.currency)} />

      {discount && discount.amount > 0 ? (
        <Row
          label="Discount"
          value={`− ${formatPrice(discount.amount, discount.currency)}`}
          accent
        />
      ) : null}

      <Row
        label="Tax"
        value={
          tax
            ? formatPrice(tax.amount, tax.currency)
            : loading
              ? "Calculating…"
              : "—"
        }
        muted={!tax || tax.amount === 0}
      />

      <div className="border-t border-brass-500/30 pt-3">
        <div className="flex items-baseline justify-between">
          <dt className="text-xs font-medium uppercase tracking-[0.22em] text-ink-800">
            Total
          </dt>
          <dd className="font-display text-2xl text-ink-900">
            {loading && !totals ? (
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                <span className="font-sans text-sm">Calculating…</span>
              </span>
            ) : (
              formatPrice(total.amount, total.currency)
            )}
          </dd>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Tax computed by Square at the {/* keep */}order level — final total verified at checkout.
        </p>
      </div>

      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : null}
    </dl>
  )
}

function Row({
  label,
  value,
  muted,
  accent,
}: {
  label: string
  value: string
  muted?: boolean
  accent?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={
          accent
            ? "text-ink-900"
            : muted
              ? "text-muted-foreground"
              : "text-ink-900"
        }
      >
        {value}
      </dd>
    </div>
  )
}
