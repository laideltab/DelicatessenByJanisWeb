"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type CartItem = {
  /** `${productId}:${variationId}` — the cart line key. */
  lineId: string
  productId: string
  variationId: string
  name: string
  variantName: string
  /** Snapshotted unit price at the time the item was added. */
  unitPrice: number
  currency: string
  image: string | null
  /** For deep-linking back to the product page. */
  categorySlug: string | null
  productSlug: string
  qty: number
}

export type AddItemInput = Omit<CartItem, "lineId" | "qty"> & { qty?: number }

type CartState = {
  items: CartItem[]
  isOpen: boolean
}

type CartActions = {
  addItem: (input: AddItemInput) => void
  removeItem: (lineId: string) => void
  updateQty: (lineId: string, qty: number) => void
  clear: () => void
  open: () => void
  close: () => void
  toggle: () => void
}

const lineKey = (productId: string, variationId: string) =>
  `${productId}:${variationId}`

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      addItem: (input) =>
        set((state) => {
          const id = lineKey(input.productId, input.variationId)
          const qty = clamp(input.qty ?? 1)
          const existing = state.items.find((i) => i.lineId === id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.lineId === id ? { ...i, qty: clamp(i.qty + qty) } : i,
              ),
              isOpen: true,
            }
          }
          const next: CartItem = {
            lineId: id,
            productId: input.productId,
            variationId: input.variationId,
            name: input.name,
            variantName: input.variantName,
            unitPrice: input.unitPrice,
            currency: input.currency,
            image: input.image,
            categorySlug: input.categorySlug,
            productSlug: input.productSlug,
            qty,
          }
          return { items: [...state.items, next], isOpen: true }
        }),

      removeItem: (lineId) =>
        set((state) => ({
          items: state.items.filter((i) => i.lineId !== lineId),
        })),

      updateQty: (lineId, qty) =>
        set((state) => {
          if (qty <= 0) {
            return { items: state.items.filter((i) => i.lineId !== lineId) }
          }
          return {
            items: state.items.map((i) =>
              i.lineId === lineId ? { ...i, qty: clamp(qty) } : i,
            ),
          }
        }),

      clear: () => set({ items: [] }),

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name: "delicatessen-cart-v1",
      storage: createJSONStorage(() => localStorage),
      // Don't persist the open/close state across reloads.
      partialize: (state) => ({ items: state.items }) as Partial<CartState>,
    },
  ),
)

function clamp(qty: number): number {
  if (Number.isNaN(qty)) return 1
  return Math.min(99, Math.max(1, Math.floor(qty)))
}

/** Total number of units in the cart. */
export function selectCount(state: { items: CartItem[] }): number {
  return state.items.reduce((sum, i) => sum + i.qty, 0)
}

/** Subtotal in major units (currency taken from the last item). */
export function selectSubtotal(state: { items: CartItem[] }): {
  amount: number
  currency: string
} {
  let amount = 0
  let currency = "USD"
  for (const i of state.items) {
    amount += i.unitPrice * i.qty
    currency = i.currency
  }
  return { amount, currency }
}
