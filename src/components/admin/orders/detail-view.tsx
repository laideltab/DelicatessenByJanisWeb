import Link from "next/link"
import { headers as nextHeaders } from "next/headers"
import type { AdminViewServerProps } from "payload"
import type { Order, OrderLineItem } from "square"
import { getPayload } from "payload"
import config from "@payload-config"
import { hasRole } from "@/lib/access/roles"
import { isSquareConfigured } from "@/lib/square/client"
import { retrieveOrder } from "@/lib/square/orders"
import { addOrderNote, transitionFulfillment } from "./actions"
import {
  customerName,
  formatDateTime,
  formatMoney,
  fulfillmentSummary,
} from "./format"
import { StatePill } from "./state-pill"

type Note = {
  id: string | number
  note: string
  createdAt: string
  createdBy?: { name?: string | null; email?: string | null } | string | number | null
}

async function fetchNotes(orderId: string): Promise<Note[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: "order-notes",
    where: { squareOrderId: { equals: orderId } },
    sort: "-createdAt",
    limit: 50,
    depth: 1,
  })
  return result.docs as Note[]
}

function readSegments(params: AdminViewServerProps["params"]): string[] {
  const seg = params?.segments
  if (Array.isArray(seg)) return seg
  if (typeof seg === "string") return [seg]
  return []
}

export default async function OrderDetailView({ params }: AdminViewServerProps) {
  if (!isSquareConfigured()) {
    return (
      <div style={containerStyle}>
        <BackLink />
        <NotFound title="Square is not configured" />
      </div>
    )
  }

  const segments = readSegments(params)
  const orderId = segments[1]?.trim()
  if (!orderId) {
    return (
      <div style={containerStyle}>
        <BackLink />
        <NotFound title="Missing order id" />
      </div>
    )
  }

  let order: Order | null = null
  let error: string | null = null
  try {
    order = await retrieveOrder(orderId)
  } catch (err) {
    console.error("[admin/orders/detail] retrieve failed:", err)
    error = err instanceof Error ? err.message : "Unknown error"
  }

  if (!order) {
    return (
      <div style={containerStyle}>
        <BackLink />
        <NotFound
          title="Order not found"
          body={error ?? `No Square order with id ${orderId}.`}
        />
      </div>
    )
  }

  const ff = fulfillmentSummary(order)
  const notes = await fetchNotes(orderId)

  const payload = await getPayload({ config })
  const auth = await payload.auth({ headers: await nextHeaders() })
  const canWrite = hasRole(auth.user, "admin", "editor")

  return (
    <div style={containerStyle}>
      <BackLink />

      <header style={{ marginBottom: 20 }}>
        <p style={kicker}>Square order</p>
        <h1
          style={{
            margin: "4px 0 0 0",
            fontSize: 26,
            color: "var(--theme-text)",
          }}
        >
          {customerName(order)} ·{" "}
          <span style={{ color: "var(--theme-elevation-600)" }}>{ff.type}</span>
        </h1>
        <p
          style={{
            margin: "8px 0 0 0",
            fontFamily: "monospace",
            fontSize: 12,
            color: "var(--theme-elevation-500)",
          }}
        >
          {order.id}
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <StatePill state={order.state ?? "—"} />
          {ff.state !== "—" && ff.state !== order.state && (
            <StatePill state={ff.state} />
          )}
        </div>
      </header>

      {/* Fulfillment + actions */}
      <Section title="Fulfillment">
        <div style={kvGrid}>
          <KV label="Type" value={ff.type} />
          <KV label="Fulfillment state" value={ff.state} />
          <KV label="Scheduled" value={formatDateTime(ff.whenIso)} />
        </div>

        {canWrite && ff.uid && order.state === "OPEN" && (
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginTop: 16,
            }}
          >
            {ff.state !== "PREPARED" && ff.state !== "COMPLETED" && (
              <ActionForm
                orderId={order.id!}
                fulfillmentUid={ff.uid}
                newState="PREPARED"
                label="Mark Ready"
                tone="success"
              />
            )}
            {ff.state !== "COMPLETED" && (
              <ActionForm
                orderId={order.id!}
                fulfillmentUid={ff.uid}
                newState="COMPLETED"
                label={ff.type === "Delivery" ? "Mark Delivered" : "Mark Picked Up"}
                tone="primary"
              />
            )}
            {ff.state !== "CANCELED" && ff.state !== "COMPLETED" && (
              <ActionForm
                orderId={order.id!}
                fulfillmentUid={ff.uid}
                newState="CANCELED"
                label="Cancel Fulfillment"
                tone="danger"
              />
            )}
          </div>
        )}
      </Section>

      {/* Customer */}
      <Section title="Customer">
        <CustomerBlock order={order} />
      </Section>

      {/* Items */}
      <Section title="Items">
        <ItemsTable items={order.lineItems ?? []} />
        <TotalsBlock order={order} />
      </Section>

      {/* Internal notes */}
      <Section title="Internal notes">
        {canWrite && (
          <form
            action={addOrderNote}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 20,
              padding: 16,
              background: "var(--theme-elevation-50)",
              border: "1px solid var(--theme-border-color)",
              borderRadius: 8,
            }}
          >
            <input type="hidden" name="orderId" value={order.id!} />
            <label
              htmlFor="note-input"
              style={{
                fontSize: 12,
                color: "var(--theme-elevation-600)",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Add a note
            </label>
            <textarea
              id="note-input"
              name="note"
              required
              rows={3}
              placeholder="Allergies, special instructions, customer phone calls, etc."
              style={{
                width: "100%",
                padding: 10,
                fontSize: 14,
                fontFamily: "inherit",
                background: "var(--theme-input-bg)",
                color: "var(--theme-text)",
                border: "1px solid var(--theme-border-color)",
                borderRadius: 4,
                resize: "vertical",
              }}
            />
            <button type="submit" style={primaryButtonStyle}>
              Save note
            </button>
          </form>
        )}

        {notes.length === 0 ? (
          <p
            style={{
              fontSize: 13,
              color: "var(--theme-elevation-500)",
              fontStyle: "italic",
            }}
          >
            No notes yet.
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {notes.map((n) => (
              <li
                key={n.id}
                style={{
                  padding: "12px 14px",
                  background: "var(--theme-bg)",
                  border: "1px solid var(--theme-border-color)",
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: "var(--theme-text)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {n.note}
                </p>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: 11,
                    color: "var(--theme-elevation-500)",
                  }}
                >
                  {formatDateTime(n.createdAt)}
                  {typeof n.createdBy === "object" &&
                    n.createdBy?.name &&
                    ` · ${n.createdBy.name}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  )
}

// ─── presentational helpers ──────────────────────────────────────────────────

const containerStyle: React.CSSProperties = {
  padding: "var(--gutter-h, 32px)",
  maxWidth: 960,
  margin: "0 auto",
}

const kicker: React.CSSProperties = {
  margin: 0,
  fontSize: 11,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: "var(--theme-elevation-500)",
}

const kvGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 16,
}

const primaryButtonStyle: React.CSSProperties = {
  alignSelf: "flex-start",
  padding: "8px 16px",
  fontSize: 13,
  fontWeight: 600,
  background: "var(--theme-elevation-1000)",
  color: "var(--theme-elevation-0)",
  border: "1px solid var(--theme-elevation-1000)",
  borderRadius: 4,
  cursor: "pointer",
}

function BackLink() {
  return (
    <p style={{ marginBottom: 16 }}>
      <Link
        href="/admin/orders"
        style={{
          fontSize: 13,
          color: "var(--theme-elevation-600)",
          textDecoration: "none",
        }}
      >
        ← All orders
      </Link>
    </p>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      style={{
        marginBottom: 28,
        padding: 20,
        background: "var(--theme-bg)",
        border: "1px solid var(--theme-border-color)",
        borderRadius: 8,
      }}
    >
      <h2
        style={{
          margin: "0 0 14px 0",
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: 1,
          color: "var(--theme-elevation-600)",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        style={{
          margin: 0,
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          color: "var(--theme-elevation-500)",
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: "4px 0 0 0",
          fontSize: 14,
          color: "var(--theme-text)",
        }}
      >
        {value}
      </p>
    </div>
  )
}

function CustomerBlock({ order }: { order: Order }) {
  const pickup = order.fulfillments?.find((f) => f.type === "PICKUP")
  const delivery = order.fulfillments?.find((f) => f.type === "DELIVERY")
  const recipient =
    pickup?.pickupDetails?.recipient ?? delivery?.deliveryDetails?.recipient

  if (!recipient) {
    return (
      <p style={{ fontSize: 13, color: "var(--theme-elevation-500)" }}>
        No customer info attached to this order.
      </p>
    )
  }

  const addr = delivery?.deliveryDetails?.recipient?.address
  const addressLine = addr
    ? [
        addr.addressLine1,
        addr.addressLine2,
        [addr.locality, addr.administrativeDistrictLevel1, addr.postalCode]
          .filter(Boolean)
          .join(", "),
      ]
        .filter(Boolean)
        .join("\n")
    : null

  return (
    <div style={kvGrid}>
      <KV label="Name" value={recipient.displayName ?? "—"} />
      {recipient.emailAddress && (
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              color: "var(--theme-elevation-500)",
            }}
          >
            Email
          </p>
          <a
            href={`mailto:${recipient.emailAddress}`}
            style={{
              fontSize: 14,
              color: "var(--theme-text)",
              textDecoration: "underline",
            }}
          >
            {recipient.emailAddress}
          </a>
        </div>
      )}
      {recipient.phoneNumber && (
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              color: "var(--theme-elevation-500)",
            }}
          >
            Phone
          </p>
          <a
            href={`tel:${recipient.phoneNumber}`}
            style={{
              fontSize: 14,
              color: "var(--theme-text)",
              textDecoration: "underline",
            }}
          >
            {recipient.phoneNumber}
          </a>
        </div>
      )}
      {addressLine && (
        <div style={{ gridColumn: "1 / -1" }}>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              color: "var(--theme-elevation-500)",
            }}
          >
            Delivery address
          </p>
          <p
            style={{
              margin: "4px 0 0 0",
              fontSize: 14,
              color: "var(--theme-text)",
              whiteSpace: "pre-line",
            }}
          >
            {addressLine}
          </p>
        </div>
      )}
      {(pickup?.pickupDetails?.note ||
        delivery?.deliveryDetails?.note) && (
        <div style={{ gridColumn: "1 / -1" }}>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              color: "var(--theme-elevation-500)",
            }}
          >
            Customer note
          </p>
          <p
            style={{
              margin: "4px 0 0 0",
              fontSize: 14,
              color: "var(--theme-text)",
              whiteSpace: "pre-line",
            }}
          >
            {pickup?.pickupDetails?.note ?? delivery?.deliveryDetails?.note}
          </p>
        </div>
      )}
    </div>
  )
}

function ItemsTable({ items }: { items: OrderLineItem[] }) {
  if (items.length === 0) {
    return (
      <p style={{ fontSize: 13, color: "var(--theme-elevation-500)" }}>
        No line items.
      </p>
    )
  }
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr
          style={{
            textAlign: "left",
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "var(--theme-elevation-600)",
          }}
        >
          <th style={{ padding: "8px 10px", fontWeight: 600 }}>Item</th>
          <th style={{ padding: "8px 10px", fontWeight: 600, width: 80 }}>Qty</th>
          <th
            style={{
              padding: "8px 10px",
              fontWeight: 600,
              textAlign: "right",
              width: 120,
            }}
          >
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((li, i) => (
          <tr
            key={li.uid ?? i}
            style={{
              borderTop: "1px solid var(--theme-border-color)",
            }}
          >
            <td style={{ padding: "10px", fontSize: 14 }}>
              {li.name ?? "Item"}
              {li.variationName && (
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--theme-elevation-500)",
                    marginTop: 2,
                  }}
                >
                  {li.variationName}
                </div>
              )}
            </td>
            <td style={{ padding: "10px", fontSize: 14 }}>{li.quantity}</td>
            <td
              style={{
                padding: "10px",
                fontSize: 14,
                textAlign: "right",
                fontFamily: "monospace",
              }}
            >
              {formatMoney(li.totalMoney)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function TotalsBlock({ order }: { order: Order }) {
  const rows: { label: string; value: string }[] = []
  if (order.netAmounts?.totalMoney) {
    rows.push({
      label: "Subtotal",
      value: formatMoney(order.netAmounts.totalMoney),
    })
  }
  if (order.totalDiscountMoney?.amount) {
    rows.push({
      label: "Discount",
      value: `− ${formatMoney(order.totalDiscountMoney)}`,
    })
  }
  if (order.totalTaxMoney?.amount) {
    rows.push({ label: "Tax", value: formatMoney(order.totalTaxMoney) })
  }
  rows.push({ label: "Total", value: formatMoney(order.totalMoney) })
  return (
    <table
      style={{
        width: "100%",
        marginTop: 16,
        borderTop: "1px solid var(--theme-border-color)",
      }}
    >
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.label}>
            <td
              style={{
                padding: "8px 10px",
                fontSize: 13,
                color: "var(--theme-elevation-600)",
                width: "70%",
              }}
            >
              {row.label}
            </td>
            <td
              style={{
                padding: "8px 10px",
                fontSize: i === rows.length - 1 ? 16 : 13,
                fontWeight: i === rows.length - 1 ? 600 : 400,
                textAlign: "right",
                fontFamily: "monospace",
                color: "var(--theme-text)",
              }}
            >
              {row.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ActionForm({
  orderId,
  fulfillmentUid,
  newState,
  label,
  tone,
}: {
  orderId: string
  fulfillmentUid: string
  newState: "PREPARED" | "COMPLETED" | "CANCELED"
  label: string
  tone: "primary" | "success" | "danger"
}) {
  const palette =
    tone === "success"
      ? {
          bg: "var(--theme-success-500)",
          fg: "var(--theme-elevation-0)",
          border: "var(--theme-success-500)",
        }
      : tone === "danger"
        ? {
            bg: "var(--theme-error-500, #c8302c)",
            fg: "var(--theme-elevation-0)",
            border: "var(--theme-error-500, #c8302c)",
          }
        : {
            bg: "var(--theme-elevation-1000)",
            fg: "var(--theme-elevation-0)",
            border: "var(--theme-elevation-1000)",
          }
  return (
    <form action={transitionFulfillment}>
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="fulfillmentUid" value={fulfillmentUid} />
      <input type="hidden" name="newState" value={newState} />
      <button
        type="submit"
        style={{
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: 600,
          background: palette.bg,
          color: palette.fg,
          border: `1px solid ${palette.border}`,
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        {label}
      </button>
    </form>
  )
}

function NotFound({ title, body }: { title: string; body?: string }) {
  return (
    <div
      style={{
        padding: "32px 20px",
        textAlign: "center",
        background: "var(--theme-elevation-50)",
        border: "1px dashed var(--theme-border-color)",
        borderRadius: 8,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 16, color: "var(--theme-text)" }}>
        {title}
      </h2>
      {body && (
        <p
          style={{
            margin: "6px 0 0 0",
            fontSize: 13,
            color: "var(--theme-elevation-700)",
          }}
        >
          {body}
        </p>
      )}
    </div>
  )
}
