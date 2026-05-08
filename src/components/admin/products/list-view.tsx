import Link from "next/link"
import type { AdminViewServerProps } from "payload"
import { isSquareConfigured } from "@/lib/square/client"
import { getCatalogGrouped } from "@/lib/square/queries"
import { getProductOverridesByItemId } from "@/lib/square/product-overrides"
import { openOrCreateOverride } from "./actions"

function readSearchParam(value: unknown): string | undefined {
  if (typeof value === "string") return value
  if (Array.isArray(value) && typeof value[0] === "string") return value[0]
  return undefined
}

function formatMoney(money: { amount: number; currency: string } | null): string {
  if (!money) return "—"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currency,
  }).format(money.amount / 100)
}

export default async function ProductsListView({
  searchParams,
}: AdminViewServerProps) {
  if (!isSquareConfigured()) {
    return (
      <div style={containerStyle}>
        <Empty
          title="Square is not configured"
          body="Set SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID to manage products."
        />
      </div>
    )
  }

  let grouped, overrides
  try {
    ;[grouped, overrides] = await Promise.all([
      getCatalogGrouped(),
      getProductOverridesByItemId(),
    ])
  } catch (err) {
    console.error("[admin/products] load failed:", err)
    return (
      <div style={containerStyle}>
        <Empty
          title="Could not load Square catalog"
          body={err instanceof Error ? err.message : "Unknown error"}
        />
      </div>
    )
  }

  const categoryFilter = readSearchParam(searchParams?.category) ?? "ALL"
  const categories = grouped.categories
  const allProducts = grouped.products

  const visibleProducts =
    categoryFilter === "ALL"
      ? allProducts
      : allProducts.filter((p) => p.categoryIds.includes(categoryFilter))

  // Sort: featured first, then by override displayOrder, then by name.
  const sorted = [...visibleProducts].sort((a, b) => {
    const ao = overrides.get(a.id)
    const bo = overrides.get(b.id)
    const af = ao?.featuredOnHomepage ? 1 : 0
    const bf = bo?.featuredOnHomepage ? 1 : 0
    if (af !== bf) return bf - af
    const aOrd = ao?.displayOrder ?? 0
    const bOrd = bo?.displayOrder ?? 0
    if (aOrd !== bOrd) return aOrd - bOrd
    return a.name.localeCompare(b.name)
  })

  const idToCategoryName = new Map(
    grouped.categories.map((c) => [c.id, c.name]),
  )

  return (
    <div style={containerStyle}>
      <header style={{ marginBottom: 24 }}>
        <p style={kicker}>Operations</p>
        <h1
          style={{
            margin: "4px 0 0 0",
            fontSize: 28,
            color: "var(--theme-text)",
          }}
        >
          Square Products
        </h1>
        <p
          style={{
            margin: "6px 0 0 0",
            fontSize: 13,
            color: "var(--theme-elevation-600)",
          }}
        >
          Live catalog from Square. Click <em>Edit overrides</em> to add a long
          description, SEO, extra image, or homepage feature toggle.
        </p>
      </header>

      <form
        method="GET"
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-end",
          marginBottom: 20,
          padding: "16px 20px",
          background: "var(--theme-elevation-50)",
          border: "1px solid var(--theme-border-color)",
          borderRadius: 8,
        }}
      >
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 12,
            color: "var(--theme-elevation-600)",
          }}
        >
          Category
          <select
            name="category"
            defaultValue={categoryFilter}
            style={{
              padding: "6px 10px",
              fontSize: 14,
              minWidth: 220,
              background: "var(--theme-input-bg)",
              color: "var(--theme-text)",
              border: "1px solid var(--theme-border-color)",
              borderRadius: 4,
            }}
          >
            <option value="ALL">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" style={primaryButtonStyle}>
          Apply
        </button>
        {categoryFilter !== "ALL" && (
          <Link
            href="/admin/products"
            style={{
              fontSize: 13,
              color: "var(--theme-elevation-600)",
              textDecoration: "underline",
            }}
          >
            Clear
          </Link>
        )}
      </form>

      <div
        style={{
          fontSize: 12,
          color: "var(--theme-elevation-600)",
          marginBottom: 8,
        }}
      >
        {sorted.length} product{sorted.length === 1 ? "" : "s"} ·{" "}
        {overrides.size} override{overrides.size === 1 ? "" : "s"} configured
      </div>

      {sorted.length === 0 ? (
        <Empty
          title="No products"
          body="Create products in Square first — this view reads from the live Square catalog."
        />
      ) : (
        <div
          style={{
            border: "1px solid var(--theme-border-color)",
            borderRadius: 8,
            overflow: "hidden",
            background: "var(--theme-bg)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "var(--theme-elevation-50)",
                  textAlign: "left",
                  fontSize: 11,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "var(--theme-elevation-600)",
                }}
              >
                <th style={th}>Product</th>
                <th style={th}>Category</th>
                <th style={{ ...th, textAlign: "right" }}>Price</th>
                <th style={th}>Stock</th>
                <th style={th}>Featured</th>
                <th style={{ ...th, textAlign: "right" }}>Order</th>
                <th style={{ ...th, width: 1 }} aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((product) => {
                const ov = overrides.get(product.id)
                const categoryName = product.categoryIds
                  .map((cid) => idToCategoryName.get(cid))
                  .filter(Boolean)
                  .join(", ")
                return (
                  <tr
                    key={product.id}
                    style={{ borderTop: "1px solid var(--theme-border-color)" }}
                  >
                    <td style={td}>
                      <div style={{ fontWeight: 500 }}>{product.name}</div>
                      {ov ? (
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--theme-success-600, #0b6e99)",
                            marginTop: 2,
                          }}
                        >
                          Overrides configured
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--theme-elevation-500)",
                            marginTop: 2,
                          }}
                        >
                          No overrides
                        </div>
                      )}
                    </td>
                    <td style={td}>{categoryName || "—"}</td>
                    <td style={{ ...td, textAlign: "right", fontFamily: "monospace" }}>
                      {formatMoney(product.basePrice)}
                    </td>
                    <td style={td}>
                      {product.inStock ? (
                        <Pill tone="success">In stock</Pill>
                      ) : (
                        <Pill tone="warning">Out</Pill>
                      )}
                    </td>
                    <td style={td}>
                      {ov?.featuredOnHomepage ? (
                        <Pill tone="success">★ Featured</Pill>
                      ) : (
                        <span style={{ color: "var(--theme-elevation-500)" }}>—</span>
                      )}
                    </td>
                    <td style={{ ...td, textAlign: "right", fontFamily: "monospace" }}>
                      {ov?.displayOrder ?? 0}
                    </td>
                    <td style={{ ...td, textAlign: "right" }}>
                      <form action={openOrCreateOverride} style={{ margin: 0 }}>
                        <input
                          type="hidden"
                          name="squareItemId"
                          value={product.id}
                        />
                        <button
                          type="submit"
                          style={{
                            padding: "6px 12px",
                            fontSize: 12,
                            fontWeight: 600,
                            background: "var(--theme-elevation-1000)",
                            color: "var(--theme-elevation-0)",
                            border: "1px solid var(--theme-elevation-1000)",
                            borderRadius: 4,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {ov ? "Edit overrides →" : "Add overrides →"}
                        </button>
                      </form>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  padding: "var(--gutter-h, 32px)",
  maxWidth: 1280,
  margin: "0 auto",
}

const kicker: React.CSSProperties = {
  margin: 0,
  fontSize: 11,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: "var(--theme-elevation-500)",
}

const th: React.CSSProperties = { padding: "10px 14px", fontWeight: 600 }

const td: React.CSSProperties = {
  padding: "12px 14px",
  fontSize: 13,
  color: "var(--theme-text)",
  verticalAlign: "top",
}

const primaryButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  fontSize: 13,
  fontWeight: 600,
  background: "var(--theme-elevation-1000)",
  color: "var(--theme-elevation-0)",
  border: "1px solid var(--theme-elevation-1000)",
  borderRadius: 4,
  cursor: "pointer",
}

function Pill({
  tone,
  children,
}: {
  tone: "success" | "warning"
  children: React.ReactNode
}) {
  const palette =
    tone === "success"
      ? {
          bg: "var(--theme-success-100)",
          fg: "var(--theme-success-800)",
          border: "var(--theme-success-300)",
        }
      : {
          bg: "var(--theme-warning-100)",
          fg: "var(--theme-warning-800)",
          border: "var(--theme-warning-300)",
        }
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.5,
        borderRadius: 999,
        background: palette.bg,
        color: palette.fg,
        border: `1px solid ${palette.border}`,
      }}
    >
      {children}
    </span>
  )
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div
      style={{
        padding: "32px 20px",
        textAlign: "center",
        background: "var(--theme-elevation-50)",
        border: "1px dashed var(--theme-border-color)",
        borderRadius: 8,
        color: "var(--theme-elevation-700)",
      }}
    >
      <h2 style={{ margin: 0, fontSize: 16, color: "var(--theme-text)" }}>
        {title}
      </h2>
      <p style={{ margin: "6px 0 0 0", fontSize: 13 }}>{body}</p>
    </div>
  )
}
