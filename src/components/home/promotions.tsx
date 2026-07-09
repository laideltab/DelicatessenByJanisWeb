import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { asMedia } from "@/lib/square/product-overrides"
import type { Promotion } from "@/lib/payload/content"

export function Promotions({ promotions }: { promotions: Promotion[] }) {
  if (promotions.length === 0) return null

  return (
    <section
      aria-labelledby="promotions-heading"
      className="bg-sugar-100 py-14 sm:py-16"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px w-6 bg-brass-500" aria-hidden />
          <h2
            id="promotions-heading"
            className="text-xs font-medium uppercase tracking-[0.32em] text-ink-800"
          >
            This Week at Janis
          </h2>
        </div>

        <ul
          className={
            promotions.length === 1
              ? "grid gap-5"
              : "grid gap-5 sm:grid-cols-2"
          }
        >
          {promotions.map((promo) => {
            const media = asMedia(promo.image)
            return (
              <li
                key={promo.id}
                className="relative flex items-stretch overflow-hidden rounded-2xl bg-blush-100 ring-1 ring-brass-500/30"
              >
                <div className="flex flex-1 flex-col justify-center gap-2 p-6 sm:p-7">
                  {promo.badge ? (
                    <Badge variant="primary" className="w-fit">
                      {promo.badge}
                    </Badge>
                  ) : null}
                  <h3 className="font-display text-xl leading-snug text-ink-900 sm:text-2xl">
                    {promo.title}
                  </h3>
                  {promo.description ? (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {promo.description}
                    </p>
                  ) : null}
                </div>
                {media?.url ? (
                  <div className="relative hidden w-36 shrink-0 sm:block md:w-44">
                    <Image
                      src={media.url}
                      alt={media.alt || promo.title}
                      fill
                      sizes="176px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
