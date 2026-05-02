import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Enter a valid email."),
  subject: z.string().trim().min(2, "Pick a subject.").max(120),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (10+ characters).")
    .max(2000),
})

export type ContactInput = z.infer<typeof contactSchema>
