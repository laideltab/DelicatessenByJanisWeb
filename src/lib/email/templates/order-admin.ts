import {
  COLORS,
  escapeHtml,
  formatPickupTime,
  renderLineItemsTable,
  renderShell,
  renderTotals,
  type EmailOrder,
} from "./shared"

/**
 * Notification to Janis when a new order comes in. Same shell, but the body
 * leads with what she needs to act on (pickup time + items) and includes
 * customer contact info.
 */
export function buildOrderAdminEmail(order: EmailOrder): {
  subject: string
  html: string
} {
  const fulfillmentBlock =
    order.fulfillment.type === "pickup"
      ? `
      <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${COLORS.ink800};">Pickup needed by</p>
      <p style="margin:6px 0 0 0;font-family:'Fraunces','Georgia',serif;font-size:24px;color:${COLORS.ink900};">${escapeHtml(formatPickupTime(order.fulfillment.pickupAt))}</p>
    `
      : `
      <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${COLORS.ink800};">Delivery to</p>
      <p style="margin:6px 0 0 0;font-size:14px;color:${COLORS.ink900};">${escapeHtml(order.fulfillment.addressLine)}</p>
    `

  const notes =
    order.fulfillment.notes && order.fulfillment.notes.trim().length > 0
      ? `<p style="margin:12px 0 0 0;padding:12px;background:${COLORS.blush100};border-radius:8px;font-size:13px;color:${COLORS.ink800};"><strong>Customer notes:</strong> ${escapeHtml(order.fulfillment.notes)}</p>`
      : ""

  const body = `
    <p style="margin:0;font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:${COLORS.brass600};">
      New order
    </p>
    <h1 style="margin:6px 0 0 0;font-family:'Fraunces','Georgia',serif;font-size:28px;line-height:1.1;color:${COLORS.ink900};">
      ${escapeHtml(order.customerName)} · ${escapeHtml(order.fulfillment.type === "pickup" ? "Pickup" : "Delivery")}
    </h1>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px;background:${COLORS.sugar100};border-radius:12px;">
      <tr>
        <td style="padding:18px;">
          ${fulfillmentBlock}
          ${notes}
        </td>
      </tr>
    </table>

    <h2 style="margin:28px 0 8px 0;font-family:'Fraunces','Georgia',serif;font-size:18px;color:${COLORS.ink900};">Items</h2>
    ${renderLineItemsTable(order.lineItems)}
    ${renderTotals(order)}

    <h2 style="margin:28px 0 8px 0;font-family:'Fraunces','Georgia',serif;font-size:18px;color:${COLORS.ink900};">Customer</h2>
    <p style="margin:0;font-size:14px;color:${COLORS.ink800};">
      ${escapeHtml(order.customerName)}<br>
      <a href="mailto:${order.customerEmail}" style="color:${COLORS.ink800};">${escapeHtml(order.customerEmail)}</a><br>
      <a href="tel:${escapeHtml(order.customerPhone)}" style="color:${COLORS.ink800};">${escapeHtml(order.customerPhone)}</a>
    </p>

    <p style="margin:28px 0 0 0;font-size:12px;color:${COLORS.ink700};font-family:monospace;">
      Order ID: ${escapeHtml(order.id)}
    </p>
  `

  return {
    subject: `New order · ${order.customerName} · ${order.fulfillment.type === "pickup" ? "Pickup" : "Delivery"}`,
    html: renderShell({
      preheader: `New order from ${order.customerName}`,
      bodyHtml: body,
    }),
  }
}
