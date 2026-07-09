import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getPublishedPosts } from "@/lib/payload/content"
import { asMedia } from "@/lib/square/product-overrides"
import { Breadcrumb } from "@/components/shop/breadcrumb"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld"
import { formatPostDate } from "./format"

export const revalidate = 60

export const metadata: Metadata = {
  title: "News & Stories",
  description:
    "News, seasonal specials, and stories from the Delicatessen by Janis kitchen in Doral, FL.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "News & Stories | Delicatessen by Janis",
    description:
      "News, seasonal specials, and stories from the Delicatessen by Janis kitchen.",
    type: "website",
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "News & Stories | Delicatessen by Janis",
    description:
      "News, seasonal specials, and stories from the Delicatessen by Janis kitchen.",
  },
}

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />

      <div className="bg-sugar-100 py-10 sm:py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Blog" }]} />
        </div>
      </div>

      <section
        aria-labelledby="blog-heading"
        className="bg-sugar-100 pb-20 sm:pb-24"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
              <span className="h-px w-6 bg-brass-500" aria-hidden />
              From the Kitchen
            </p>
            <h1
              id="blog-heading"
              className="mt-3 font-display text-4xl leading-tight text-ink-900 sm:text-5xl md:text-6xl"
            >
              News <span className="italic text-ink-800">&amp; stories.</span>
            </h1>
          </div>

          {posts.length === 0 ? (
            <p className="text-muted-foreground">
              Nothing published yet — check back soon.
            </p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const image = asMedia(post.featuredImage)
                return (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-[0_15px_45px_-25px_rgba(33,33,33,0.35)] ring-1 ring-brass-500/25 transition-shadow hover:shadow-[0_20px_60px_-25px_rgba(33,33,33,0.45)]"
                    >
                      <div className="relative aspect-[3/2] w-full overflow-hidden bg-blush-100">
                        {image?.url ? (
                          <Image
                            src={image.url}
                            alt={image.alt || post.title}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            aria-hidden
                            className="absolute inset-0"
                            style={{
                              backgroundImage:
                                "repeating-linear-gradient(90deg, var(--color-blush-200) 0 64px, #ffffff 64px 128px)",
                              opacity: 0.55,
                            }}
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-6">
                        {post.publishedAt ? (
                          <time
                            dateTime={post.publishedAt}
                            className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
                          >
                            {formatPostDate(post.publishedAt)}
                          </time>
                        ) : null}
                        <h2 className="font-display text-xl leading-snug text-ink-900 sm:text-2xl">
                          {post.title}
                        </h2>
                        {post.excerpt ? (
                          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                            {post.excerpt}
                          </p>
                        ) : null}
                        <span className="mt-auto pt-2 text-xs font-medium uppercase tracking-[0.22em] text-ink-800">
                          Read more
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
