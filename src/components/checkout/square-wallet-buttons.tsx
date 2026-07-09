"use client"

import { useEffect, useRef, useState } from "react"
import type { Money } from "@/lib/schemas/cart"
import type {
  SquarePaymentRequest,
  SquareWalletButton,
} from "@/lib/square/web-sdk"
import { useSquarePayments } from "./square-payments-context"

type WalletState = "init" | "ready" | "unavailable"

/**
 * Apple Pay / Google Pay express buttons. Each wallet is offered only when
 * the Square SDK reports it available on this device/browser (Apple Pay
 * additionally requires the domain to be registered in the Square Dashboard).
 * Renders nothing when neither wallet can be used, so the card form stays
 * the visual default.
 */
export function SquareWalletButtons({
  total,
  disabled,
  onToken,
}: {
  /** Order total (tax/discounts included). Buttons wait for it to exist. */
  total: Money | null
  disabled?: boolean
  /** Receives a `cnon:…` wallet token; the parent places the order. */
  onToken: (token: string) => void | Promise<void>
}) {
  const { payments, status } = useSquarePayments()
  const applePayRef = useRef<SquareWalletButton | null>(null)
  const googlePayRef = useRef<SquareWalletButton | null>(null)
  const googleContainerRef = useRef<HTMLDivElement | null>(null)
  const [appleState, setAppleState] = useState<WalletState>("init")
  const [googleState, setGoogleState] = useState<WalletState>("init")
  const [walletError, setWalletError] = useState<string | null>(null)

  const amount = total ? (total.amount / 100).toFixed(2) : null
  const currency = total?.currency ?? "USD"

  useEffect(() => {
    if (status !== "ready" || !payments || !amount) return
    let cancelled = false

    const request: SquarePaymentRequest = {
      countryCode: "US",
      currencyCode: currency,
      total: { amount, label: "Delicatessen by Janis" },
    }

    // Apple Pay: the SDK does not render a button — we style our own and
    // call tokenize() on click. Creation throws when unsupported (non-Safari,
    // no card enrolled, domain not verified).
    payments
      .applePay(payments.paymentRequest(request))
      .then((wallet) => {
        if (cancelled) {
          wallet.destroy().catch(() => {})
          return
        }
        applePayRef.current = wallet
        setAppleState("ready")
      })
      .catch(() => setAppleState("unavailable"))

    // Google Pay renders its own branded button into the container.
    payments
      .googlePay(payments.paymentRequest(request))
      .then(async (wallet) => {
        if (cancelled || !googleContainerRef.current) {
          wallet.destroy().catch(() => {})
          return
        }
        await wallet.attach(googleContainerRef.current)
        if (cancelled) {
          wallet.destroy().catch(() => {})
          return
        }
        googlePayRef.current = wallet
        setGoogleState("ready")
      })
      .catch(() => setGoogleState("unavailable"))

    return () => {
      cancelled = true
      applePayRef.current?.destroy().catch(() => {})
      applePayRef.current = null
      googlePayRef.current?.destroy().catch(() => {})
      googlePayRef.current = null
      setAppleState("init")
      setGoogleState("init")
    }
    // Recreate the wallets whenever the payable amount changes (promo codes,
    // cart edits) — the SDK payment request is immutable once created.
  }, [status, payments, amount, currency])

  async function pay(wallet: SquareWalletButton | null) {
    if (!wallet || disabled) return
    setWalletError(null)
    try {
      const result = await wallet.tokenize()
      if (result.status === "OK" && result.token) {
        await onToken(result.token)
        return
      }
      // "Cancel" closes the wallet sheet without errors — stay quiet then.
      const first = result.errors?.[0]
      if (first?.message) setWalletError(first.message)
    } catch (err) {
      setWalletError(
        err instanceof Error ? err.message : "Wallet payment failed.",
      )
    }
  }

  const anyReady = appleState === "ready" || googleState === "ready"

  return (
    <div className={anyReady ? "space-y-3" : "hidden"}>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-800">
        Express checkout
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        {appleState === "ready" ? (
          <button
            type="button"
            aria-label="Pay with Apple Pay"
            disabled={disabled}
            onClick={() => pay(applePayRef.current)}
            className="apple-pay-button h-11 w-full rounded-md disabled:opacity-50"
          />
        ) : null}
        <div
          ref={googleContainerRef}
          aria-label="Pay with Google Pay"
          onClick={() => pay(googlePayRef.current)}
          className={
            googleState === "ready"
              ? disabled
                ? "pointer-events-none h-11 opacity-50"
                : "h-11 cursor-pointer"
              : "hidden"
          }
        />
      </div>

      {walletError ? (
        <p className="text-xs text-destructive">{walletError}</p>
      ) : null}

      <div className="flex items-center gap-3" aria-hidden>
        <span className="h-px flex-1 bg-blush-200" />
        <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          or pay with card
        </span>
        <span className="h-px flex-1 bg-blush-200" />
      </div>
    </div>
  )
}
