import { siteConfig } from "@/lib/site-config"

export const COLORS = {
  blush100: "#f6d0d8",
  blush200: "#f4becf",
  sugar100: "#f4f2ec",
  ink800: "#212121",
  ink900: "#0a0a0a",
  ink700: "#3a3a3a",
  brass500: "#c9a063",
  brass600: "#a98850",
  white: "#ffffff",
}

export type EmailMoney = { amount: number; currency: string }
export type EmailLineItem = {
  name: string
  variantName?: string | null
  qty: number
  total: EmailMoney
}
export type EmailOrder = {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  fulfillment:
    | {
        type: "pickup"
        pickupAt: string | null
        notes: string | null
      }
    | {
        type: "delivery"
        addressLine: string
        notes: string | null
      }
  lineItems: EmailLineItem[]
  subtotal: EmailMoney | null
  tax: EmailMoney | null
  discount: EmailMoney | null
  total: EmailMoney
  /** Absolute URL to the public order status page, e.g. https://…/order/abc */
  statusUrl: string
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export function formatMoney(money: EmailMoney): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currency,
  }).format(money.amount)
}

export function formatPickupTime(iso: string | null): string {
  if (!iso) return "ASAP — we&rsquo;ll let you know when it&rsquo;s ready."
  try {
    const d = new Date(iso)
    return d.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

/**
 * Wraps a content fragment in the standard branded shell — header band,
 * footer with address, brass divider lines. All styles inline because email
 * clients largely ignore <style> blocks.
 */
export function renderShell({
  preheader,
  bodyHtml,
}: {
  preheader: string
  bodyHtml: string
}): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(siteConfig.name)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.sugar100};color:${COLORS.ink800};font-family:'Inter','Helvetica Neue',Arial,sans-serif;">
<span style="display:none;visibility:hidden;mso-hide:all;color:transparent;height:0;width:0;font-size:1px;line-height:1px;">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${COLORS.sugar100};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background:${COLORS.white};border-radius:16px;border:1px solid ${COLORS.blush100};overflow:hidden;">
        <!-- Awning band -->
        <tr>
          <td style="height:8px;background-image:repeating-linear-gradient(90deg, ${COLORS.blush100} 0 24px, ${COLORS.blush200} 24px 48px);">&nbsp;</td>
        </tr>
        <tr>
          <td style="padding:32px 32px 8px 32px;text-align:center;">
            <p style="margin:0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:${COLORS.ink800};">
              ${escapeHtml(siteConfig.name)}
            </p>
            <p style="margin:6px 0 0 0;font-size:13px;color:${COLORS.brass600};font-style:italic;font-family:'Fraunces','Georgia',serif;">
              ${escapeHtml(siteConfig.tagline)}
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 40px 32px;">
            ${bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid ${COLORS.blush100};padding:24px 32px;background:${COLORS.sugar100};text-align:center;font-size:12px;color:${COLORS.ink700};">
            ${escapeHtml(siteConfig.address.streetAddress)} ·
            ${escapeHtml(siteConfig.address.addressLocality)},
            ${escapeHtml(siteConfig.address.addressRegion)}
            ${escapeHtml(siteConfig.address.postalCode)}<br>
            <a href="${siteConfig.url}" style="color:${COLORS.ink800};text-decoration:underline;">${escapeHtml(siteConfig.url.replace(/^https?:\/\//, ""))}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

export function renderLineItemsTable(items: EmailLineItem[]): string {
  if (items.length === 0) return ""
  const rows = items
    .map(
      (li) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${COLORS.blush100};">
        <div style="font-size:14px;color:${COLORS.ink900};">${escapeHtml(li.name)}</div>
        <div style="font-size:12px;color:${COLORS.ink700};">${escapeHtml(li.variantName ?? "")}${li.variantName ? " · " : ""}Qty ${li.qty}</div>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid ${COLORS.blush100};text-align:right;font-family:'Fraunces','Georgia',serif;color:${COLORS.ink900};">
        ${formatMoney(li.total)}
      </td>
    </tr>`,
    )
    .join("")

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    ${rows}
  </table>`
}

export function renderTotals(order: EmailOrder): string {
  const rows: string[] = []
  if (order.subtotal) {
    rows.push(
      `<tr><td style="padding:4px 0;color:${COLORS.ink700};font-size:14px;">Subtotal</td><td style="padding:4px 0;text-align:right;color:${COLORS.ink900};font-size:14px;">${formatMoney(order.subtotal)}</td></tr>`,
    )
  }
  if (order.discount && order.discount.amount > 0) {
    rows.push(
      `<tr><td style="padding:4px 0;color:${COLORS.ink700};font-size:14px;">Discount</td><td style="padding:4px 0;text-align:right;color:${COLORS.ink900};font-size:14px;">− ${formatMoney(order.discount)}</td></tr>`,
    )
  }
  if (order.tax) {
    rows.push(
      `<tr><td style="padding:4px 0;color:${COLORS.ink700};font-size:14px;">Tax</td><td style="padding:4px 0;text-align:right;color:${COLORS.ink900};font-size:14px;">${formatMoney(order.tax)}</td></tr>`,
    )
  }
  rows.push(
    `<tr><td style="padding-top:12px;border-top:1px solid ${COLORS.brass500};color:${COLORS.ink800};font-size:13px;letter-spacing:0.18em;text-transform:uppercase;">Total</td><td style="padding-top:12px;border-top:1px solid ${COLORS.brass500};text-align:right;color:${COLORS.ink900};font-family:'Fraunces','Georgia',serif;font-size:22px;">${formatMoney(order.total)}</td></tr>`,
  )

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:12px;">
    ${rows.join("")}
  </table>`
}
