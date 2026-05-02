import { z } from "zod"

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  variationId: z.string().min(1),
  qty: z.number().int().min(1).max(99),
})

const customerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().min(7, "Enter a valid phone number.").max(30),
})

const pickupSchema = z.object({
  type: z.literal("pickup"),
  /** ISO 8601 timestamp when ready / requested. Empty string = ASAP. */
  pickupAt: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
})

const deliverySchema = z.object({
  type: z.literal("delivery"),
  address: z.object({
    street: z.string().trim().min(3),
    unit: z.string().trim().max(40).optional().or(z.literal("")),
    city: z.string().trim().min(2),
    state: z.string().trim().min(2).max(2),
    postalCode: z.string().trim().min(4).max(10),
  }),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
})

export const fulfillmentSchema = z.discriminatedUnion("type", [
  pickupSchema,
  deliverySchema,
])

export const placeOrderSchema = z.object({
  customer: customerSchema,
  fulfillment: fulfillmentSchema,
  items: z.array(checkoutItemSchema).min(1),
  promoCode: z.string().trim().max(40).optional().or(z.literal("")),
  /** Web Payments SDK token (cnon:…) returned by Square's tokenize(). */
  paymentToken: z.string().min(1),
  /** Idempotency key generated client-side (uuid). */
  idempotencyKey: z.string().min(8).max(80),
})

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>
export type CheckoutItem = z.infer<typeof checkoutItemSchema>
export type FulfillmentInput = z.infer<typeof fulfillmentSchema>
