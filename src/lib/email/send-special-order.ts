import {
  EMAIL_ADMIN,
  EMAIL_FROM,
  getResendClient,
  isResendConfigured,
} from "./resend"
import {
  buildSpecialOrderAdminEmail,
  type SpecialOrderEmailData,
} from "./templates/special-order-admin"

/**
 * Sends the admin notification when a /special-orders form is submitted.
 * Errors are logged and swallowed — the request is already persisted in the
 * `special-orders` collection, so a missed email is not a lost order.
 */
export async function sendSpecialOrderAdminEmail(
  data: SpecialOrderEmailData,
): Promise<void> {
  if (!isResendConfigured()) {
    console.warn(
      "[email] Resend not configured — skipping special-order notification.",
    )
    return
  }

  const template = buildSpecialOrderAdminEmail(data)
  try {
    await getResendClient().emails.send({
      from: EMAIL_FROM,
      to: EMAIL_ADMIN,
      subject: template.subject,
      html: template.html,
      replyTo: data.email,
    })
  } catch (err) {
    console.error("[email] special-order notification failed:", err)
  }
}
