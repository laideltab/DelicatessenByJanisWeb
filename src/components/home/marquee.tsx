const ITEMS = [
  "Charlotte Cakes",
  "Express Cakes",
  "Cookie Cakes",
  "Pasteles",
  "Espresso & Café",
  "Sandwiches",
  "Empanadas",
  "Breakfast Pastries",
]

export function Marquee() {
  // Render the list twice so the -50% translation loops seamlessly.
  const loop = [...ITEMS, ...ITEMS]

  return (
    <div
      aria-hidden
      className="relative overflow-hidden border-y border-brass-500/30 bg-ink-900 py-5 sm:py-6"
    >
      <div className="marquee-track flex w-max items-center gap-12 whitespace-nowrap">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-12 font-display text-2xl italic text-sugar-100 sm:text-3xl md:text-4xl"
          >
            {item}
            <span className="text-brass-500" aria-hidden>
              ✺
            </span>
          </span>
        ))}
      </div>

      {/* Edge fades — soften the marquee at both sides */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink-900 to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink-900 to-transparent sm:w-24" />
    </div>
  )
}
