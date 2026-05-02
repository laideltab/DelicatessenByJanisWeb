import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section
      aria-labelledby="newsletter-heading"
      className="relative overflow-hidden bg-ink-900 py-20 sm:py-24"
    >
      {/* Decorative pink wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-blush-200/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-24 h-[24rem] w-[24rem] rounded-full bg-brass-500/15 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-brass-500">
          <span className="h-px w-6 bg-brass-500" aria-hidden />
          Newsletter
          <span className="h-px w-6 bg-brass-500" aria-hidden />
        </p>
        <h2
          id="newsletter-heading"
          className="mt-4 font-display text-3xl leading-[1.05] tracking-tight text-sugar-100 sm:text-4xl md:text-5xl"
        >
          News and offers
          <span className="italic text-blush-100"> in your inbox.</span>
        </h2>
        <p className="mt-4 text-base text-sugar-100/70">
          New flavors, limited editions, and shop events.
        </p>
        <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email
          </label>
          <Input
            id="newsletter-email"
            type="email"
            placeholder="you@email.com"
            required
            className="border-brass-500/30 bg-white/95 text-ink-900 placeholder:text-ink-700/60"
          />
          <Button
            type="submit"
            variant="accent"
            size="md"
            className="bg-brass-500 text-ink-900 hover:bg-brass-600"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  )
}
