import Link from "next/link"
import { ChevronRight } from "lucide-react"

export type BreadcrumbItem = {
  name: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={`${item.name}-${i}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-ink-800 hover:underline"
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className={isLast ? "font-medium text-ink-800" : undefined}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.name}
                </span>
              )}
              {!isLast ? (
                <ChevronRight className="h-3.5 w-3.5 text-blush-200" aria-hidden />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
