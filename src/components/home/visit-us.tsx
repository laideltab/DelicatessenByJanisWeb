import { MapPin, Clock } from "lucide-react"

const hours = [
  { day: "Mon – Sat", time: "10:00 AM – 9:00 PM" },
  { day: "Sunday", time: "11:00 AM – 7:00 PM" },
]

export function VisitUs() {
  return (
    <section
      aria-labelledby="visit-us-heading"
      className="relative bg-sugar-100 py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
            <span className="h-px w-6 bg-brass-500" aria-hidden />
            Visit us
          </p>
          <h2
            id="visit-us-heading"
            className="mt-4 font-display text-3xl leading-[1.05] tracking-tight text-ink-900 sm:text-4xl md:text-5xl"
          >
            Come <span className="italic text-ink-800">say hi.</span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="space-y-8">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-ink-800">
                <Clock className="h-4 w-4 text-brass-600" aria-hidden />
                Hours
              </div>
              <ul className="space-y-2 text-base">
                {hours.map((h) => (
                  <li
                    key={h.day}
                    className="flex items-baseline justify-between gap-3 border-b border-brass-500/25 pb-2 text-muted-foreground"
                  >
                    <span>{h.day}</span>
                    <span className="font-display text-ink-900">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-ink-800">
                <MapPin className="h-4 w-4 text-brass-600" aria-hidden />
                Address
              </div>
              <address className="not-italic text-base text-ink-800">
                Miami International Mall
                <br />
                1455 NW 107th Ave
                <br />
                Doral, FL 33172
              </address>
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-brass-500/30 via-blush-200/30 to-transparent blur-md"
            />
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-card ring-1 ring-brass-500/40 shadow-[0_20px_60px_-25px_rgba(33,33,33,0.4)]">
              <iframe
                title="Map to Delicatessen by Janis at Miami International Mall"
                src="https://www.google.com/maps?q=1455+NW+107th+Ave,+Doral,+FL+33172&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />

              <span
                aria-hidden
                className="pointer-events-none absolute left-3 top-3 z-10 h-4 w-4 rounded-tl-md border-l border-t border-brass-500"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute right-3 bottom-3 z-10 h-4 w-4 rounded-br-md border-r border-b border-brass-500"
              />
            </div>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=1455+NW+107th+Ave,+Doral,+FL+33172"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.22em] text-ink-800 underline-offset-4 hover:underline"
            >
              <MapPin className="h-4 w-4 text-brass-600" aria-hidden />
              Get directions
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
