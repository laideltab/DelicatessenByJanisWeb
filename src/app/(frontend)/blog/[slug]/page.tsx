import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { RichText } from "@payloadcms/richtext-lexical/react"
import {
  getPostBySlug,
  getPublishedPosts,
} from "@/lib/payload/content"
import { asMedia, lexicalHasText } from "@/lib/square/product-overrides"
import { siteConfig } from "@/lib/site-config"
import { Breadcrumb } from "@/components/shop/breadcrumb"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld"
import { formatPostDate } from "../format"

export const revalidate = 60

type RouteParams = { slug: string }

export async function generateStaticParams(): Promise<RouteParams[]> {
  const posts = await getPublishedPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const title = post.seo?.metaTitle?.trim() || post.title
  const description =
    post.seo?.metaDescription?.trim() ||
    post.excerpt?.trim() ||
    `${post.title} — news from Delicatessen by Janis.`
  const path = `/blog/${post.slug}`
  const image = asMedia(post.featuredImage)?.url

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | Delicatessen by Janis`,
      description,
      type: "article",
      url: path,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Delicatessen by Janis`,
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}

function ArticleJsonLd({
  post,
  imageUrl,
}: {
  post: { title: string; slug: string; excerpt?: string | null; publishedAt?: string | null }
  imageUrl?: string | null
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(imageUrl ? { image: [imageUrl] } : {}),
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<RouteParams>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const image = asMedia(post.featuredImage)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <ArticleJsonLd post={post} imageUrl={image?.url} />

      <div className="bg-sugar-100 py-10 sm:py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "Blog", href: "/blog" },
              { name: post.title },
            ]}
          />
        </div>
      </div>

      <article className="bg-sugar-100 pb-20 sm:pb-24">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <header className="mb-10">
            {post.publishedAt ? (
              <time
                dateTime={post.publishedAt}
                className="text-xs uppercase tracking-[0.28em] text-muted-foreground"
              >
                {formatPostDate(post.publishedAt)}
              </time>
            ) : null}
            <h1 className="mt-3 font-display text-4xl leading-tight text-ink-900 sm:text-5xl">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {post.excerpt}
              </p>
            ) : null}
          </header>

          {image?.url ? (
            <div className="relative mb-10 aspect-[3/2] w-full overflow-hidden rounded-2xl ring-1 ring-brass-500/30">
              <Image
                src={image.url}
                alt={image.alt || post.title}
                fill
                priority
                sizes="(min-width: 768px) 48rem, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}

          {lexicalHasText(post.content) ? (
            <div className="rich-text">
              <RichText data={post.content as never} />
            </div>
          ) : null}
        </div>
      </article>
    </>
  )
}
