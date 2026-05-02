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
  // TODO: replace with real address once confirmed.
  address: {
    streetAddress: "International Mall",
    addressLocality: "Tampa",
    addressRegion: "FL",
    addressCountry: "US",
  },
} as const

export type SiteConfig = typeof siteConfig
