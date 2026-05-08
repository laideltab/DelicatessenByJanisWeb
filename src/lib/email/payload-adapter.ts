import type { EmailAdapter, SendEmailOptions } from "payload"
import {
  EMAIL_FROM,
  getResendClient,
  isResendConfigured,
} from "./resend"

const FROM_NAME_MATCH = /^(.+?)\s*<(.+)>$/
function parseFromAddress(input: string): { address: string; name: string } {
  const m = input.match(FROM_NAME_MATCH)
  if (m) return { name: m[1].trim(), address: m[2].trim() }
  return { name: "Delicatessen by Janis", address: input.trim() }
}

function asString(value: SendEmailOptions["to"]): string {
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === "string" ? entry : entry.address))
      .join(", ")
  }
  if (typeof value === "object" && value !== null) {
    return (value as { address: string }).address
  }
  return String(value ?? "")
}

/**
 * Payload email adapter backed by Resend. Used for transactional admin
 * emails: forgot-password, verification (if enabled), and any
 * `payload.sendEmail()` call.
 *
 * Falls back to a console adapter when RESEND_API_KEY is not set so local
 * development without Resend credentials still works.
 */
export const resendPayloadAdapter: EmailAdapter = () => {
  const { name: defaultFromName, address: defaultFromAddress } =
    parseFromAddress(EMAIL_FROM)

  return {
    name: "resend",
    defaultFromAddress,
    defaultFromName,
    sendEmail: async (message) => {
      if (!isResendConfigured()) {
        console.warn(
          "[email/payload-adapter] Resend not configured — logging email instead.",
        )
        console.info(
          "[email/payload-adapter]",
          "to:", asString(message.to),
          "subject:", message.subject,
        )
        return { id: null }
      }

      const fromAddress =
        typeof message.from === "string"
          ? message.from
          : message.from?.address ?? EMAIL_FROM

      const html =
        typeof message.html === "string"
          ? message.html
          : message.html != null
            ? String(message.html)
            : undefined

      try {
        const resp = await getResendClient().emails.send({
          from: fromAddress,
          to: asString(message.to),
          subject: message.subject ?? "",
          html,
          text: typeof message.text === "string" ? message.text : undefined,
        })
        return resp
      } catch (err) {
        console.error("[email/payload-adapter] Resend send failed:", err)
        throw err
      }
    },
  }
}
