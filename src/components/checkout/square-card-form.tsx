"use client"

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { CreditCard, Loader2 } from "lucide-react"
import type { SquareCard } from "@/lib/square/web-sdk"
import { useSquarePayments } from "./square-payments-context"

export type SquareCardFormHandle = {
  /**
   * Tokenizes the current card input. Returns a `cnon:…` token suitable for
   * passing to /api/checkout/place-order, or throws with a user-friendly
   * message when the card is invalid / declined.
   */
  tokenize: () => Promise<string>
}

export const SquareCardForm = forwardRef<SquareCardFormHandle, object>(
  function SquareCardForm(_props, ref) {
    const { payments, status, error } = useSquarePayments()
    const containerRef = useRef<HTMLDivElement | null>(null)
    const cardRef = useRef<SquareCard | null>(null)
    const [cardStatus, setCardStatus] = useState<
      "idle" | "attaching" | "ready" | "error"
    >("idle")
    const [cardError, setCardError] = useState<string | null>(null)

    useEffect(() => {
      if (status !== "ready" || !payments || !containerRef.current) return
      let cancelled = false
      setCardStatus("attaching")
      payments
        .card()
        .then(async (card) => {
          if (cancelled) {
            await card.destroy().catch(() => {})
            return
          }
          await card.attach(containerRef.current!)
          if (cancelled) {
            await card.destroy().catch(() => {})
            return
          }
          cardRef.current = card
          setCardStatus("ready")
        })
        .catch((err) => {
          console.error("[square] card init failed:", err)
          setCardStatus("error")
          setCardError(
            err instanceof Error
              ? err.message
              : "Could not load the card form.",
          )
        })

      return () => {
        cancelled = true
        const c = cardRef.current
        cardRef.current = null
        c?.destroy().catch(() => {})
      }
    }, [status, payments])

    useImperativeHandle(
      ref,
      () => ({
        async tokenize() {
          const card = cardRef.current
          if (!card) throw new Error("Card form is not ready yet.")
          const result = await card.tokenize()
          if (result.status === "OK" && result.token) return result.token
          const first = result.errors?.[0]
          throw new Error(first?.message ?? "Card validation failed.")
        },
      }),
      [],
    )

    return (
      <div className="space-y-3">
        <p className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-ink-800">
          <CreditCard className="h-3.5 w-3.5 text-brass-600" aria-hidden />
          Card
        </p>

        {/* Square attaches its iframe inputs (number / exp / cvv / postal) into this div. */}
        <div
          ref={containerRef}
          id="sq-card-container"
          className="min-h-[3.25rem] rounded-md border border-input bg-card px-3 py-2"
        />

        {cardStatus === "attaching" || status === "loading" ? (
          <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            Loading secure card form…
          </p>
        ) : null}

        {cardStatus === "error" || status === "error" ? (
          <p className="text-xs text-destructive">
            {cardError ?? error ?? "Card form unavailable."}
          </p>
        ) : null}

        {status === "disabled" ? (
          <p className="text-xs text-destructive">{error}</p>
        ) : null}
      </div>
    )
  },
)
