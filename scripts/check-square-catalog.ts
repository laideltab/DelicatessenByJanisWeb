/**
 * Read-only audit of a Square catalog. Connects with whatever credentials
 * are in the loaded env file and prints categories, products, prices,
 * variations, image counts, and stock — without mutating anything.
 *
 * Usage:
 *   npm run check:catalog
 *
 * That command runs this script with `--env-file=.env.production.local`,
 * so you can keep `.env.local` pointing at sandbox for daily dev and put
 * production-only credentials in `.env.production.local`. Required vars:
 *
 *   SQUARE_ENVIRONMENT=production
 *   SQUARE_ACCESS_TOKEN=EAAAEx…
 *   SQUARE_LOCATION_ID=L…
 *
 * Or run it ad-hoc with inline env:
 *   SQUARE_ENVIRONMENT=production \
 *   SQUARE_ACCESS_TOKEN=… \
 *   SQUARE_LOCATION_ID=… \
 *   npx tsx scripts/check-square-catalog.ts
 */
import { getSquareClient, getLocationId, isSquareConfigured } from "../src/lib/square/client"
import { withSquare } from "../src/lib/square/errors"
import { fetchCatalog } from "../src/lib/square/catalog"

const RESET = "\x1b[0m"
const DIM = "\x1b[2m"
const BOLD = "\x1b[1m"
const GREEN = "\x1b[32m"
const RED = "\x1b[31m"
const YELLOW = "\x1b[33m"
const CYAN = "\x1b[36m"

async function main() {
  if (!isSquareConfigured()) {
    console.error(
      `${RED}✘ Missing Square credentials.${RESET}\n` +
        `   Set SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID in .env.production.local\n` +
        `   (or pass them inline). See the comment at the top of this script.`,
    )
    process.exit(1)
  }

  const env = process.env.SQUARE_ENVIRONMENT ?? "sandbox"
  if (env !== "production") {
    console.warn(
      `${YELLOW}⚠ SQUARE_ENVIRONMENT="${env}" — this script is meant for production checks.${RESET}\n` +
        `   It will still run, but you'll see sandbox data.\n`,
    )
  }

  const client = getSquareClient()
  const locationId = getLocationId()

  // Confirm location first so we fail fast with a clear error before reading the whole catalog.
  const locResp = await withSquare("locations.get", () =>
    client.locations.get({ locationId }),
  )
  const loc = locResp.location

  console.log(`${BOLD}${CYAN}● Square Catalog Audit${RESET}`)
  console.log(
    `  ${DIM}env:${RESET} ${env === "production" ? `${GREEN}production${RESET}` : `${YELLOW}${env}${RESET}`}` +
      `  ${DIM}location:${RESET} ${loc?.name ?? "(unnamed)"} (${loc?.id ?? locationId})` +
      `  ${DIM}status:${RESET} ${loc?.status ?? "—"}`,
  )
  console.log()

  const { products, categories } = await fetchCatalog()

  console.log(
    `${BOLD}Categories (${categories.length})${RESET}`,
  )
  if (categories.length === 0) {
    console.log(`  ${DIM}none${RESET}`)
  } else {
    const productsByCat = new Map<string, number>()
    for (const c of categories) productsByCat.set(c.id, 0)
    for (const p of products) {
      for (const cid of p.categoryIds) {
        if (productsByCat.has(cid)) {
          productsByCat.set(cid, (productsByCat.get(cid) ?? 0) + 1)
        }
      }
    }
    for (const c of categories) {
      const n = productsByCat.get(c.id) ?? 0
      console.log(
        `  • ${BOLD}${c.name}${RESET} ${DIM}(slug: ${c.slug})${RESET}  ${CYAN}${n}${RESET} products`,
      )
    }
  }
  console.log()

  console.log(`${BOLD}Products (${products.length})${RESET}`)
  if (products.length === 0) {
    console.log(`  ${DIM}none${RESET}`)
  } else {
    let outOfStock = 0
    for (const p of products) {
      if (!p.inStock) outOfStock += 1
      const price = p.basePrice
        ? `${p.basePrice.currency} ${p.basePrice.amount.toFixed(2)}`
        : `${DIM}no price${RESET}`
      const stockBadge = p.inStock
        ? `${GREEN}●${RESET}`
        : `${RED}●${RESET}`
      console.log(
        `  ${stockBadge} ${BOLD}${p.name}${RESET} ${DIM}(${p.slug})${RESET}\n` +
          `      ${DIM}price:${RESET} ${price}` +
          `  ${DIM}variations:${RESET} ${p.variations.length}` +
          `  ${DIM}images:${RESET} ${p.imageUrls.length}`,
      )
    }
    console.log()
    console.log(
      `  ${BOLD}Summary${RESET}: ${GREEN}${products.length - outOfStock} in stock${RESET}` +
        `, ${outOfStock > 0 ? RED : DIM}${outOfStock} out of stock${RESET}`,
    )
  }

  console.log(`\n${DIM}Done — no data was modified.${RESET}`)
}

main().catch((err) => {
  console.error(`${RED}✘ Audit failed:${RESET}`)
  console.error(err)
  process.exit(1)
})
