"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function ProductsNavLink() {
  const pathname = usePathname() ?? ""
  const active =
    pathname === "/admin/products" || pathname.startsWith("/admin/products/")

  return (
    <Link
      href="/admin/products"
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
      Square Products
    </Link>
  )
}
