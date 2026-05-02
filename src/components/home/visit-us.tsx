import { MapPin, Clock } from "lucide-react"

const hours = [
  { day: "Mon – Fri", time: "7:00 – 19:00" },
  { day: "Saturday", time: "8:00 – 20:00" },
  { day: "Sunday", time: "9:00 – 17:00" },
]

export function VisitUs() {
  return (
    <section
      aria-labelledby="visit-us-heading"
      className="bg-sugar-100 py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-ink-800">
            Visit us
          </p>
          <h2
            id="visit-us-heading"
            className="mt-3 font-display text-3xl leading-tight text-ink-900 sm:text-4xl md:text-5xl"
          >
            Come say hi.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="space-y-8">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-ink-800">
                <Clock className="h-4 w-4" />
                Hours
              </div>
              <ul className="space-y-2 text-base">
                {hours.map((h) => (
                  <li
                    key={h.day}
                    className="flex items-baseline justify-between gap-3 border-b border-blush-100 pb-2 text-muted-foreground"
                  >
                    <span>{h.day}</span>
                    <span className="text-ink-800">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-ink-800">
                <MapPin className="h-4 w-4" />
                Address
              </div>
              <address className="not-italic text-base text-ink-800">
                {/* TODO: real International Mall address pending */}
                International Mall, Tampa, FL
                <br />
                <span className="text-muted-foreground">
                  Exact address to be confirmed
                </span>
              </address>
            </div>
          </div>

          <div
            aria-hidden
            className="relative aspect-square overflow-hidden rounded-2xl bg-card ring-1 ring-blush-200"
          >
            {/* TODO: replace with Google Maps <iframe> using the real address */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, var(--color-blush-200) 0 80px, #ffffff 80px 160px)",
                opacity: 0.55,
              }}
            />
            <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 p-8 text-center">
              <MapPin className="h-8 w-8 text-ink-800" />
              <span className="font-display text-xl italic text-ink-800/70">
                Map coming soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
