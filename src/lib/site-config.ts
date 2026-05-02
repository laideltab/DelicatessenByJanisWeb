/**
 * Single source of truth for canonical URLs, brand metadata, and contact info
 * referenced by JSON-LD, Open Graph, and links to external systems.
 */
export const siteConfig = {
  name: "Delicatessen by Janis",
  tagline: "The Secret Ingredient is Love",
  description:
    "Artisan cakes, coffee, and delicatessen baked every morning by Janis with hand-selected ingredients.",
  url: "https://www.delicatessenbyjanis.com",
  locale: "en_US",
  social: {
    instagram: "https://instagram.com/delicatessenbyjanis",
    facebook: "https://facebook.com/delicatessenbyjanis",
  },
  address: {
    streetAddress: "1455 NW 107th Ave",
    addressLocality: "Doral",
    addressRegion: "FL",
    postalCode: "33172",
    addressCountry: "US",
  },
} as const

export type SiteConfig = typeof siteConfig
