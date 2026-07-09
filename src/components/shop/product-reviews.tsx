import { Star } from "lucide-react"
import type { ProductReview } from "@/lib/payload/content"
import { ReviewForm } from "./review-form"

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5"
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
            i < Math.round(rating)
              ? `${cls} fill-brass-500 text-brass-500`
              : `${cls} text-brass-500/30`
          }
        />
      ))}
    </div>
  )
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
})

/**
 * Reviews block for a product page: approved reviews with their average,
 * plus the submission form. Renders the form alone when there are no
 * reviews yet.
 */
export function ProductReviews({
  reviews,
  squareItemId,
  productName,
}: {
  reviews: ProductReview[]
  squareItemId: string
  productName: string
}) {
  const count = reviews.length
  const average =
    count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0

  return (
    <section
      aria-labelledby="reviews-heading"
      className="border-t border-blush-100 bg-sugar-100 py-16 sm:py-20"
    >
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-ink-800">
            Reviews
          </p>
          <h2
            id="reviews-heading"
            className="mt-3 font-display text-3xl leading-tight text-ink-900 sm:text-4xl"
          >
            {count > 0 ? "What people are saying" : "Tasted this one?"}
          </h2>

          {count > 0 ? (
            <div className="mt-4 flex items-center justify-center gap-3">
              <Stars rating={average} size="lg" />
              <p className="text-sm text-muted-foreground">
                {average.toFixed(1)} · {count}{" "}
                {count === 1 ? "review" : "reviews"}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-base text-muted-foreground">
              Be the first to review it.
            </p>
          )}
        </div>

        {count > 0 ? (
          <ul className="mt-10 space-y-4">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl bg-card p-6 ring-1 ring-brass-500/25"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-100 font-display text-sm italic text-ink-800 ring-1 ring-brass-500/40"
                    >
                      {r.name.charAt(0)}
                    </span>
                    <p className="font-display text-base text-ink-900">
                      {r.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Stars rating={r.rating} />
                    {r.createdAt ? (
                      <time
                        dateTime={r.createdAt}
                        className="text-xs text-muted-foreground"
                      >
                        {dateFormat.format(new Date(r.createdAt))}
                      </time>
                    ) : null}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {r.message}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-12 rounded-2xl bg-card p-7 ring-1 ring-blush-200/60 sm:p-8">
          <h3 className="font-display text-xl text-ink-900">Write a review</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Reviews are published after a quick check by our team.
          </p>
          <div className="mt-6">
            <ReviewForm squareItemId={squareItemId} productName={productName} />
          </div>
        </div>
      </div>
    </section>
  )
}
