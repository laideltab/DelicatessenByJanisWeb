import { NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"
import { reviewSchema } from "@/lib/schemas/review"

export const runtime = "nodejs"

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = reviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 },
    )
  }

  const { squareItemId, productName, name, email, rating, message } =
    parsed.data

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: "reviews",
      data: {
        squareItemId,
        productNameSnapshot: productName || undefined,
        name,
        email: email || undefined,
        rating,
        message,
        // Every submission waits for approval in the admin.
        approved: false,
      },
      overrideAccess: true,
    })
  } catch (err) {
    console.error("[reviews] create failed:", err)
    return NextResponse.json(
      { error: "Could not save your review — please try again." },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}
