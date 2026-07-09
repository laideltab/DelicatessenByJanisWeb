"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const formSchema = z.object({
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
type FormValues = z.infer<typeof formSchema>

const fieldLabel =
  "block text-[11px] font-medium uppercase tracking-[0.22em] text-ink-800"
const fieldError = "mt-1.5 text-xs text-destructive"

export function ReviewForm({
  squareItemId,
  productName,
}: {
  squareItemId: string
  productName: string
}) {
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { rating: 0 },
  })

  const rating = watch("rating")

  async function onSubmit(values: FormValues) {
    setErrorMsg(null)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, squareItemId, productName }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error ?? "Could not submit your review.")
      }
      setSubmitted(true)
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong.",
      )
    }
  }

  if (submitted) {
    return (
      <p className="rounded-xl bg-blush-100/60 px-5 py-4 text-sm text-ink-800">
        Thank you! Your review was received and will appear once it&rsquo;s
        approved.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 text-left"
    >
      <div>
        <span className={fieldLabel}>Your rating</span>
        <div className="mt-2 flex items-center gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              onClick={() =>
                setValue("rating", value, { shouldValidate: true })
              }
              className="p-0.5"
            >
              <Star
                aria-hidden
                className={
                  value <= rating
                    ? "h-6 w-6 fill-brass-500 text-brass-500"
                    : "h-6 w-6 text-brass-500/40 transition-colors hover:text-brass-500"
                }
              />
            </button>
          ))}
        </div>
        {errors.rating ? (
          <p className={fieldError}>{errors.rating.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="rv-name" className={fieldLabel}>
            Name
          </label>
          <Input
            id="rv-name"
            type="text"
            autoComplete="name"
            className={cn(
              "mt-2",
              errors.name && "border-destructive focus-visible:ring-destructive",
            )}
            {...register("name")}
          />
          {errors.name ? (
            <p className={fieldError}>{errors.name.message}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="rv-email" className={fieldLabel}>
            Email <span className="text-muted-foreground">(optional, never shown)</span>
          </label>
          <Input
            id="rv-email"
            type="email"
            autoComplete="email"
            className={cn(
              "mt-2",
              errors.email && "border-destructive focus-visible:ring-destructive",
            )}
            {...register("email")}
          />
          {errors.email ? (
            <p className={fieldError}>{errors.email.message}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="rv-message" className={fieldLabel}>
          Your review
        </label>
        <textarea
          id="rv-message"
          rows={4}
          placeholder="How was it? What did you order?"
          className={cn(
            "mt-2 flex w-full rounded-md border border-input bg-card px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
            errors.message && "border-destructive focus-visible:ring-destructive",
          )}
          {...register("message")}
        />
        {errors.message ? (
          <p className={fieldError}>{errors.message.message}</p>
        ) : null}
      </div>

      {errorMsg ? (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMsg}
        </p>
      ) : null}

      <Button type="submit" size="md" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          "Submit review"
        )}
      </Button>
    </form>
  )
}
