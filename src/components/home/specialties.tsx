import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export type SpecialtyCard = {
  id: string
  name: string
  slug: string
  productCount: number
  coverImage: string | null
}

export function Specialties({ categories }: { categories: SpecialtyCard[] }) {
  if (categories.length === 0) return null

  return (
    <section
      aria-labelledby="specialties-heading"
      className="relative bg-sugar-100 py-20 sm:py-24"
    >
      {/* Section heading band */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
              <span className="h-px w-6 bg-brass-500" aria-hidden />
              Our specialties
            </p>
            <h2
              id="specialties-heading"
              className="mt-4 font-display text-3xl leading-[1.05] tracking-tight text-ink-900 sm:text-4xl md:text-5xl"
            >
              Every category,
              <span className="italic text-ink-800"> made by the same hands.</span>
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-[0.22em] text-ink-800 underline-offset-4 hover:underline"
          >
            See full menu
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, idx) => (
            <li key={c.id}>
              <Link
                href={`/shop/${c.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-blush-100 ring-1 ring-blush-200/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-brass-500/60"
              >
                {c.coverImage ? (
                  <Image
                    src={c.coverImage}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={idx < 2}
                  />
                ) : (
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(135deg, var(--color-blush-200) 0 56px, #ffffff 56px 112px)",
                      opacity: 0.55,
                    }}
                  />
                )}

                {/* Darken gradient for text legibility */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink-900/75 via-ink-900/15 to-transparent"
                />

                {/* Product count chip — top right */}
                <div className="absolute right-3 top-3">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white backdrop-blur">
                    {c.productCount === 0
                      ? "Coming soon"
                      : c.productCount === 1
                      ? "1 item"
                      : `${c.productCount} items`}
                  </span>
                </div>

                {/* Label — bottom */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <h3 className="font-display text-2xl leading-tight text-white drop-shadow-sm sm:text-[1.65rem]">
                    {c.name}
                  </h3>
                  <span
                    aria-hidden
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                {/* Brass corner detail — French boutique cue */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-3 h-3 w-3 rounded-tl-md border-l border-t border-brass-500/80"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
