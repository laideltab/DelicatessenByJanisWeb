import type { Metadata } from "next"
import { Cake, Calendar, Clock4 } from "lucide-react"
import { Breadcrumb } from "@/components/shop/breadcrumb"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld"
import { FaqJsonLd } from "@/components/seo/faq-jsonld"
import { SpecialOrdersForm } from "@/components/forms/special-orders-form"

export const metadata: Metadata = {
  title: "Special Orders",
  description:
    "Request a custom cake or catering for your event. Birthdays, weddings, corporate events — Delicatessen by Janis bakes for the moments that matter.",
  alternates: { canonical: "/special-orders" },
  openGraph: {
    title: "Special Orders | Delicatessen by Janis",
    description: "Request a custom cake or catering for your event.",
    type: "website",
    url: "/special-orders",
  },
  twitter: {
    card: "summary_large_image",
    title: "Special Orders | Delicatessen by Janis",
    description: "Request a custom cake or catering for your event.",
  },
}

const faqs = [
  {
    question: "How far in advance do I need to order a custom cake?",
    answer:
      "We require at least 5 calendar days' notice for special orders so we can source ingredients and finalize the design with you.",
  },
  {
    question: "Is a deposit required?",
    answer:
      "Yes — special orders require a 50% deposit at the time of design approval. The remaining balance is due at pickup.",
  },
  {
    question: "Can you accommodate dietary restrictions?",
    answer:
      "We do our best to accommodate gluten-free, dairy-free, and nut-free requests on advance notice. Our kitchen handles wheat, dairy, eggs, and tree nuts, so we cannot guarantee an allergen-free environment.",
  },
  {
    question: "Do you deliver, or is pickup only?",
    answer:
      "We offer pickup at our shop in Miami International Mall. Local delivery is available within Doral and the Miami metro area for an additional fee, calculated based on distance.",
  },
  {
    question: "Can I cancel a special order?",
    answer:
      "Special-order deposits are refundable up to 7 days before the event date. Cancellations within 7 days forfeit the deposit, since the kitchen has typically begun prep.",
  },
]

const steps = [
  {
    icon: Calendar,
    title: "Tell us the basics",
    body: "Date, headcount, occasion, and a sense of what you have in mind.",
  },
  {
    icon: Cake,
    title: "We design the cake",
    body: "Janis sketches a proposal — flavors, layers, decoration — within a day.",
  },
  {
    icon: Clock4,
    title: "Pickup or delivery",
    body: "Pickup at the shop, or local delivery within Doral and Miami metro.",
  },
]

export default function SpecialOrdersPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Special Orders", path: "/special-orders" },
        ]}
      />
      <FaqJsonLd items={faqs} />

      <div className="bg-sugar-100 py-10 sm:py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ name: "Home", href: "/" }, { name: "Special Orders" }]}
          />
        </div>
      </div>

      {/* Hero */}
      <section
        aria-labelledby="special-heading"
        className="relative overflow-hidden bg-sugar-100 pb-16 pt-4 sm:pb-20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-0 h-[28rem] w-[28rem] rounded-full bg-blush-200/30 blur-3xl"
        />
        <div className="relative mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
            <span className="h-px w-6 bg-brass-500" aria-hidden />
            Special orders
            <span className="h-px w-6 bg-brass-500" aria-hidden />
          </p>
          <h1
            id="special-heading"
            className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-ink-900 sm:text-5xl md:text-6xl"
          >
            For the moments
            <span className="italic text-ink-800"> that deserve cake.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Birthdays, weddings, baby showers, corporate events. Custom cakes
            and dessert tables baked from scratch — please give us at least 5
            days&rsquo; notice.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-heading" className="bg-blush-100 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
              <span className="h-px w-6 bg-brass-500" aria-hidden />
              How it works
            </p>
            <h2
              id="how-heading"
              className="mt-4 font-display text-3xl leading-[1.05] tracking-tight text-ink-900 sm:text-4xl"
            >
              Three steps,
              <span className="italic text-ink-800"> one cake.</span>
            </h2>
          </div>
          <ol className="grid gap-5 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="rounded-2xl bg-card p-7 ring-1 ring-blush-200/60 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-blush-100 text-brass-600">
                    <s.icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl text-ink-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Form */}
      <section
        aria-labelledby="special-form-heading"
        className="bg-sugar-100 py-16 sm:py-20"
      >
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2
            id="special-form-heading"
            className="mb-8 font-display text-3xl leading-[1.05] tracking-tight text-ink-900 sm:text-4xl"
          >
            Tell us
            <span className="italic text-ink-800"> what you&rsquo;re dreaming up.</span>
          </h2>
          <SpecialOrdersForm />
        </div>
      </section>

      {/* FAQ */}
      <section
        aria-labelledby="faq-heading"
        className="border-t border-blush-200/50 bg-blush-100 py-20 sm:py-24"
      >
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
              <span className="h-px w-6 bg-brass-500" aria-hidden />
              Frequently asked
              <span className="h-px w-6 bg-brass-500" aria-hidden />
            </p>
            <h2
              id="faq-heading"
              className="mt-4 font-display text-3xl leading-[1.05] tracking-tight text-ink-900 sm:text-4xl"
            >
              Everything you might
              <span className="italic text-ink-800"> want to ask.</span>
            </h2>
          </div>

          <dl className="space-y-4">
            {faqs.map((f) => (
              <details
                key={f.question}
                className="group rounded-2xl bg-card p-6 ring-1 ring-blush-200/60 shadow-sm open:ring-brass-500/60 sm:p-7"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-ink-900 sm:text-xl">
                  <dt className="flex-1">{f.question}</dt>
                  <span
                    aria-hidden
                    className="text-brass-600 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <dd className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {f.answer}
                </dd>
              </details>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
