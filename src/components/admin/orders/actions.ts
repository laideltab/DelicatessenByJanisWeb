"use server"

import { headers as nextHeaders } from "next/headers"
import { revalidatePath } from "next/cache"
import { getPayload } from "payload"
import config from "@payload-config"
import { hasRole } from "@/lib/access/roles"
import {
  retrieveOrder,
  updateFulfillmentState,
  type FulfillmentTransition,
} from "@/lib/square/orders"

/**
 * Resolves the current admin user and verifies they can mutate orders.
 * Viewers can read the dashboard but not transition fulfillments or add notes.
 */
async function requireOrdersWriter() {
  const payload = await getPayload({ config })
  const headers = await nextHeaders()
  const auth = await payload.auth({ headers })
  if (!auth.user) {
    throw new Error("Unauthorized")
  }
  if (!hasRole(auth.user, "admin", "editor")) {
    throw new Error("Forbidden — viewer role cannot modify orders")
  }
  return { payload, user: auth.user }
}

export async function transitionFulfillment(formData: FormData): Promise<void> {
  const orderId = String(formData.get("orderId") ?? "").trim()
  const fulfillmentUid = String(formData.get("fulfillmentUid") ?? "").trim()
  const newState = String(formData.get("newState") ?? "").trim() as FulfillmentTransition

  if (!orderId || !fulfillmentUid || !newState) {
    throw new Error("Missing required fields")
  }
  if (newState !== "PREPARED" && newState !== "COMPLETED" && newState !== "CANCELED") {
    throw new Error(`Unsupported transition: ${newState}`)
  }

  await requireOrdersWriter()

  const order = await retrieveOrder(orderId)
  if (!order || typeof order.version !== "number") {
    throw new Error("Order not found or missing version")
  }

  await updateFulfillmentState({
    orderId,
    fulfillmentUid,
    newState,
    version: order.version,
  })

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath("/admin/orders")
}

export async function addOrderNote(formData: FormData): Promise<void> {
  const orderId = String(formData.get("orderId") ?? "").trim()
  const note = String(formData.get("note") ?? "").trim()
  if (!orderId || !note) {
    throw new Error("Missing required fields")
  }

  const { payload, user } = await requireOrdersWriter()

  await payload.create({
    collection: "order-notes",
    data: {
      squareOrderId: orderId,
      note,
      createdBy: typeof user.id === "string" || typeof user.id === "number" ? user.id : undefined,
    },
    user,
  })

  revalidatePath(`/admin/orders/${orderId}`)
}
