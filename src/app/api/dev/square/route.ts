import { NextResponse } from "next/server"
import { getSquareStatus } from "@/lib/square/status"
import { SquareApiError } from "@/lib/square/errors"

export const dynamic = "force-dynamic"

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 })
  }

  try {
    const status = await getSquareStatus()
    return NextResponse.json(status)
  } catch (err) {
    if (err instanceof SquareApiError) {
      return NextResponse.json(
        {
          error: err.message,
          statusCode: err.statusCode,
          category: err.category,
          code: err.code,
          detail: err.detail,
        },
        { status: 500 },
      )
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    )
  }
}
