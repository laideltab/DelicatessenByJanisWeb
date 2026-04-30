import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string
  variationId: string
  name: string
  variationName: string
  price: number
  currency: string
  quantity: number
  imageUrl: string | null
}

type CartStore = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (variationId: string) => void
  updateQuantity: (variationId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.variationId === item.variationId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variationId === item.variationId ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        })
      },

      removeItem: (variationId) => {
        set((state) => ({ items: state.items.filter((i) => i.variationId !== variationId) }))
      },

      updateQuantity: (variationId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variationId)
          return
        }
        set((state) => ({
          items: state.items.map((i) => (i.variationId === variationId ? { ...i, quantity } : i)),
        }))
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'delicatessen-cart',
    },
  ),
)
