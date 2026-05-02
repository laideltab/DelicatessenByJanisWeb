import { z } from "zod"

export const specialOrderSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().min(7, "Enter a valid phone number.").max(30),
  eventDate: z.string().trim().min(1, "Pick an event date."),
  guests: z
    .number()
    .int()
    .min(1, "At least 1 guest.")
    .max(2000),
  occasion: z.string().trim().min(2, "Pick an occasion.").max(120),
  description: z
    .string()
    .trim()
    .min(10, "Tell us a little more (10+ characters).")
    .max(4000),
  reference: z.string().trim().max(2000).optional().or(z.literal("")),
})

export type SpecialOrderInput = z.infer<typeof specialOrderSchema>
