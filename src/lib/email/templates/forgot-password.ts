import { siteConfig } from "@/lib/site-config"
import { COLORS, escapeHtml, renderShell } from "./shared"

/**
 * Forgot-password email body. Payload calls `generateEmailHTML` with `token`
 * (and `req`/`user`); we use `req.headers` to derive the admin URL so the
 * link works behind tunnels and across deploys.
 */
export function buildForgotPasswordEmail({
  resetUrl,
  recipientName,
}: {
  resetUrl: string
  recipientName?: string | null
}): { subject: string; html: string } {
  const greeting = recipientName ? `Hi ${escapeHtml(recipientName)},` : "Hi,"

  const body = `
    <p style="margin:0;font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:${COLORS.brass600};">
      Password reset
    </p>
    <h1 style="margin:6px 0 0 0;font-family:'Fraunces','Georgia',serif;font-size:28px;line-height:1.1;color:${COLORS.ink900};">
      Reset your admin password.
    </h1>

    <p style="margin:20px 0 0 0;font-size:14px;color:${COLORS.ink800};">
      ${greeting}
    </p>
    <p style="margin:12px 0 0 0;font-size:14px;color:${COLORS.ink800};">
      Someone (hopefully you) requested a password reset for your
      ${escapeHtml(siteConfig.name)} admin account. Click the button below to
      choose a new password. The link expires in one hour.
    </p>

    <p style="margin:24px 0 0 0;">
      <a href="${resetUrl}"
         style="display:inline-block;padding:12px 22px;background:${COLORS.ink900};color:${COLORS.white};text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;letter-spacing:0.04em;">
        Reset password
      </a>
    </p>

    <p style="margin:28px 0 0 0;font-size:12px;color:${COLORS.ink700};">
      If the button does not work, copy and paste this URL into your browser:<br>
      <span style="word-break:break-all;color:${COLORS.ink800};">${escapeHtml(resetUrl)}</span>
    </p>
    <p style="margin:12px 0 0 0;font-size:12px;color:${COLORS.ink700};">
      Did not request this? You can safely ignore this email — your password
      will not change.
    </p>
  `

  return {
    subject: `Reset your ${siteConfig.name} admin password`,
    html: renderShell({
      preheader: "Reset your admin password — link expires in 1 hour.",
      bodyHtml: body,
    }),
  }
}
