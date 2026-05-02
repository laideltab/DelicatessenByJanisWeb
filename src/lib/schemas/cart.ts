import { z } from "zod"

export const calculateCartSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variationId: z.string().min(1),
        qty: z.number().int().min(1).max(99),
      }),
    )
    .min(1),
  promoCode: z.string().trim().max(40).optional().or(z.literal("")),
})

export type CalculateCartInput = z.infer<typeof calculateCartSchema>

export type Money = { amount: number; currency: string }

export type StockIssue = {
  lineId: string
  productId: string
  variationId: string
  requested: number
  available: number
}

export type CalculatedTotals = {
  subtotal: Money
  tax: Money
  discount: Money
  total: Money
  taxBreakdown: { name: string; money: Money }[]
  discountBreakdown: { name: string; money: Money }[]
  stockIssues: StockIssue[]
  promo:
    | { applied: true; code: string; name: string; discount: Money }
    | { applied: false; code: string; reason: string }
    | null
}
