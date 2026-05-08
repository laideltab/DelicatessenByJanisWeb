import Link from "next/link"
import type { OrderState } from "square"
import type { AdminViewServerProps } from "payload"
import { isSquareConfigured } from "@/lib/square/client"
import { searchOrders } from "@/lib/square/orders"
import {
  customerName,
  formatDateTime,
  formatMoney,
  fulfillmentSummary,
} from "./format"
import { StatePill } from "./state-pill"

type StateFilter = "ALL" | OrderState

const STATE_OPTIONS: { value: StateFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "OPEN", label: "Open" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELED", label: "Canceled" },
]

function readSearchParam(value: unknown): string | undefined {
  if (typeof value === "string") return value
  if (Array.isArray(value) && typeof value[0] === "string") return value[0]
  return undefined
}

export default async function OrdersListView({
  searchParams,
}: AdminViewServerProps) {
  if (!isSquareConfigured()) {
    return (
      <Empty
        title="Square is not configured"
        body="Set SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID in your environment to see orders."
      />
    )
  }

  const stateRaw = readSearchParam(searchParams?.state) ?? "ALL"
  const cursor = readSearchParam(searchParams?.cursor)
  const validState = STATE_OPTIONS.find((o) => o.value === stateRaw)?.value ?? "ALL"
  const states: OrderState[] | undefined =
    validState === "ALL" ? undefined : [validState]

  let result
  let error: string | null = null
  try {
    result = await searchOrders({ states, cursor, limit: 50 })
  } catch (err) {
    console.error("[admin/orders] search failed:", err)
    error = err instanceof Error ? err.message : "Unknown error"
    result = { orders: [], cursor: null }
  }

  return (
    <div
      style={{
        padding: "var(--gutter-h, 32px)",
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      <header style={{ marginBottom: 24 }}>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "var(--theme-elevation-500)",
          }}
        >
          Operations
        </p>
        <h1
          style={{
            margin: "4px 0 0 0",
            fontSize: 28,
            color: "var(--theme-text)",
          }}
        >
          Square Orders
        </h1>
        <p
          style={{
            margin: "6px 0 0 0",
            fontSize: 13,
            color: "var(--theme-elevation-600)",
          }}
        >
          Recent orders from the configured Square location, newest first.
        </p>
      </header>

      {/* Filter form (URL-based, GET) */}
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
          State
          <select
            name="state"
            defaultValue={validState}
            style={{
              padding: "6px 10px",
              fontSize: 14,
              minWidth: 160,
              background: "var(--theme-input-bg)",
              color: "var(--theme-text)",
              border: "1px solid var(--theme-border-color)",
              borderRadius: 4,
            }}
          >
            {STATE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 600,
            background: "var(--theme-elevation-1000)",
            color: "var(--theme-elevation-0)",
            border: "1px solid var(--theme-elevation-1000)",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Apply
        </button>
        {validState !== "ALL" && (
          <Link
            href="/admin/orders"
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

      {error && (
        <Notice
          tone="error"
          title="Could not load orders"
          body={error}
        />
      )}

      {!error && result.orders.length === 0 && (
        <Empty
          title="No orders match"
          body="Try a different state filter or check back after a sale."
        />
      )}

      {result.orders.length > 0 && (
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
                <th style={th}>Created</th>
                <th style={th}>Customer</th>
                <th style={th}>Fulfillment</th>
                <th style={th}>State</th>
                <th style={{ ...th, textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {result.orders.map((order) => {
                const ff = fulfillmentSummary(order)
                return (
                  <tr
                    key={order.id}
                    style={{
                      borderTop: "1px solid var(--theme-border-color)",
                    }}
                  >
                    <td style={td}>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        style={{
                          color: "var(--theme-text)",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                      >
                        {formatDateTime(order.createdAt)}
                      </Link>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--theme-elevation-500)",
                          fontFamily: "monospace",
                          marginTop: 2,
                        }}
                      >
                        {order.id?.slice(0, 12)}…
                      </div>
                    </td>
                    <td style={td}>{customerName(order)}</td>
                    <td style={td}>
                      <div>{ff.type}</div>
                      {ff.whenIso && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--theme-elevation-500)",
                            marginTop: 2,
                          }}
                        >
                          {formatDateTime(ff.whenIso)}
                        </div>
                      )}
                    </td>
                    <td style={td}>
                      <StatePill state={order.state ?? "—"} />
                      {ff.state !== "—" && ff.state !== order.state && (
                        <div style={{ marginTop: 4 }}>
                          <StatePill state={ff.state} />
                        </div>
                      )}
                    </td>
                    <td style={{ ...td, textAlign: "right" }}>
                      {formatMoney(order.totalMoney)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {result.cursor && (
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Link
            href={`/admin/orders?${new URLSearchParams({
              ...(validState !== "ALL" ? { state: validState } : {}),
              cursor: result.cursor,
            }).toString()}`}
            style={{
              display: "inline-block",
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--theme-text)",
              background: "var(--theme-elevation-100)",
              border: "1px solid var(--theme-border-color)",
              borderRadius: 4,
              textDecoration: "none",
            }}
          >
            Next page →
          </Link>
        </div>
      )}
    </div>
  )
}

const th: React.CSSProperties = {
  padding: "10px 14px",
  fontWeight: 600,
}

const td: React.CSSProperties = {
  padding: "12px 14px",
  fontSize: 13,
  color: "var(--theme-text)",
  verticalAlign: "top",
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

function Notice({
  tone,
  title,
  body,
}: {
  tone: "error" | "info"
  title: string
  body: string
}) {
  const palette =
    tone === "error"
      ? {
          bg: "var(--theme-error-100, #fde8e8)",
          fg: "var(--theme-error-800, #7a1f1f)",
          border: "var(--theme-error-300, #f7c1c1)",
        }
      : {
          bg: "var(--theme-elevation-50)",
          fg: "var(--theme-elevation-800)",
          border: "var(--theme-border-color)",
        }
  return (
    <div
      style={{
        padding: "14px 18px",
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: 8,
        color: palette.fg,
        marginBottom: 16,
      }}
    >
      <strong style={{ fontSize: 13 }}>{title}</strong>
      <div style={{ marginTop: 4, fontSize: 12 }}>{body}</div>
    </div>
  )
}
