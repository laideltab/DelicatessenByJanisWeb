"use client"

import { useState } from "react"
import { Tag, Check, X } from "lucide-react"
import type { CalculatedTotals } from "@/lib/schemas/cart"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

interface PromoCodeProps {
  promoCode: string
  setPromoCode: (next: string) => void
  promoStatus: CalculatedTotals["promo"]
}

export function PromoCode({
  promoCode,
  setPromoCode,
  promoStatus,
}: PromoCodeProps) {
  const [draft, setDraft] = useState(promoCode)

  const apply = () => setPromoCode(draft.trim().toUpperCase())
  const clear = () => {
    setDraft("")
    setPromoCode("")
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor="promo-code"
        className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-ink-800"
      >
        <Tag className="h-3.5 w-3.5 text-brass-600" aria-hidden />
        Promo code
      </label>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          apply()
        }}
        className="flex gap-2"
      >
        <Input
          id="promo-code"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value.toUpperCase())}
          placeholder="BLUSH10"
          className="flex-1 uppercase"
        />
        {promoCode ? (
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={clear}
            aria-label="Remove promo code"
          >
            <X aria-hidden />
          </Button>
        ) : (
          <Button type="submit" variant="outline" size="md" disabled={!draft.trim()}>
            Apply
          </Button>
        )}
      </form>

      {promoStatus?.applied ? (
        <p className="inline-flex items-center gap-1.5 rounded-md bg-brass-500/10 px-2 py-1 text-xs text-ink-800">
          <Check className="h-3.5 w-3.5 text-brass-600" aria-hidden />
          <span className="font-medium">{promoStatus.name}</span>
          <span className="text-muted-foreground">
            applied · −{formatPrice(promoStatus.discount.amount, promoStatus.discount.currency)}
          </span>
        </p>
      ) : promoStatus?.applied === false ? (
        <p className="text-xs text-destructive">{promoStatus.reason}</p>
      ) : null}
    </div>
  )
}
