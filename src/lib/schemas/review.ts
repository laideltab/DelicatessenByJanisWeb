import { z } from "zod"

export const reviewSchema = z.object({
  squareItemId: z.string().trim().min(1).max(64),
  productName: z.string().trim().max(200).optional().or(z.literal("")),
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z
    .string()
    .trim()
    .email("Enter a valid email.")
    .optional()
    .or(z.literal("")),
  rating: z.number().int().min(1, "Pick a rating.").max(5),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (10+ characters).")
    .max(1000),
})

export type ReviewInput = z.infer<typeof reviewSchema>
