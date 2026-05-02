import Link from "next/link"
import { Button } from "@/components/ui/button"

const stats = [
  { value: "10+", label: "Years baking" },
  { value: "30", label: "Daily creations" },
  { value: "100%", label: "Hand-picked" },
]

export function AboutJanis() {
  return (
    <section
      aria-labelledby="about-janis-heading"
      className="relative overflow-hidden bg-blush-100 py-20 sm:py-24"
    >
      {/* Decorative blush wash on the right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-blush-200/40 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-2 md:items-center md:gap-16 lg:px-8">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
            <span className="h-px w-6 bg-brass-500" aria-hidden />
            About Janis
          </p>
          <h2
            id="about-janis-heading"
            className="font-display text-3xl leading-[1.05] tracking-tight text-ink-900 sm:text-4xl md:text-5xl"
          >
            A pastry shop with a
            <span className="italic text-ink-800"> name of its own.</span>
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            {/* TODO: real copy from Janis pending — story, years in the trade, philosophy. */}
            After years baking at home for family and friends, Janis opened
            Delicatessen to share those flavors with everyone. Every cake,
            pastry, and cup of coffee is made with the same care as on day one.
          </p>

          {/* Signature line — italic display, French boutique flourish */}
          <p className="font-display text-lg italic text-ink-800/90">
            &ldquo;The secret ingredient is love.&rdquo;
            <span className="ml-2 text-brass-600">— Janis</span>
          </p>

          {/* Stats trio */}
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

          <div className="pt-1">
            <Button asChild variant="outline" size="md">
              <Link href="/about">Learn more</Link>
            </Button>
          </div>
        </div>

        {/* Photo placeholder with brass corner accents */}
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

            {/* Brass corner accents — gilded mirror cue */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-3 top-3 h-4 w-4 rounded-tl-md border-l border-t border-brass-500"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute right-3 top-3 h-4 w-4 rounded-tr-md border-r border-t border-brass-500"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute left-3 bottom-3 h-4 w-4 rounded-bl-md border-l border-b border-brass-500"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute right-3 bottom-3 h-4 w-4 rounded-br-md border-r border-b border-brass-500"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
