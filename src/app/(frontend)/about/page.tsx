import type { Metadata } from "next"
import Link from "next/link"
import { Heart, Sparkles, Wheat } from "lucide-react"
import { Breadcrumb } from "@/components/shop/breadcrumb"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About Janis",
  description:
    "The story behind Delicatessen by Janis — a French-inspired bakery in Doral, FL, baked daily by Janis with hand-picked ingredients.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Janis | Delicatessen by Janis",
    description:
      "The story behind Delicatessen by Janis — a French-inspired bakery in Doral, FL.",
    type: "website",
    url: "/about",
  },
}

const values = [
  {
    icon: Heart,
    title: "Made with love",
    body: "Every cake is treated like it&rsquo;s for someone we know — because most of the time, it is.",
  },
  {
    icon: Wheat,
    title: "Real ingredients",
    body: "European butter, fresh fruit, no shortcuts. The label is short on purpose.",
  },
  {
    icon: Sparkles,
    title: "Quiet luxury",
    body: "Vintage French sensibility, modern bakery — refined without being precious.",
  },
]

const stats = [
  { value: "10+", label: "Years baking" },
  { value: "30", label: "Daily creations" },
  { value: "100%", label: "Hand-picked" },
]

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />

      <div className="bg-sugar-100 py-10 sm:py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "About" }]} />
        </div>
      </div>

      {/* Hero */}
      <section
        aria-labelledby="about-heading"
        className="relative overflow-hidden bg-sugar-100 pb-16 pt-4 sm:pb-20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-0 h-[28rem] w-[28rem] rounded-full bg-blush-200/30 blur-3xl"
        />
        <div className="relative mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
            <span className="h-px w-6 bg-brass-500" aria-hidden />
            About Janis
            <span className="h-px w-6 bg-brass-500" aria-hidden />
          </p>
          <h1
            id="about-heading"
            className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-ink-900 sm:text-5xl md:text-6xl"
          >
            A pastry shop with a
            <span className="italic text-ink-800"> name of its own.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Delicatessen by Janis began in a home kitchen and ended up at Miami
            International Mall — without ever losing the feeling of being baked
            for someone in particular.
          </p>
        </div>
      </section>

      {/* Story + signature */}
      <section
        aria-labelledby="story-heading"
        className="relative overflow-hidden bg-blush-100 py-20 sm:py-24"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-blush-200/40 blur-3xl"
        />

        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-2 md:items-center md:gap-16 lg:px-8">
          {/* Photo placeholder with brass corners */}
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-brass-500/30 via-blush-200/30 to-transparent blur-md"
            />
            <div
              aria-hidden
              className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-card shadow-[0_20px_60px_-25px_rgba(33,33,33,0.4)] ring-1 ring-brass-500/40 md:aspect-[5/6]"
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, var(--color-blush-200) 0 64px, #ffffff 64px 128px)",
                  opacity: 0.55,
                }}
              />
              <div className="relative flex h-full w-full items-center justify-center p-8 text-center">
                <span className="font-display text-2xl italic text-ink-800/70">
                  Photo coming soon
                </span>
              </div>

              {(["tl", "tr", "bl", "br"] as const).map((corner) => (
                <span
                  key={corner}
                  aria-hidden
                  className={
                    "pointer-events-none absolute h-4 w-4 border-brass-500 " +
                    {
                      tl: "left-3 top-3 rounded-tl-md border-l border-t",
                      tr: "right-3 top-3 rounded-tr-md border-r border-t",
                      bl: "left-3 bottom-3 rounded-bl-md border-l border-b",
                      br: "right-3 bottom-3 rounded-br-md border-r border-b",
                    }[corner]
                  }
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2
              id="story-heading"
              className="font-display text-3xl leading-[1.05] tracking-tight text-ink-900 sm:text-4xl"
            >
              From <span className="italic text-ink-800">home kitchen</span> to
              storefront.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {/* TODO: real copy from Janis pending — fill in years, training, key milestones. */}
              Janis baked for years before opening to the public — birthdays,
              anniversaries, weekend brunches for the family. Friends started
              ordering, then friends of friends, until the kitchen counter ran
              out of room. Delicatessen is the next chapter: same hands, same
              ingredients, in a space designed to feel like a Parisian patisserie
              transplanted to South Florida.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Everything is baked from scratch in-house each morning. We don&rsquo;t
              freeze, we don&rsquo;t batch ahead, and we don&rsquo;t cut corners on
              what goes inside the cake.
            </p>

            <p className="font-display text-lg italic text-ink-800/90">
              &ldquo;The secret ingredient is love.&rdquo;
              <span className="ml-2 text-brass-600">— Janis</span>
            </p>

            <dl className="grid grid-cols-3 gap-3 border-y border-brass-500/30 py-5">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd className="mt-1 font-display text-2xl text-ink-900 sm:text-3xl">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        aria-labelledby="values-heading"
        className="bg-sugar-100 py-20 sm:py-24"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
              <span className="h-px w-6 bg-brass-500" aria-hidden />
              What we stand for
            </p>
            <h2
              id="values-heading"
              className="mt-4 font-display text-3xl leading-[1.05] tracking-tight text-ink-900 sm:text-4xl md:text-5xl"
            >
              Three things,
              <span className="italic text-ink-800"> non-negotiable.</span>
            </h2>
          </div>
          <ul className="grid gap-5 sm:grid-cols-3">
            {values.map((v) => (
              <li
                key={v.title}
                className="rounded-2xl bg-card p-7 ring-1 ring-blush-200/50 shadow-sm"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-blush-100 text-brass-600">
                  <v.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-2xl text-ink-900">
                  {v.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: v.body }}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-blush-100 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl leading-[1.05] tracking-tight text-ink-900 sm:text-4xl">
            Stop by and <span className="italic">say hi.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Find us at Miami International Mall in Doral. Coffee&rsquo;s ready.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/menu">View menu</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
