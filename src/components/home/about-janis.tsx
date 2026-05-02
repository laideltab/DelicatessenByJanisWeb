import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AboutJanis() {
  return (
    <section
      aria-labelledby="about-janis-heading"
      className="bg-blush-100 py-20 sm:py-24"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-2 md:items-center md:gap-16 lg:px-8">
        <div className="space-y-5">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-ink-800">
            About Janis
          </p>
          <h2
            id="about-janis-heading"
            className="font-display text-3xl leading-tight text-ink-900 sm:text-4xl md:text-5xl"
          >
            A pastry shop with a name of its own.
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            {/* TODO: real copy from Janis pending — story, years in the trade, philosophy. */}
            After years baking at home for family and friends, Janis opened
            Delicatessen to share those flavors with everyone. Every cake,
            pastry, and cup of coffee is made with the same care as on day one.
          </p>
          <div className="pt-2">
            <Button asChild variant="outline" size="md">
              <Link href="/about">Learn more</Link>
            </Button>
          </div>
        </div>

        {/* Visual placeholder — to be replaced by a real photo of Janis or the shop */}
        <div
          aria-hidden
          className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-card ring-1 ring-blush-200 md:aspect-[5/6]"
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
        </div>
      </div>
    </section>
  )
}
