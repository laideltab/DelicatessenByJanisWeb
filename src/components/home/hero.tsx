import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { asMedia } from "@/lib/square/product-overrides"
import type { Banner } from "@/lib/payload/content"

export function Hero({ banner }: { banner?: Banner | null }) {
  const bannerImage = asMedia(banner?.image)
  const ctaText = banner?.cta?.text?.trim()
  const ctaUrl = banner?.cta?.url?.trim()

  return (
    <section
      aria-labelledby="hero-heading"
      className="hero-glow relative overflow-hidden"
    >
      {/* Awning stripes — April Blush + Strawberry Sorbet, storefront motif */}
      <div
        aria-hidden
        className="h-8 w-full md:h-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--color-blush-100) 0 96px, var(--color-blush-200) 96px 192px)",
        }}
      />

      {/* Decorative pink halo behind the video — adds depth & warmth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-24 hidden h-[34rem] w-[34rem] rounded-full bg-blush-200/40 blur-3xl md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-[22rem] w-[22rem] rounded-full bg-blush-100/70 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-12 md:py-24 lg:gap-16 lg:px-8 lg:py-28">
        {/* Left: eyebrow + tagline + CTAs */}
        <div className="flex flex-col items-start gap-7 text-left md:gap-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-brass-500/60 bg-card/70 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.32em] text-ink-800 shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brass-500" />
            Est. — Doral, FL
          </span>

          {banner ? (
            <h1
              id="hero-heading"
              className="font-display text-[2.6rem] leading-[1.02] tracking-tight text-ink-900 sm:text-[3.4rem] md:text-[4rem] lg:text-[4.6rem]"
            >
              {banner.title}
            </h1>
          ) : (
            <h1
              id="hero-heading"
              className="font-display leading-[1.02] tracking-tight text-ink-900"
            >
              <span className="block text-[2.6rem] sm:text-[3.4rem] md:text-[4rem] lg:text-[4.6rem]">
                The Secret
              </span>
              <span className="mt-1 block text-[2.6rem] italic text-ink-800 sm:text-[3.4rem] md:text-[4rem] lg:text-[4.6rem]">
                Ingredient
                <span
                  aria-hidden
                  className="mx-3 align-middle text-brass-500"
                >
                  ✺
                </span>
                <span className="not-italic font-display font-light text-ink-900">
                  is Love
                </span>
              </span>
            </h1>
          )}

          <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            {banner?.subtitle ||
              "Artisan cakes, coffee, and delicatessen — baked every morning by Janis with ingredients she selects herself."}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href={ctaUrl || "/shop"}>
                {ctaText || "Shop now"}
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/menu">View menu</Link>
            </Button>
          </div>

          {/* Trust strip — small social proof under CTAs */}
          <ul
            aria-label="What we stand for"
            className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs uppercase tracking-[0.22em] text-ink-700"
          >
            <li className="inline-flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-brass-500" />
              Baked fresh daily
            </li>
            <li className="inline-flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-brass-500" />
              Family-owned
            </li>
            <li className="inline-flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-brass-500" />
              Hand-picked ingredients
            </li>
          </ul>
        </div>

        {/* Right: vertical 9:16 video with floating chips */}
        <div className="relative mx-auto w-full md:justify-self-end">
          {/* Frame ornament — soft brass gradient ring */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brass-500/35 via-blush-200/30 to-transparent blur-md"
          />

          <div className="relative mx-auto aspect-[9/16] w-full max-w-[20rem] overflow-hidden rounded-2xl bg-blush-100 shadow-[0_30px_80px_-30px_rgba(33,33,33,0.45)] ring-1 ring-brass-500/40 sm:max-w-[22rem] md:max-w-[24rem] lg:max-w-[26rem]">
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

            {bannerImage?.url ? (
              <Image
                src={bannerImage.url}
                alt={bannerImage.alt || banner?.title || ""}
                fill
                priority
                sizes="(min-width: 768px) 26rem, 100vw"
                className="relative object-cover"
              />
            ) : (
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
            )}

            {/* Vignette + brass inset border on top of video */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-ink-900/10"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/35 via-transparent to-transparent"
            />
          </div>
        </div>
      </div>

      {/* Strawberry Sorbet hairline — French detail */}
      <div
        aria-hidden
        className="relative mx-auto h-px w-32 bg-gradient-to-r from-transparent via-brass-500/70 to-transparent"
      />
    </section>
  )
}
