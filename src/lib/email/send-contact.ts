import {
  EMAIL_ADMIN,
  EMAIL_FROM,
  getResendClient,
  isResendConfigured,
} from "./resend"
import {
  buildContactAdminEmail,
  type ContactEmailData,
} from "./templates/contact-admin"

/**
 * Sends the admin notification when the /contact form is submitted. Throws
 * when Resend is unconfigured or delivery fails — unlike special orders,
 * the message is not persisted anywhere, so a silent miss would lose it.
 */
export async function sendContactAdminEmail(
  data: ContactEmailData,
): Promise<void> {
  if (!isResendConfigured()) {
    throw new Error("Resend is not configured — contact email cannot be sent.")
  }

  const template = buildContactAdminEmail(data)
  const { error } = await getResendClient().emails.send({
    from: EMAIL_FROM,
    to: EMAIL_ADMIN,
    subject: template.subject,
    html: template.html,
    replyTo: data.email,
  })
  if (error) {
    throw new Error(`Resend rejected the contact email: ${error.message}`)
  }
}
