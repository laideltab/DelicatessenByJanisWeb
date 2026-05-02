import { getSquareClient, getLocationId, isSquareConfigured } from "./client"
import { withSquare } from "./errors"
import { fetchCatalog } from "./catalog"

export type SquareStatus = {
  configured: boolean
  environment: "production" | "sandbox"
  location: {
    id: string
    name: string | null
    status: string | null
    currency: string | null
    country: string | null
    timezone: string | null
  } | null
  catalog: {
    productCount: number
    categoryCount: number
    sample: Array<{
      id: string
      name: string
      slug: string
      basePrice: { amount: number; currency: string } | null
      imageCount: number
      variations: number
    }>
  }
}

export async function getSquareStatus(): Promise<SquareStatus> {
  const configured = isSquareConfigured()
  const environment: SquareStatus["environment"] =
    process.env.SQUARE_ENVIRONMENT === "production" ||
    (process.env.NODE_ENV === "production" &&
      process.env.SQUARE_ENVIRONMENT !== "sandbox")
      ? "production"
      : "sandbox"

  if (!configured) {
    return {
      configured: false,
      environment,
      location: null,
      catalog: { productCount: 0, categoryCount: 0, sample: [] },
    }
  }

  const client = getSquareClient()
  const locationId = getLocationId()

  const locationResp = await withSquare("locations.get", () =>
    client.locations.get({ locationId }),
  )
  const loc = locationResp.location ?? null

  const { products, categories } = await fetchCatalog()

  return {
    configured: true,
    environment,
    location: loc
      ? {
          id: loc.id ?? locationId,
          name: loc.name ?? null,
          status: loc.status ?? null,
          currency: loc.currency ?? null,
          country: loc.country ?? null,
          timezone: loc.timezone ?? null,
        }
      : null,
    catalog: {
      productCount: products.length,
      categoryCount: categories.length,
      sample: products.slice(0, 3).map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        basePrice: p.basePrice,
        imageCount: p.imageUrls.length,
        variations: p.variations.length,
      })),
    },
  }
}
