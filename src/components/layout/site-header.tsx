import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Wordmark } from "./wordmark"
import { MobileNav } from "./mobile-nav"
import { mainNav } from "./nav-config"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Wordmark size="md" />

        <nav
          aria-label="Main"
          className="hidden items-center gap-1 md:flex"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-ink-800 transition-colors hover:bg-blush-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label="View cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-800 hover:bg-blush-100"
          >
            <ShoppingBag className="h-5 w-5" />
          </Link>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/shop">Order now</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
