import { NextResponse } from "next/server"
import { contactSchema } from "@/lib/schemas/contact"

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

  // TODO (Sesion 3.4): forward to Resend with a template + notification email
  // to Janis. For now we just log so the form flow works end-to-end.
  console.info("[contact] new message:", parsed.data)

  return NextResponse.json({ ok: true })
}
