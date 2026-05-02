import { randomUUID } from "node:crypto"
import { getSquareClient } from "../src/lib/square/client"
import { withSquare } from "../src/lib/square/errors"
import { fetchCatalog } from "../src/lib/square/catalog"
import type { CatalogObject } from "square"

if (process.env.SQUARE_ENVIRONMENT === "production") {
  console.error("❌ Refusing to seed against production. Set SQUARE_ENVIRONMENT=sandbox.")
  process.exit(1)
}

const client = getSquareClient()

async function reset() {
  const existing = await fetchCatalog()
  const ids = [
    ...existing.products.map((p) => p.id),
    ...existing.categories.map((c) => c.id),
  ]
  if (ids.length === 0) {
    console.log("• No existing catalog objects to delete.")
    return
  }
  console.log(`• Deleting ${ids.length} existing catalog objects…`)
  await withSquare("catalog.batchDelete", () =>
    client.catalog.batchDelete({ objectIds: ids }),
  )
}

const cents = (n: number) => BigInt(Math.round(n * 100))

const categories = [
  { ref: "#cat_tortas", name: "Tortas Express" },
  { ref: "#cat_pasteles", name: "Pasteles" },
  { ref: "#cat_bebidas", name: "Bebidas" },
  { ref: "#cat_empanadas", name: "Empanadas" },
] as const

type SeedItem = {
  ref: string
  name: string
  description: string
  categoryRef: (typeof categories)[number]["ref"]
  variations: { ref: string; name: string; price: number }[]
}

const items: SeedItem[] = [
  {
    ref: "#item_torta_chocolate",
    name: "Torta de Chocolate Premium",
    description: "Bizcocho de chocolate belga con ganache y frutos rojos.",
    categoryRef: "#cat_tortas",
    variations: [
      { ref: "#var_torta_choco_8", name: "8 personas", price: 35.0 },
      { ref: "#var_torta_choco_12", name: "12 personas", price: 52.0 },
    ],
  },
  {
    ref: "#item_charlotte",
    name: "Charlotte de Frutos Rojos",
    description: "Mousse de yogurt y frutos rojos sobre soletilla artesanal.",
    categoryRef: "#cat_tortas",
    variations: [
      { ref: "#var_charlotte_8", name: "8 personas", price: 42.0 },
    ],
  },
  {
    ref: "#item_alfajor",
    name: "Alfajor de Maicena",
    description: "Galletitas de maicena rellenas de dulce de leche y coco.",
    categoryRef: "#cat_pasteles",
    variations: [
      { ref: "#var_alfajor_unidad", name: "Unidad", price: 2.5 },
      { ref: "#var_alfajor_caja_6", name: "Caja x6", price: 13.5 },
    ],
  },
  {
    ref: "#item_cafe_latte",
    name: "Café Latte",
    description: "Espresso doble con leche vaporizada y arte latte.",
    categoryRef: "#cat_bebidas",
    variations: [
      { ref: "#var_latte_12", name: "12oz", price: 4.5 },
      { ref: "#var_latte_16", name: "16oz", price: 5.5 },
    ],
  },
  {
    ref: "#item_empanada_carne",
    name: "Empanada de Carne",
    description: "Carne cortada a cuchillo, cebolla, huevo y aceitunas.",
    categoryRef: "#cat_empanadas",
    variations: [
      { ref: "#var_empanada_unidad", name: "Unidad", price: 3.5 },
      { ref: "#var_empanada_docena", name: "Docena", price: 38.0 },
    ],
  },
]

function buildBatch(): CatalogObject[] {
  const objects: CatalogObject[] = []

  for (const c of categories) {
    objects.push({
      type: "CATEGORY",
      id: c.ref,
      categoryData: { name: c.name },
    } as CatalogObject)
  }

  for (const item of items) {
    objects.push({
      type: "ITEM",
      id: item.ref,
      itemData: {
        name: item.name,
        description: item.description,
        categories: [{ id: item.categoryRef }],
        variations: item.variations.map((v) => ({
          type: "ITEM_VARIATION",
          id: v.ref,
          itemVariationData: {
            itemId: item.ref,
            name: v.name,
            pricingType: "FIXED_PRICING",
            priceMoney: { amount: cents(v.price), currency: "USD" },
          },
        })) as CatalogObject[],
      },
    } as CatalogObject)
  }

  return objects
}

async function seed() {
  const objects = buildBatch()
  console.log(`• Upserting ${objects.length} catalog objects (${categories.length} categories, ${items.length} items)…`)
  const resp = await withSquare("catalog.batchUpsert", () =>
    client.catalog.batchUpsert({
      idempotencyKey: randomUUID(),
      batches: [{ objects }],
    }),
  )
  const created = resp.idMappings?.length ?? 0
  console.log(`✓ Square confirmed ${created} server IDs.`)
}

async function main() {
  console.log("→ Seeding Square sandbox…")
  await reset()
  await seed()

  console.log("\n→ Re-fetching catalog to verify…")
  const snapshot = await fetchCatalog()
  console.log(`✓ ${snapshot.products.length} products, ${snapshot.categories.length} categories`)
  console.log("\nSample:")
  for (const p of snapshot.products.slice(0, 3)) {
    console.log(
      `  ${p.name} [${p.slug}] — ${p.variations.length} var(s), base $${p.basePrice?.amount ?? "?"}`,
    )
  }
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err)
  process.exit(1)
})
