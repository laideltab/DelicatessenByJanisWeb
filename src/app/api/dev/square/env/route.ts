import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 })
  }

  const mask = (v: string | undefined) =>
    v ? `set (len=${v.length}, head=${v.slice(0, 4)}…)` : "MISSING"

  return NextResponse.json({
    SQUARE_ACCESS_TOKEN: mask(process.env.SQUARE_ACCESS_TOKEN),
    SQUARE_LOCATION_ID: mask(process.env.SQUARE_LOCATION_ID),
    SQUARE_APP_ID: mask(process.env.SQUARE_APP_ID),
    SQUARE_ENVIRONMENT: process.env.SQUARE_ENVIRONMENT ?? "unset",
    NODE_ENV: process.env.NODE_ENV,
  })
}
