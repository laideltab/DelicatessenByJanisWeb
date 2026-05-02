import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-sugar-100"
    >
      {/* Awning stripes — April Blush + white, storefront motif */}
      <div
        aria-hidden
        className="h-8 w-full md:h-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--color-blush-100) 0 96px, #ffffff 96px 192px)",
        }}
      />

      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-2 md:items-center md:gap-12 md:py-24 lg:gap-16 lg:px-8 lg:py-28">
        {/* Left: tagline + CTAs (logo lives in the sticky header) */}
        <div className="flex flex-col items-start gap-6 text-left md:gap-8">
          <h1
            id="hero-heading"
            className="font-display text-4xl italic leading-tight text-ink-800 sm:text-5xl md:text-[3.5rem] lg:text-6xl"
          >
            The Secret Ingredient is Love
          </h1>

          <p className="max-w-md text-base text-muted-foreground sm:text-lg">
            Artisan cakes, coffee, and delicatessen — baked every morning by
            Janis with ingredients she selects herself.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/shop">
                Shop now
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/menu">View menu</Link>
            </Button>
          </div>
        </div>

        {/* Right: vertical 9:16 video */}
        <div className="mx-auto w-full md:justify-self-end">
          <div className="relative mx-auto aspect-[9/16] w-full max-w-[20rem] overflow-hidden rounded-2xl bg-blush-100 shadow-xl ring-1 ring-blush-200 sm:max-w-[22rem] md:max-w-[24rem] lg:max-w-[26rem]">
            {/* Stripe placeholder — visible mientras no haya video o si falla */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, var(--color-blush-200) 0 64px, #ffffff 64px 128px)",
                opacity: 0.55,
              }}
            />

            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="/video/hero-poster.jpg"
              className="relative h-full w-full object-cover motion-reduce:hidden"
            >
              <source src="/video/hero.mp4" type="video/mp4" />
            </video>

            {/* Subtle inset border on top of video */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-ink-800/5"
            />
          </div>
        </div>
      </div>

      {/* Strawberry Sorbet hairline — French detail */}
      <div
        aria-hidden
        className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-blush-200 to-transparent"
      />
    </section>
  )
}
