"use client"

import { useEffect, useState } from "react"
import type { CartItem } from "@/store/cart"
import type { CalculatedTotals } from "@/lib/schemas/cart"

type Status = "idle" | "loading" | "ready" | "error"

type FetchState = {
  status: Status
  totals: CalculatedTotals | null
  error: string | null
}

const INITIAL: FetchState = { status: "idle", totals: null, error: null }

export type CartTotalsResult = FetchState & {
  /** Re-run the calculation manually (e.g. after applying a promo code). */
  recalc: () => void
}

/**
 * Debounced wrapper around POST /api/cart/calculate. Re-runs whenever items
 * (qty/variant/count) or the promo code change. Returns idle/null totals
 * while the cart is empty (no network call made).
 */
export function useCartTotals(
  items: CartItem[],
  promoCode: string,
): CartTotalsResult {
  const [state, setState] = useState<FetchState>(INITIAL)
  const [trigger, setTrigger] = useState(0)

  // Build a stable signature from items so we don't re-fire on identity changes.
  const signature = items
    .map((i) => `${i.lineId}:${i.qty}`)
    .sort()
    .join("|")

  useEffect(() => {
    if (items.length === 0) {
      // Empty cart is the derived "idle" case — don't fetch and don't reset
      // synchronously here (handled below in the return path).
      return
    }

    const controller = new AbortController()
    const handle = window.setTimeout(() => {
      // Async setState inside a timeout / promise callback is fine — it
      // doesn't cascade renders the way a synchronous effect-body setState
      // would, since by then the effect has completed.
      setState((s) => ({ ...s, status: "loading" }))
      void fetch("/api/cart/calculate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variationId: i.variationId,
            qty: i.qty,
          })),
          promoCode: promoCode || undefined,
        }),
        signal: controller.signal,
      })
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json().catch(() => null)
            throw new Error(data?.error ?? "Could not calculate totals.")
          }
          const data = (await res.json()) as CalculatedTotals
          setState({ status: "ready", totals: data, error: null })
        })
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === "AbortError") return
          setState({
            status: "error",
            totals: null,
            error: err instanceof Error ? err.message : String(err),
          })
        })
    }, 350)

    return () => {
      controller.abort()
      window.clearTimeout(handle)
    }
  }, [signature, promoCode, trigger, items])

  // Empty cart short-circuits to idle without touching state from the effect.
  const result = items.length === 0 ? INITIAL : state

  return {
    ...result,
    recalc: () => setTrigger((t) => t + 1),
  }
}
