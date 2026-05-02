"use client"

import { useMemo, useState } from "react"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import type { Product, ProductVariation } from "@/lib/square/catalog"
import { useCartStore } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { cn, formatPrice } from "@/lib/utils"

interface ProductPurchasePanelProps {
  product: Product
  /** Used to deep-link back to the product from the cart. */
  categorySlug: string | null
}

const MAX_QTY = 99

export function ProductPurchasePanel({
  product,
  categorySlug,
}: ProductPurchasePanelProps) {
  const addItem = useCartStore((s) => s.addItem)
  const variations = product.variations
  const hasVariants = variations.length > 1
  // Default-select the first in-stock variation so users don't land on a
  // disabled state when the first option happens to be sold out.
  const [variantId, setVariantId] = useState<string>(
    variations.find((v) => v.inStock)?.id ?? variations[0]?.id ?? "",
  )
  const [qty, setQty] = useState(1)

  const selected: ProductVariation | undefined = useMemo(
    () => variations.find((v) => v.id === variantId) ?? variations[0],
    [variations, variantId],
  )

  const price = selected?.price ?? product.basePrice
  const inStock = selected ? selected.inStock : product.inStock
  const purchasable = Boolean(selected && price) && inStock

  return (
    <div className="flex flex-col gap-6">
      {hasVariants ? (
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-ink-800">
            Options
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {variations.map((v) => {
              const isActive = v.id === variantId
              const variantSoldOut = !v.inStock
              return (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    aria-pressed={isActive}
                    disabled={variantSoldOut}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed",
                      isActive
                        ? "border-ink-800 bg-ink-800 text-white"
                        : "border-blush-200 bg-card text-ink-800 hover:border-ink-800",
                      variantSoldOut &&
                        "border-blush-100 bg-blush-100/40 text-muted-foreground line-through hover:border-blush-100",
                    )}
                  >
                    <span>{v.name || "Default"}</span>
                    {v.price ? (
                      <span
                        className={cn(
                          "ml-2 text-xs",
                          isActive ? "text-white/70" : "text-muted-foreground",
                        )}
                      >
                        {formatPrice(v.price.amount, v.price.currency)}
                      </span>
                    ) : null}
                    {variantSoldOut ? (
                      <span className="ml-2 text-[10px] uppercase tracking-[0.22em]">
                        Out
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}

      <div>
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-ink-800">
          Quantity
        </p>
        <div className="mt-3 inline-flex items-center rounded-full border border-blush-200 bg-card">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
            className="flex h-11 w-11 items-center justify-center text-ink-800 transition hover:bg-blush-100 disabled:opacity-40"
          >
            <Minus className="h-4 w-4" aria-hidden />
          </button>
          <span
            aria-live="polite"
            className="min-w-10 text-center font-display text-lg text-ink-900"
          >
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
            disabled={qty >= MAX_QTY}
            aria-label="Increase quantity"
            className="flex h-11 w-11 items-center justify-center text-ink-800 transition hover:bg-blush-100 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <Button
        type="button"
        size="lg"
        disabled={!purchasable}
        onClick={() => {
          if (!selected || !price) return
          addItem({
            productId: product.id,
            variationId: selected.id,
            name: product.name,
            variantName: hasVariants ? selected.name : "",
            unitPrice: price.amount,
            currency: price.currency,
            image: product.imageUrls[0] ?? null,
            categorySlug,
            productSlug: product.slug,
            qty,
          })
        }}
        className="w-full sm:w-auto"
      >
        <ShoppingBag aria-hidden />
        {inStock ? "Add to cart" : "Sold out"}
        {price && inStock ? (
          <span className="ml-2 opacity-90">
            · {formatPrice(price.amount * qty, price.currency)}
          </span>
        ) : null}
      </Button>

      {!inStock ? (
        <p className="text-sm text-muted-foreground">
          This option is currently out of stock — please check back soon or
          contact us for special orders.
        </p>
      ) : !price ? (
        <p className="text-sm text-muted-foreground">
          Pricing for this product is not available online — please contact us
          to order.
        </p>
      ) : null}
    </div>
  )
}
