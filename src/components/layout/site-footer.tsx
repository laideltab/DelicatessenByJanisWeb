import Link from "next/link"
import { Wordmark } from "./wordmark"
import { mainNav } from "./nav-config"

const hours = [
  { day: "Mon – Fri", time: "7:00 – 19:00" },
  { day: "Saturday", time: "8:00 – 20:00" },
  { day: "Sunday", time: "9:00 – 17:00" },
]

const social = [
  { label: "Instagram", href: "https://instagram.com/delicatessenbyjanis" },
  { label: "Facebook", href: "https://facebook.com/delicatessenbyjanis" },
]

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-blush-100">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-16 md:grid-cols-4 lg:px-8">
        <div className="space-y-4 md:col-span-2">
          <Wordmark size="lg" />
          <p className="max-w-xs text-sm text-muted-foreground">
            Artisan cakes, coffee, and delicatessen — baked every morning by
            Janis with hand-selected ingredients.
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-display text-lg">Explore</h3>
          <ul className="space-y-2 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-ink-800"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-display text-lg">Hours</h3>
          <ul className="space-y-2 text-sm">
            {hours.map((h) => (
              <li
                key={h.day}
                className="flex items-baseline justify-between gap-3 text-muted-foreground"
              >
                <span>{h.day}</span>
                <span className="text-ink-800">{h.time}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-4 text-sm">
            {social.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-ink-800"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Delicatessen by Janis</p>
          <Link href="/terms" className="hover:text-ink-800">
            Terms & privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
