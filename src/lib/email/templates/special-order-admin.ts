import { COLORS, escapeHtml, renderShell } from "./shared"

export type SpecialOrderEmailData = {
  name: string
  email: string
  phone: string
  eventDate: string
  guests: number
  occasion: string
  description: string
  reference?: string | null
}

function formatEventDate(iso: string): string {
  try {
    // Anchor to noon UTC so a date-only string ("2026-05-15") doesn't shift
    // a day backward when rendered in a Western timezone.
    const d = new Date(`${iso}T12:00:00Z`)
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    })
  } catch {
    return iso
  }
}

/**
 * Notification to Janis when a customer submits the /special-orders form.
 * Mirrors the order-admin template style — branded shell, ink/brass palette.
 */
export function buildSpecialOrderAdminEmail(data: SpecialOrderEmailData): {
  subject: string
  html: string
} {
  const referenceBlock =
    data.reference && data.reference.trim().length > 0
      ? `
      <h2 style="margin:28px 0 8px 0;font-family:'Fraunces','Georgia',serif;font-size:18px;color:${COLORS.ink900};">Reference / Inspiration</h2>
      <p style="margin:0;padding:12px;background:${COLORS.sugar100};border-radius:8px;font-size:13px;color:${COLORS.ink800};white-space:pre-wrap;">${escapeHtml(data.reference)}</p>`
      : ""

  const body = `
    <p style="margin:0;font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:${COLORS.brass600};">
      New special order request
    </p>
    <h1 style="margin:6px 0 0 0;font-family:'Fraunces','Georgia',serif;font-size:28px;line-height:1.1;color:${COLORS.ink900};">
      ${escapeHtml(data.name)} · ${escapeHtml(data.occasion)}
    </h1>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px;background:${COLORS.sugar100};border-radius:12px;">
      <tr>
        <td style="padding:18px;">
          <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${COLORS.ink800};">Event date</p>
          <p style="margin:6px 0 0 0;font-family:'Fraunces','Georgia',serif;font-size:22px;color:${COLORS.ink900};">${escapeHtml(formatEventDate(data.eventDate))}</p>
          <p style="margin:14px 0 0 0;font-size:13px;color:${COLORS.ink700};">${escapeHtml(String(data.guests))} guests</p>
        </td>
      </tr>
    </table>

    <h2 style="margin:28px 0 8px 0;font-family:'Fraunces','Georgia',serif;font-size:18px;color:${COLORS.ink900};">What they want</h2>
    <p style="margin:0;font-size:14px;color:${COLORS.ink800};white-space:pre-wrap;">${escapeHtml(data.description)}</p>

    ${referenceBlock}

    <h2 style="margin:28px 0 8px 0;font-family:'Fraunces','Georgia',serif;font-size:18px;color:${COLORS.ink900};">Customer</h2>
    <p style="margin:0;font-size:14px;color:${COLORS.ink800};">
      ${escapeHtml(data.name)}<br>
      <a href="mailto:${data.email}" style="color:${COLORS.ink800};">${escapeHtml(data.email)}</a><br>
      <a href="tel:${escapeHtml(data.phone)}" style="color:${COLORS.ink800};">${escapeHtml(data.phone)}</a>
    </p>
  `

  return {
    subject: `Special order · ${data.name} · ${data.occasion}`,
    html: renderShell({
      preheader: `New special order from ${data.name} for ${data.occasion}`,
      bodyHtml: body,
    }),
  }
}
