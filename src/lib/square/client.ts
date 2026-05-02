import { SquareClient, SquareEnvironment } from "square"

let cached: SquareClient | null = null

export function isSquareConfigured(): boolean {
  return Boolean(
    process.env.SQUARE_ACCESS_TOKEN && process.env.SQUARE_LOCATION_ID,
  )
}

export function getSquareClient(): SquareClient {
  if (cached) return cached

  const token = process.env.SQUARE_ACCESS_TOKEN
  if (!token) {
    throw new Error(
      "Missing SQUARE_ACCESS_TOKEN environment variable. Set it in .env.local.",
    )
  }

  const useProduction =
    process.env.SQUARE_ENVIRONMENT === "production" ||
    (process.env.NODE_ENV === "production" &&
      process.env.SQUARE_ENVIRONMENT !== "sandbox")

  cached = new SquareClient({
    token,
    environment: useProduction
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
  })

  return cached
}

export function getLocationId(): string {
  const id = process.env.SQUARE_LOCATION_ID
  if (!id) {
    throw new Error(
      "Missing SQUARE_LOCATION_ID environment variable. Set it in .env.local.",
    )
  }
  return id
}
