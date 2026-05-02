import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section
      aria-labelledby="newsletter-heading"
      className="bg-blush-100 py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-ink-800">
          Newsletter
        </p>
        <h2
          id="newsletter-heading"
          className="mt-3 font-display text-3xl leading-tight text-ink-900 sm:text-4xl"
        >
          News and offers in your inbox
        </h2>
        <p className="mt-3 text-muted-foreground">
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
            className="bg-card"
          />
          <Button type="submit" variant="primary" size="md">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  )
}
