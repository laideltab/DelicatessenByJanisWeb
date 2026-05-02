import { Resend } from "resend"

let cached: Resend | null = null

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

export function getResendClient(): Resend {
  if (cached) return cached
  const key = process.env.RESEND_API_KEY
  if (!key) {
    throw new Error(
      "Missing RESEND_API_KEY environment variable. Set it in .env.local.",
    )
  }
  cached = new Resend(key)
  return cached
}

export const EMAIL_FROM =
  process.env.EMAIL_FROM ?? "Delicatessen by Janis <orders@delicatessenbyjanis.com>"
export const EMAIL_ADMIN = process.env.EMAIL_ADMIN ?? "janis@delicatessenbyjanis.com"
