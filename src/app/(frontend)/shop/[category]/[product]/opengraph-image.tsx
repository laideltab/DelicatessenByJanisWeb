import { ImageResponse } from "next/og"
import { getCatalogGrouped } from "@/lib/square/queries"
import { formatPrice } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"

export const alt = "Delicatessen by Janis — product"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export const revalidate = 60

const blush100 = "#f6d0d8"
const blush200 = "#f4becf"
const sugar100 = "#f4f2ec"
const ink900 = "#0a0a0a"
const ink800 = "#212121"
const ink700 = "#3a3a3a"
const brass500 = "#c9a063"

type Params = { category: string; product: string }

export default async function Image({
  params,
}: {
  params: Promise<Params>
}) {
  const { category: catSlug, product: prodSlug } = await params
  const { categories, slugToCategory } = await getCatalogGrouped()
  const cat = slugToCategory.get(catSlug)
  const enriched = cat ? categories.find((c) => c.id === cat.id) : null
  const product = enriched?.products.find((p) => p.slug === prodSlug)

  const heroUrl = product?.imageUrls[0]
  const priceLabel = product?.basePrice
    ? `${product.variations.length > 1 ? "From " : ""}${formatPrice(
        product.basePrice.amount,
        product.basePrice.currency,
      )}`
    : null

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: sugar100,
          position: "relative",
        }}
      >
        {/* Awning stripe header */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 32,
            backgroundImage: `repeating-linear-gradient(90deg, ${blush100} 0 96px, ${blush200} 96px 192px)`,
          }}
        />

        {/* Left text column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: heroUrl ? 660 : 1200,
            padding: "84px 64px 56px 80px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 20,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: ink800,
              }}
            >
              <span
                style={{
                  display: "flex",
                  width: 32,
                  height: 1,
                  background: brass500,
                }}
              />
              {cat?.name ?? "Delicatessen by Janis"}
            </div>

            <div
              style={{
                fontSize: product && product.name.length > 28 ? 72 : 92,
                lineHeight: 1.05,
                color: ink900,
                marginTop: 32,
                letterSpacing: -1.5,
                display: "flex",
                fontWeight: 400,
                maxWidth: heroUrl ? 580 : 1040,
              }}
            >
              {product?.name ?? siteConfig.name}
            </div>

            {priceLabel ? (
              <div
                style={{
                  marginTop: 28,
                  fontSize: 44,
                  color: ink800,
                  fontStyle: "italic",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    display: "flex",
                    width: 14,
                    height: 14,
                    background: brass500,
                    transform: "rotate(45deg)",
                  }}
                />
                {priceLabel}
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 20,
              color: ink700,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            <span style={{ display: "flex" }}>delicatessenbyjanis.com</span>
            <span style={{ display: "flex", color: brass500 }}>
              The secret ingredient is love
            </span>
          </div>
        </div>

        {/* Right product image column */}
        {heroUrl ? (
          <div
            style={{
              display: "flex",
              width: 540,
              height: "100%",
              padding: "84px 64px 56px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                borderRadius: 24,
                overflow: "hidden",
                background: blush100,
                border: `1px solid ${brass500}66`,
              }}
            >
              {/* Using <img> here because next/og's <Image> needs absolute fetchable URLs;
                  Square CDN URLs are absolute and load fine. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroUrl}
                alt=""
                width={540}
                height={490}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    ),
    { ...size },
  )
}
