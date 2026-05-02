"use client"

import { createContext, useContext, useEffect, useState } from "react"
import Script from "next/script"
import {
  getSquareSdkUrl,
  type SquarePayments,
} from "@/lib/square/web-sdk"

type Status = "loading" | "ready" | "error" | "disabled"

type Ctx = {
  payments: SquarePayments | null
  status: Status
  error: string | null
}

const PaymentsContext = createContext<Ctx>({
  payments: null,
  status: "loading",
  error: null,
})

const APP_ID = process.env.NEXT_PUBLIC_SQUARE_APP_ID
const LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
const ENV = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT

/**
 * Loads Square's Web Payments SDK once and exposes a single `payments`
 * instance to descendants. Every payment method (card, Apple Pay, Google
 * Pay) reuses that instance — Square doesn't support re-initializing it.
 */
export function SquarePaymentsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [payments, setPayments] = useState<SquarePayments | null>(null)
  const [status, setStatus] = useState<Status>(
    APP_ID && LOCATION_ID ? "loading" : "disabled",
  )
  const [error, setError] = useState<string | null>(
    APP_ID && LOCATION_ID
      ? null
      : "Square Web Payments is not configured (missing NEXT_PUBLIC_SQUARE_APP_ID / NEXT_PUBLIC_SQUARE_LOCATION_ID).",
  )

  // Initialize on script load OR if SDK was already on the page.
  useEffect(() => {
    if (status !== "loading") return
    if (typeof window === "undefined") return
    if (!window.Square) return // wait for Script onLoad
    init()
  }, [status])

  function init() {
    if (!APP_ID || !LOCATION_ID) return
    try {
      const next = window.Square!.payments(APP_ID, LOCATION_ID)
      setPayments(next)
      setStatus("ready")
    } catch (err) {
      console.error("[square] payments() failed:", err)
      setError(
        err instanceof Error
          ? err.message
          : "Could not initialize Square Payments.",
      )
      setStatus("error")
    }
  }

  return (
    <PaymentsContext.Provider value={{ payments, status, error }}>
      {APP_ID && LOCATION_ID ? (
        <Script
          src={getSquareSdkUrl(ENV)}
          strategy="afterInteractive"
          onLoad={init}
          onError={() => {
            setStatus("error")
            setError("Failed to load Square Payments script.")
          }}
        />
      ) : null}
      {children}
    </PaymentsContext.Provider>
  )
}

export function useSquarePayments() {
  return useContext(PaymentsContext)
}
