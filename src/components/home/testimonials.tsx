import Image from "next/image"
import { Star } from "lucide-react"
import { asMedia } from "@/lib/square/product-overrides"
import type { Testimonial } from "@/lib/payload/content"

function Stars({ rating }: { rating: number }) {
  return (
    <div
      aria-label={`${rating} out of 5 stars`}
      role="img"
      className="flex items-center gap-0.5"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className={
            i < rating
              ? "h-3.5 w-3.5 fill-brass-500 text-brass-500"
              : "h-3.5 w-3.5 text-brass-500/30"
          }
        />
      ))}
    </div>
  )
}

export function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  if (testimonials.length === 0) return null

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden bg-sugar-100 py-20 sm:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-[24rem] w-[24rem] rounded-full bg-blush-100/70 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
            <span className="h-px w-6 bg-brass-500" aria-hidden />
            Kind Words
          </p>
          <h2
            id="testimonials-heading"
            className="mt-3 font-display text-3xl leading-[1.05] tracking-tight text-ink-900 sm:text-4xl md:text-5xl"
          >
            What our customers
            <span className="italic text-ink-800"> are saying.</span>
          </h2>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => {
            const photo = asMedia(t.photo)
            return (
              <li
                key={t.id}
                className="flex h-full flex-col justify-between gap-6 rounded-2xl bg-card p-6 shadow-[0_15px_45px_-25px_rgba(33,33,33,0.35)] ring-1 ring-brass-500/25"
              >
                <div className="space-y-4">
                  <Stars rating={Number(t.rating) || 5} />
                  <blockquote className="text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.message}&rdquo;
                  </blockquote>
                </div>
                <div className="flex items-center gap-3">
                  {photo?.url ? (
                    <span className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-brass-500/40">
                      <Image
                        src={photo.url}
                        alt={photo.alt || t.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-100 font-display text-base italic text-ink-800 ring-1 ring-brass-500/40"
                    >
                      {t.name.charAt(0)}
                    </span>
                  )}
                  <cite className="font-display text-base not-italic text-ink-900">
                    {t.name}
                  </cite>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
