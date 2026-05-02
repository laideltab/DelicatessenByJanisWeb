import {
  COLORS,
  escapeHtml,
  formatPickupTime,
  renderLineItemsTable,
  renderShell,
  renderTotals,
  type EmailOrder,
} from "./shared"

export function buildOrderConfirmationEmail(order: EmailOrder): {
  subject: string
  html: string
} {
  const firstName = order.customerName.split(/\s+/)[0]

  const fulfillmentBlock =
    order.fulfillment.type === "pickup"
      ? `
      <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${COLORS.ink800};">Pickup</p>
      <p style="margin:6px 0 0 0;font-size:14px;color:${COLORS.ink900};">${escapeHtml(formatPickupTime(order.fulfillment.pickupAt))}</p>
      <p style="margin:4px 0 0 0;font-size:13px;color:${COLORS.ink700};">Miami International Mall · Doral, FL</p>
    `
      : `
      <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${COLORS.ink800};">Delivery</p>
      <p style="margin:6px 0 0 0;font-size:14px;color:${COLORS.ink900};">${escapeHtml(order.fulfillment.addressLine)}</p>
      <p style="margin:4px 0 0 0;font-size:13px;color:${COLORS.ink700};">We&rsquo;ll be in touch by phone to confirm.</p>
    `

  const notes =
    order.fulfillment.notes && order.fulfillment.notes.trim().length > 0
      ? `<p style="margin:12px 0 0 0;padding:12px;background:${COLORS.blush100};border-radius:8px;font-size:13px;color:${COLORS.ink800};"><strong>Notes:</strong> ${escapeHtml(order.fulfillment.notes)}</p>`
      : ""

  const body = `
    <h1 style="margin:0;font-family:'Fraunces','Georgia',serif;font-size:32px;line-height:1.1;color:${COLORS.ink900};">
      Thank you, <span style="font-style:italic;">${escapeHtml(firstName)}</span>.
    </h1>
    <p style="margin:16px 0 0 0;font-size:15px;line-height:1.6;color:${COLORS.ink700};">
      We&rsquo;ve got your order. Here&rsquo;s the receipt — keep it for your records,
      and use the link below to check the status anytime.
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px;background:${COLORS.sugar100};border-radius:12px;">
      <tr>
        <td style="padding:18px;">
          ${fulfillmentBlock}
          ${notes}
        </td>
      </tr>
    </table>

    <h2 style="margin:32px 0 12px 0;font-family:'Fraunces','Georgia',serif;font-size:20px;color:${COLORS.ink900};">
      Receipt
    </h2>
    ${renderLineItemsTable(order.lineItems)}
    ${renderTotals(order)}

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:32px;">
      <tr>
        <td align="center">
          <a href="${order.statusUrl}" style="display:inline-block;background:${COLORS.ink900};color:${COLORS.brass500};padding:14px 28px;border-radius:8px;text-decoration:none;font-size:13px;letter-spacing:0.22em;text-transform:uppercase;font-weight:600;">
            Track this order
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:24px 0 0 0;font-size:12px;line-height:1.6;color:${COLORS.ink700};text-align:center;">
      Questions? Reply to this email or call us — we&rsquo;ll get back the same day.
    </p>
    <p style="margin:8px 0 0 0;font-size:11px;color:${COLORS.ink700};text-align:center;font-family:monospace;">
      Order ID: ${escapeHtml(order.id)}
    </p>
  `

  return {
    subject: `Your order is confirmed · #${order.id.slice(0, 8)}`,
    html: renderShell({
      preheader: `Thanks ${firstName}, we received your order.`,
      bodyHtml: body,
    }),
  }
}
