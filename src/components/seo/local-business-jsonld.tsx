/**
 * Schema.org Bakery + LocalBusiness JSON-LD for the homepage.
 * TODO: replace address, geo, telephone, openingHours with real data before prod.
 */
export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: "Delicatessen by Janis",
    description:
      "Artisan cakes, coffee, and delicatessen baked every morning by Janis.",
    url: "https://www.delicatessenbyjanis.com",
    image: "https://www.delicatessenbyjanis.com/brand/logo.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "International Mall",
      addressLocality: "Tampa",
      addressRegion: "FL",
      addressCountry: "US",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "09:00",
        closes: "17:00",
      },
    ],
    sameAs: [
      "https://instagram.com/delicatessenbyjanis",
      "https://facebook.com/delicatessenbyjanis",
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
