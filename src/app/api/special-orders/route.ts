import { NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"
import { specialOrderSchema } from "@/lib/schemas/special-orders"
import { sendSpecialOrderAdminEmail } from "@/lib/email/send-special-order"

export const runtime = "nodejs"

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = specialOrderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 },
    )
  }

  const reference = parsed.data.reference?.trim() || undefined

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: "special-orders",
      data: {
        ...parsed.data,
        reference,
        status: "new",
      },
      // Public form submission — bypass Payload's auth-only default.
      overrideAccess: true,
    })
  } catch (err) {
    console.error("[special-orders] persist failed:", err)
    return NextResponse.json(
      {
        error:
          "We could not save your request. Please try again, or call us to place the order.",
      },
      { status: 500 },
    )
  }

  await sendSpecialOrderAdminEmail({ ...parsed.data, reference })

  return NextResponse.json({ ok: true })
}
