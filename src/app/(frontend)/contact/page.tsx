import type { Metadata } from "next"
import { AtSign, Clock, Mail, MapPin, Phone } from "lucide-react"
import { Breadcrumb } from "@/components/shop/breadcrumb"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld"
import { ContactForm } from "@/components/forms/contact-form"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach out to Delicatessen by Janis — questions about cakes, catering, or special orders. Miami International Mall, Doral, FL.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Delicatessen by Janis",
    description: "Reach out to Delicatessen by Janis.",
    type: "website",
    url: "/contact",
  },
}

const hours = [
  { day: "Mon – Sat", time: "10:00 AM – 9:00 PM" },
  { day: "Sunday", time: "11:00 AM – 7:00 PM" },
]

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      <div className="bg-sugar-100 py-10 sm:py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ name: "Home", href: "/" }, { name: "Contact" }]}
          />
        </div>
      </div>

      {/* Hero */}
      <section
        aria-labelledby="contact-heading"
        className="relative overflow-hidden bg-sugar-100 pb-16 pt-4 sm:pb-20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-0 h-[28rem] w-[28rem] rounded-full bg-blush-200/30 blur-3xl"
        />
        <div className="relative mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
            <span className="h-px w-6 bg-brass-500" aria-hidden />
            Contact
            <span className="h-px w-6 bg-brass-500" aria-hidden />
          </p>
          <h1
            id="contact-heading"
            className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-ink-900 sm:text-5xl md:text-6xl"
          >
            Let&rsquo;s <span className="italic text-ink-800">talk cake.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Questions about a cake, catering for an event, or a wholesale order?
            Send us a note — we typically reply within one business day.
          </p>
        </div>
      </section>

      {/* Form + info */}
      <section
        aria-labelledby="contact-form-heading"
        className="bg-blush-100 py-16 sm:py-20"
      >
        <h2 id="contact-form-heading" className="sr-only">
          Contact form and information
        </h2>
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-14 lg:px-8">
          <ContactForm />

          <aside className="space-y-8">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
                <MapPin className="h-4 w-4 text-brass-600" aria-hidden />
                Visit
              </p>
              <address className="mt-3 not-italic text-base text-ink-800">
                Miami International Mall
                <br />
                {siteConfig.address.streetAddress}
                <br />
                {siteConfig.address.addressLocality},{" "}
                {siteConfig.address.addressRegion}{" "}
                {siteConfig.address.postalCode}
              </address>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=1455+NW+107th+Ave,+Doral,+FL+33172"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-[0.22em] text-ink-800 underline-offset-4 hover:underline"
              >
                Get directions →
              </a>
            </div>

            <div>
              <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
                <Clock className="h-4 w-4 text-brass-600" aria-hidden />
                Hours
              </p>
              <ul className="mt-3 space-y-2 text-base">
                {hours.map((h) => (
                  <li
                    key={h.day}
                    className="flex items-baseline justify-between gap-3 border-b border-brass-500/25 pb-2 text-muted-foreground"
                  >
                    <span>{h.day}</span>
                    <span className="font-display text-ink-900">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="mailto:hello@delicatessenbyjanis.com"
                className="group inline-flex items-center gap-3 rounded-xl bg-card p-4 ring-1 ring-blush-200/60 transition hover:ring-brass-500/60"
              >
                <Mail className="h-5 w-5 text-brass-600" aria-hidden />
                <div className="leading-tight">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Email
                  </p>
                  <p className="text-sm font-medium text-ink-800 group-hover:underline">
                    hello@delicatessenbyjanis.com
                  </p>
                </div>
              </a>
              <a
                href="tel:+1"
                className="group inline-flex items-center gap-3 rounded-xl bg-card p-4 ring-1 ring-blush-200/60 transition hover:ring-brass-500/60"
              >
                <Phone className="h-5 w-5 text-brass-600" aria-hidden />
                <div className="leading-tight">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-ink-800 group-hover:underline">
                    {/* TODO: replace with real phone */}
                    Tap to call
                  </p>
                </div>
              </a>
            </div>

            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.22em] text-ink-800 underline-offset-4 hover:underline"
            >
              <AtSign className="h-4 w-4 text-brass-600" aria-hidden />
              @delicatessenbyjanis
            </a>

            {/* Map */}
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-brass-500/30 via-blush-200/30 to-transparent blur-md"
              />
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-card ring-1 ring-brass-500/40 shadow-[0_20px_60px_-25px_rgba(33,33,33,0.4)]">
                <iframe
                  title="Map to Delicatessen by Janis at Miami International Mall"
                  src="https://www.google.com/maps?q=1455+NW+107th+Ave,+Doral,+FL+33172&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-3 z-10 h-4 w-4 rounded-tl-md border-l border-t border-brass-500"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-3 bottom-3 z-10 h-4 w-4 rounded-br-md border-r border-b border-brass-500"
                />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
