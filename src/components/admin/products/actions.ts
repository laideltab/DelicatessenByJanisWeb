"use server"

import { headers as nextHeaders } from "next/headers"
import { redirect } from "next/navigation"
import { getPayload } from "payload"
import config from "@payload-config"
import { hasRole } from "@/lib/access/roles"
import { getCatalog } from "@/lib/square/queries"

async function requireProductWriter() {
  const payload = await getPayload({ config })
  const headers = await nextHeaders()
  const auth = await payload.auth({ headers })
  if (!auth.user) throw new Error("Unauthorized")
  if (!hasRole(auth.user, "admin", "editor")) {
    throw new Error("Forbidden — only admin/editor can manage product overrides")
  }
  return { payload, user: auth.user }
}

/**
 * Find-or-create the override row for a Square item, then redirect the user
 * to Payload's standard edit page for it. This sidesteps having to rebuild
 * a richText editor inside our custom admin view.
 */
export async function openOrCreateOverride(formData: FormData): Promise<void> {
  const squareItemId = String(formData.get("squareItemId") ?? "").trim()
  if (!squareItemId) {
    throw new Error("Missing squareItemId")
  }

  const { payload } = await requireProductWriter()

  const existing = await payload.find({
    collection: "product-overrides",
    where: { squareItemId: { equals: squareItemId } },
    limit: 1,
    overrideAccess: true,
  })

  let id: string | number | undefined = existing.docs[0]?.id

  if (!id) {
    const { products } = await getCatalog()
    const nameSnapshot =
      products.find((p) => p.id === squareItemId)?.name ?? null

    const created = await payload.create({
      collection: "product-overrides",
      data: {
        squareItemId,
        productNameSnapshot: nameSnapshot ?? undefined,
        featuredOnHomepage: false,
        displayOrder: 0,
      },
      overrideAccess: true,
    })
    id = created.id
  }

  redirect(`/admin/collections/product-overrides/${id}`)
}
