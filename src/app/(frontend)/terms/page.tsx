import type { Metadata } from "next"
import { Breadcrumb } from "@/components/shop/breadcrumb"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Terms & Policies",
  description:
    "Terms of service, privacy policy, shipping, and return policies for Delicatessen by Janis.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
}

const sections = [
  { id: "terms", label: "Terms" },
  { id: "privacy", label: "Privacy" },
  { id: "shipping", label: "Shipping" },
  { id: "returns", label: "Returns" },
]

const lastUpdated = "May 2, 2026"

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Terms & Policies", path: "/terms" },
        ]}
      />

      <div className="bg-sugar-100 py-10 sm:py-12">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ name: "Home", href: "/" }, { name: "Terms & Policies" }]}
          />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-sugar-100 pb-12 pt-2 sm:pb-16">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
            <span className="h-px w-6 bg-brass-500" aria-hidden />
            Terms &amp; Policies
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-ink-900 sm:text-5xl">
            The fine print,
            <span className="italic text-ink-800"> in plain English.</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {lastUpdated}.
          </p>

          <nav
            aria-label="Sections"
            className="mt-8 flex flex-wrap gap-2 text-xs"
          >
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-full border border-blush-200 bg-card px-3.5 py-1.5 font-medium uppercase tracking-[0.22em] text-ink-800 transition hover:border-brass-500 hover:bg-blush-100"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <article className="mx-auto w-full max-w-4xl space-y-16 px-4 pb-24 sm:px-6 lg:px-8">
        {/* Terms */}
        <section id="terms" className="scroll-mt-24">
          <h2 className="font-display text-3xl leading-[1.05] tracking-tight text-ink-900 sm:text-4xl">
            <span className="italic text-ink-800">Terms</span> of service
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-700">
            {/* TODO: replace placeholder with Janis-approved legal copy before launch. */}
            <p>
              By placing an order on this site or in the shop, you agree to
              these terms. {siteConfig.name} reserves the right to refuse
              service, decline orders that we cannot fulfill on the requested
              date, or modify pricing for items mispriced by error.
            </p>
            <p>
              All cakes and pastries are produced in a kitchen that handles
              wheat, dairy, eggs, and tree nuts. We do our best to accommodate
              dietary restrictions on advance notice but cannot guarantee a
              fully allergen-free environment.
            </p>
            <p>
              Special orders require at least 5 calendar days&rsquo; notice and
              a 50% deposit at the time of design approval. Final balance is
              due at pickup.
            </p>
          </div>
        </section>

        {/* Privacy */}
        <section id="privacy" className="scroll-mt-24">
          <h2 className="font-display text-3xl leading-[1.05] tracking-tight text-ink-900 sm:text-4xl">
            <span className="italic text-ink-800">Privacy</span> policy
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-700">
            <p>
              We collect the minimum information needed to fulfill your order:
              name, email, phone, and delivery address (when applicable).
              Payment is processed by Square — we never see your full card
              number.
            </p>
            <p>
              We use cookies and basic analytics to understand which pages are
              useful and to keep your cart populated between visits. We do not
              sell or share personal information with third parties for
              advertising.
            </p>
            <p>
              You can request a copy of your data, or ask us to delete it
              entirely, by emailing{" "}
              <a
                href="mailto:hello@delicatessenbyjanis.com"
                className="font-medium text-ink-800 underline-offset-4 hover:underline"
              >
                hello@delicatessenbyjanis.com
              </a>
              .
            </p>
          </div>
        </section>

        {/* Shipping */}
        <section id="shipping" className="scroll-mt-24">
          <h2 className="font-display text-3xl leading-[1.05] tracking-tight text-ink-900 sm:text-4xl">
            <span className="italic text-ink-800">Shipping</span> &amp; pickup
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-700">
            <p>
              Orders are available for pickup at our shop in Miami International
              Mall, {siteConfig.address.streetAddress},{" "}
              {siteConfig.address.addressLocality},{" "}
              {siteConfig.address.addressRegion}{" "}
              {siteConfig.address.postalCode}.
            </p>
            <p>
              Local delivery is available within Doral and the Miami metro
              area for an additional fee, calculated at checkout based on
              distance. We do not currently ship cakes outside of South
              Florida — fresh-baked goods don&rsquo;t travel well, and we
              don&rsquo;t cut corners on freshness.
            </p>
          </div>
        </section>

        {/* Returns */}
        <section id="returns" className="scroll-mt-24">
          <h2 className="font-display text-3xl leading-[1.05] tracking-tight text-ink-900 sm:text-4xl">
            <span className="italic text-ink-800">Returns</span> &amp; refunds
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-700">
            <p>
              Because everything is baked to order with perishable ingredients,
              we cannot accept returns. If something is wrong with your order
              — wrong item, damaged in transit, or quality issue — please
              reach out within 24 hours and we&rsquo;ll make it right with a
              refund or replacement.
            </p>
            <p>
              Special-order deposits are refundable up to 7 days before the
              event date. Cancellations within 7 days forfeit the deposit, as
              the kitchen has likely already begun prep.
            </p>
          </div>
        </section>

        <div className="rounded-2xl bg-blush-100 p-6 text-sm text-ink-800 sm:p-8">
          <p className="font-medium">Questions about any of this?</p>
          <p className="mt-1 text-muted-foreground">
            Email{" "}
            <a
              href="mailto:hello@delicatessenbyjanis.com"
              className="font-medium text-ink-800 underline-offset-4 hover:underline"
            >
              hello@delicatessenbyjanis.com
            </a>{" "}
            or visit us at the shop.
          </p>
        </div>
      </article>
    </>
  )
}
