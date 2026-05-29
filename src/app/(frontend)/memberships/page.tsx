import type { Metadata } from "next"
import Link from "next/link"
import { Check, Sparkles } from "lucide-react"
import { Breadcrumb } from "@/components/shop/breadcrumb"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Memberships",
  description:
    "Join the Delicatessen by Janis membership — monthly cakes, members-only flavors, and event perks.",
  alternates: { canonical: "/memberships" },
  openGraph: {
    title: "Memberships | Delicatessen by Janis",
    description:
      "Join the Delicatessen by Janis membership — monthly cakes, members-only flavors, and event perks.",
    type: "website",
    url: "/memberships",
  },
  twitter: {
    card: "summary_large_image",
    title: "Memberships | Delicatessen by Janis",
    description:
      "Join the Delicatessen by Janis membership — monthly cakes, members-only flavors, and event perks.",
  },
}

type Tier = {
  name: string
  tagline: string
  price: string
  cadence: string
  perks: string[]
  highlight?: boolean
}

// TODO (Fase 3): replace with Square subscription plans + checkout.
const tiers: Tier[] = [
  {
    name: "Friend",
    tagline: "A monthly sweet hello.",
    price: "$25",
    cadence: "per month",
    perks: [
      "One pastry box per month",
      "10% off in-store purchases",
      "Members-only newsletter",
    ],
  },
  {
    name: "Insider",
    tagline: "Cake nights and surprise drops.",
    price: "$60",
    cadence: "per month",
    highlight: true,
    perks: [
      "Everything in Friend",
      "One signature cake per month",
      "Early access to seasonal launches",
      "Invitation to quarterly tasting evenings",
    ],
  },
  {
    name: "Connoisseur",
    tagline: "Reserve the kitchen.",
    price: "$160",
    cadence: "per month",
    perks: [
      "Everything in Insider",
      "Custom monthly cake (your design)",
      "Private tasting for two, twice a year",
      "Concierge ordering for events",
    ],
  },
]

export default function MembershipsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Memberships", path: "/memberships" },
        ]}
      />

      <div className="bg-sugar-100 py-10 sm:py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ name: "Home", href: "/" }, { name: "Memberships" }]}
          />
        </div>
      </div>

      {/* Hero */}
      <section
        aria-labelledby="memberships-heading"
        className="relative overflow-hidden bg-sugar-100 pb-16 pt-4 sm:pb-20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-0 h-[28rem] w-[28rem] rounded-full bg-blush-200/30 blur-3xl"
        />
        <div className="relative mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
            <span className="h-px w-6 bg-brass-500" aria-hidden />
            Memberships
            <span className="h-px w-6 bg-brass-500" aria-hidden />
          </p>
          <h1
            id="memberships-heading"
            className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-ink-900 sm:text-5xl md:text-6xl"
          >
            A standing reservation
            <span className="italic text-ink-800"> for sweet things.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Members get first dibs on seasonal cakes, exclusive flavors, and
            invitations to private tastings. Pause or cancel anytime.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section
        aria-labelledby="tiers-heading"
        className="bg-blush-100 py-20 sm:py-24"
      >
        <h2 id="tiers-heading" className="sr-only">
          Membership tiers
        </h2>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <ul className="grid gap-6 lg:grid-cols-3">
            {tiers.map((t) => (
              <li
                key={t.name}
                className={cn(
                  "relative flex flex-col rounded-3xl bg-card p-8 ring-1 shadow-sm transition",
                  t.highlight
                    ? "ring-2 ring-brass-500 shadow-[0_25px_60px_-25px_rgba(33,33,33,0.45)] lg:-translate-y-2"
                    : "ring-blush-200/60 hover:ring-brass-500/60",
                )}
              >
                {t.highlight ? (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-ink-900 px-3.5 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-brass-500 shadow-md">
                    <Sparkles className="h-3 w-3" aria-hidden />
                    Most loved
                  </span>
                ) : null}

                <p className="font-display text-2xl text-ink-900">{t.name}</p>
                <p className="mt-1 text-sm italic text-muted-foreground">
                  {t.tagline}
                </p>

                <div className="mt-6 flex items-baseline gap-2 border-y border-brass-500/25 py-5">
                  <span className="font-display text-4xl text-ink-900">
                    {t.price}
                  </span>
                  <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {t.cadence}
                  </span>
                </div>

                <ul className="mt-6 flex-1 space-y-3 text-sm text-ink-800">
                  {t.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-brass-600"
                        aria-hidden
                      />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button
                    asChild
                    size="lg"
                    variant={t.highlight ? "primary" : "outline"}
                    className="w-full"
                  >
                    <Link href={`/contact?subject=Membership%20-%20${t.name}`}>
                      Join {t.name}
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-center text-xs text-muted-foreground">
            Memberships will be billed monthly. Pause or cancel anytime — no
            contracts, no surprise fees.
          </p>
        </div>
      </section>
    </>
  )
}
