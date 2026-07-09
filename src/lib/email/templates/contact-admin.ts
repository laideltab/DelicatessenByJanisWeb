import { COLORS, escapeHtml, renderShell } from "./shared"

export type ContactEmailData = {
  name: string
  email: string
  subject: string
  message: string
}

/**
 * Notification to Janis when a customer submits the /contact form.
 * Mirrors the special-order-admin template style.
 */
export function buildContactAdminEmail(data: ContactEmailData): {
  subject: string
  html: string
} {
  const body = `
    <p style="margin:0;font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:${COLORS.brass600};">
      New contact message
    </p>
    <h1 style="margin:6px 0 0 0;font-family:'Fraunces','Georgia',serif;font-size:28px;line-height:1.1;color:${COLORS.ink900};">
      ${escapeHtml(data.subject)}
    </h1>

    <h2 style="margin:28px 0 8px 0;font-family:'Fraunces','Georgia',serif;font-size:18px;color:${COLORS.ink900};">Message</h2>
    <p style="margin:0;font-size:14px;color:${COLORS.ink800};white-space:pre-wrap;">${escapeHtml(data.message)}</p>

    <h2 style="margin:28px 0 8px 0;font-family:'Fraunces','Georgia',serif;font-size:18px;color:${COLORS.ink900};">From</h2>
    <p style="margin:0;font-size:14px;color:${COLORS.ink800};">
      ${escapeHtml(data.name)}<br>
      <a href="mailto:${data.email}" style="color:${COLORS.ink800};">${escapeHtml(data.email)}</a>
    </p>
  `

  return {
    subject: `Contact · ${data.name} · ${data.subject}`,
    html: renderShell({
      preheader: `New message from ${data.name}: ${data.subject}`,
      bodyHtml: body,
    }),
  }
}
