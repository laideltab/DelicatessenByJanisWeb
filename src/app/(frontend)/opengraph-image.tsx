import { ImageResponse } from "next/og"
import { siteConfig } from "@/lib/site-config"

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const blush100 = "#f6d0d8"
const blush200 = "#f4becf"
const sugar100 = "#f4f2ec"
const ink900 = "#0a0a0a"
const ink800 = "#212121"
const brass500 = "#c9a063"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(135deg, ${sugar100} 0%, ${blush100} 100%)`,
          padding: 80,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 36,
            backgroundImage: `repeating-linear-gradient(90deg, ${blush100} 0 96px, ${blush200} 96px 192px)`,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: ink800,
            marginTop: 40,
          }}
        >
          <span
            style={{
              display: "flex",
              width: 40,
              height: 1,
              background: brass500,
            }}
          />
          Doral, FL
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: 128,
              lineHeight: 1.02,
              color: ink900,
              fontWeight: 400,
              letterSpacing: -2,
              display: "flex",
            }}
          >
            Delicatessen
          </div>
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.05,
              color: ink800,
              fontStyle: "italic",
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            by Janis
            <span
              style={{
                display: "flex",
                width: 18,
                height: 18,
                background: brass500,
                transform: "rotate(45deg)",
              }}
            />
            <span style={{ color: ink900, fontStyle: "normal", fontWeight: 300 }}>
              Bakery & Coffee
            </span>
          </div>

          <div
            style={{
              marginTop: 36,
              fontSize: 32,
              color: ink800,
              maxWidth: 880,
              lineHeight: 1.35,
              display: "flex",
            }}
          >
            {siteConfig.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: ink800,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <span style={{ display: "flex" }}>delicatessenbyjanis.com</span>
          <span style={{ display: "flex", color: brass500 }}>
            Baked fresh daily
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
