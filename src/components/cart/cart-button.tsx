"use client"

import { ShoppingBag } from "lucide-react"
import { useCartStore, selectCount } from "@/store/cart"
import { useHydrated } from "./use-hydrated"

export function CartButton() {
  const open = useCartStore((s) => s.open)
  const count = useCartStore(selectCount)
  const hydrated = useHydrated()
  const display = hydrated ? count : 0

  return (
    <button
      type="button"
      onClick={open}
      aria-label={
        display > 0
          ? `Open cart (${display} item${display === 1 ? "" : "s"})`
          : "Open cart"
      }
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-800 transition hover:bg-blush-100"
    >
      <ShoppingBag className="h-5 w-5" aria-hidden />
      {display > 0 ? (
        <span
          aria-hidden
          className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink-900 px-1 text-[10px] font-semibold leading-none text-brass-500 ring-2 ring-background"
        >
          {display > 99 ? "99+" : display}
        </span>
      ) : null}
    </button>
  )
}
