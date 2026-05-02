"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, AlertTriangle } from "lucide-react"
import type { CartItem } from "@/store/cart"
import { useCartStore } from "@/store/cart"
import type { StockIssue } from "@/lib/schemas/cart"
import { cn, formatPrice } from "@/lib/utils"

interface CartLineProps {
  item: CartItem
  issue?: StockIssue
}

export function CartLine({ item, issue }: CartLineProps) {
  const updateQty = useCartStore((s) => s.updateQty)
  const removeItem = useCartStore((s) => s.removeItem)

  const href = item.categorySlug
    ? `/shop/${item.categorySlug}/${item.productSlug}`
    : `/shop/${item.productSlug}`
  const lineTotal = item.unitPrice * item.qty
  const max = issue?.available !== undefined ? issue.available : 99

  return (
    <li className="flex gap-4 py-4">
      <Link
        href={href}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-blush-100 ring-1 ring-blush-200/60"
      >
        {item.image ? (
          <Image
            src={item.image}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-2xl text-blush-200">
            {item.name.charAt(0)}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link
              href={href}
              className="font-display text-base leading-tight text-ink-900 hover:underline"
            >
              {item.name}
            </Link>
            {item.variantName ? (
              <p className="text-xs text-muted-foreground">
                {item.variantName}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.lineId)}
            aria-label={`Remove ${item.name}`}
            className="shrink-0 rounded-md p-1 text-muted-foreground transition hover:bg-blush-100 hover:text-ink-800"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {issue ? (
          <p
            role="alert"
            className="mt-1 inline-flex items-start gap-1.5 rounded-md bg-destructive/10 px-2 py-1 text-[11px] text-destructive"
          >
            <AlertTriangle className="mt-0.5 h-3 w-3" aria-hidden />
            {issue.available === 0
              ? "Out of stock — please remove."
              : `Only ${issue.available} available — quantity adjusted.`}
          </p>
        ) : null}

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-full border border-blush-200 bg-card">
            <button
              type="button"
              onClick={() => updateQty(item.lineId, item.qty - 1)}
              aria-label="Decrease quantity"
              className="flex h-8 w-8 items-center justify-center text-ink-800 transition hover:bg-blush-100 disabled:opacity-40"
              disabled={item.qty <= 1}
            >
              <Minus className="h-3.5 w-3.5" aria-hidden />
            </button>
            <span className="min-w-7 text-center font-display text-sm text-ink-900">
              {item.qty}
            </span>
            <button
              type="button"
              onClick={() => updateQty(item.lineId, item.qty + 1)}
              aria-label="Increase quantity"
              className="flex h-8 w-8 items-center justify-center text-ink-800 transition hover:bg-blush-100 disabled:opacity-40"
              disabled={item.qty >= max}
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>

          <p
            className={cn(
              "font-display text-base text-ink-900",
              issue && "line-through text-muted-foreground",
            )}
          >
            {formatPrice(lineTotal, item.currency)}
          </p>
        </div>
      </div>
    </li>
  )
}
