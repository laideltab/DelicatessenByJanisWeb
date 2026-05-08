"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

/**
 * Adds a "Square Orders" entry to the admin sidebar. Rendered via
 * `admin.components.afterNavLinks` so it sits alongside Payload's own
 * collection links. Styling matches Payload's nav entries closely enough to
 * not look out of place — they use `<a class="nav__link">` with the same
 * box-padding pattern.
 */
export default function OrdersNavLink() {
  const pathname = usePathname() ?? ""
  const active =
    pathname === "/admin/orders" || pathname.startsWith("/admin/orders/")

  return (
    <Link
      href="/admin/orders"
      style={{
        display: "block",
        padding: "8px 0",
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        color: active ? "var(--theme-text)" : "var(--theme-elevation-800)",
        textDecoration: "none",
        borderLeft: active
          ? "2px solid var(--theme-text)"
          : "2px solid transparent",
        paddingLeft: 12,
      }}
    >
      Square Orders
    </Link>
  )
}
