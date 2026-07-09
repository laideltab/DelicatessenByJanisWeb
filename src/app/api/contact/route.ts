import { NextResponse } from "next/server"
import { contactSchema } from "@/lib/schemas/contact"
import { sendContactAdminEmail } from "@/lib/email/send-contact"

export const runtime = "nodejs"

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 },
    )
  }

  try {
    await sendContactAdminEmail(parsed.data)
  } catch (err) {
    // The message only exists in this request — surface the failure so the
    // customer knows to reach us another way instead of assuming we got it.
    console.error("[contact] send failed:", err)
    return NextResponse.json(
      { error: "Could not send your message — please call or email us directly." },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}
