import { NextResponse } from "next/server"
import { specialOrderSchema } from "@/lib/schemas/special-orders"

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

  // TODO (Sesion 3.4): forward to Resend + persist to Payload custom-orders
  // collection so Janis sees them in the admin. Logging only for now.
  console.info("[special-orders] new request:", parsed.data)

  return NextResponse.json({ ok: true })
}
