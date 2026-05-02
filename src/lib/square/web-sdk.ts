/**
 * Helpers + types for the Square Web Payments SDK (browser-side). The SDK is
 * loaded dynamically from Square's CDN; we expose a couple of helpers and a
 * minimal type for the global `Square` object so client components don't need
 * to redeclare it.
 *
 * The SDK URL must match the environment of the credentials the server uses
 * — sandbox tokens only validate against the sandbox CDN, and vice versa.
 */

export const SQUARE_SDK_SANDBOX_URL =
  "https://sandbox.web.squarecdn.com/v1/square.js"
export const SQUARE_SDK_PRODUCTION_URL =
  "https://web.squarecdn.com/v1/square.js"

export function getSquareSdkUrl(env?: string): string {
  return env === "production"
    ? SQUARE_SDK_PRODUCTION_URL
    : SQUARE_SDK_SANDBOX_URL
}

// ─── Minimal browser SDK types ──────────────────────────────────────────────
// We only model the parts we use. The full surface is in @square/web-sdk on
// npm, but we don't want to install another package just for types.

export interface SquareTokenizeResult {
  status: "OK" | "Errors" | string
  token?: string
  details?: { card?: { last4?: string; brand?: string } }
  errors?: { type?: string; message?: string; field?: string }[]
}

export interface SquareCard {
  attach(selector: string | HTMLElement): Promise<void>
  tokenize(): Promise<SquareTokenizeResult>
  destroy(): Promise<void>
}

export interface SquareWalletButton {
  attach(selector: string | HTMLElement): Promise<void>
  tokenize(): Promise<SquareTokenizeResult>
  destroy(): Promise<void>
  addEventListener(event: string, listener: (ev: Event) => void): void
}

export interface SquarePaymentRequest {
  countryCode: string
  currencyCode: string
  total: { amount: string; label: string }
}

export interface SquarePayments {
  card(): Promise<SquareCard>
  applePay(req: SquarePaymentRequest): Promise<SquareWalletButton>
  googlePay(req: SquarePaymentRequest): Promise<SquareWalletButton>
  paymentRequest(req: SquarePaymentRequest): SquarePaymentRequest
}

export interface SquareGlobal {
  payments(appId: string, locationId: string): SquarePayments
}

declare global {
  interface Window {
    Square?: SquareGlobal
  }
}
