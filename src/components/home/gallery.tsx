import Image from "next/image"
import { asMedia } from "@/lib/square/product-overrides"
import type { GalleryImage } from "@/lib/payload/content"

export function Gallery({ images }: { images: GalleryImage[] }) {
  const withMedia = images
    .map((g) => ({ ...g, media: asMedia(g.image) }))
    .filter((g) => g.media?.url)

  if (withMedia.length === 0) return null

  return (
    <section
      aria-labelledby="gallery-heading"
      className="relative overflow-hidden bg-blush-100 py-20 sm:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-[26rem] w-[26rem] rounded-full bg-blush-200/40 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
            <span className="h-px w-6 bg-brass-500" aria-hidden />
            Gallery
          </p>
          <h2
            id="gallery-heading"
            className="mt-3 font-display text-3xl leading-[1.05] tracking-tight text-ink-900 sm:text-4xl md:text-5xl"
          >
            A peek inside
            <span className="italic text-ink-800"> the shop.</span>
          </h2>
        </div>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {withMedia.map((g, i) => (
            <li
              key={g.id}
              // Alternate tall tiles for a boutique, scrapbook rhythm.
              className={i % 4 === 0 || i % 4 === 3 ? "row-span-2" : ""}
            >
              <figure className="group relative h-full overflow-hidden rounded-2xl ring-1 ring-brass-500/30">
                <div className="relative h-full min-h-44 w-full md:min-h-52">
                  <Image
                    src={g.media!.url!}
                    alt={g.media!.alt || g.title}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {g.caption ? (
                  <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/70 to-transparent px-4 pb-3 pt-10 text-xs font-medium text-white">
                    {g.caption}
                  </figcaption>
                ) : null}
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
