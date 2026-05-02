"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send, CheckCircle2 } from "lucide-react"
import {
  specialOrderSchema,
  type SpecialOrderInput,
} from "@/lib/schemas/special-orders"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Status = "idle" | "submitting" | "success" | "error"

const fieldLabel =
  "block text-[11px] font-medium uppercase tracking-[0.22em] text-ink-800"
const fieldError = "mt-1.5 text-xs text-destructive"
const occasions = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Baby shower",
  "Corporate event",
  "Other",
]

export function SpecialOrdersForm() {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SpecialOrderInput>({
    resolver: zodResolver(specialOrderSchema),
    defaultValues: { guests: 8 },
  })

  async function onSubmit(values: SpecialOrderInput) {
    setStatus("submitting")
    setErrorMsg(null)
    try {
      const res = await fetch("/api/special-orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error ?? "Something went wrong.")
      }
      setStatus("success")
      reset()
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-card p-8 ring-1 ring-brass-500/30 shadow-sm">
        <CheckCircle2
          className="h-8 w-8 text-brass-600"
          aria-hidden
          strokeWidth={1.5}
        />
        <h3 className="mt-4 font-display text-2xl text-ink-900">
          Request received.
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Janis will reach out within one business day with a quote and next
          steps. Allow at least 5 days&rsquo; notice for custom orders.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-ink-800 underline-offset-4 hover:underline"
        >
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-2xl bg-card p-7 ring-1 ring-blush-200/60 shadow-sm sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="so-name" className={fieldLabel}>
            Name
          </label>
          <Input
            id="so-name"
            type="text"
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            className={cn(
              "mt-2",
              errors.name && "border-destructive focus-visible:ring-destructive",
            )}
            {...register("name")}
          />
          {errors.name ? <p className={fieldError}>{errors.name.message}</p> : null}
        </div>
        <div>
          <label htmlFor="so-email" className={fieldLabel}>
            Email
          </label>
          <Input
            id="so-email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="so-phone" className={fieldLabel}>
            Phone
          </label>
          <Input
            id="so-phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={errors.phone ? true : undefined}
            className={cn(
              "mt-2",
              errors.phone && "border-destructive focus-visible:ring-destructive",
            )}
            {...register("phone")}
          />
          {errors.phone ? (
            <p className={fieldError}>{errors.phone.message}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="so-event-date" className={fieldLabel}>
            Event date
          </label>
          <Input
            id="so-event-date"
            type="date"
            aria-invalid={errors.eventDate ? true : undefined}
            className={cn(
              "mt-2",
              errors.eventDate &&
                "border-destructive focus-visible:ring-destructive",
            )}
            {...register("eventDate")}
          />
          {errors.eventDate ? (
            <p className={fieldError}>{errors.eventDate.message}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="so-guests" className={fieldLabel}>
            Guests
          </label>
          <Input
            id="so-guests"
            type="number"
            min={1}
            max={2000}
            aria-invalid={errors.guests ? true : undefined}
            className={cn(
              "mt-2",
              errors.guests && "border-destructive focus-visible:ring-destructive",
            )}
            {...register("guests", { valueAsNumber: true })}
          />
          {errors.guests ? (
            <p className={fieldError}>{errors.guests.message}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="so-occasion" className={fieldLabel}>
          Occasion
        </label>
        <select
          id="so-occasion"
          aria-invalid={errors.occasion ? true : undefined}
          className={cn(
            "mt-2 flex h-11 w-full rounded-md border border-input bg-card px-3.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
            errors.occasion &&
              "border-destructive focus-visible:ring-destructive",
          )}
          defaultValue=""
          {...register("occasion")}
        >
          <option value="" disabled>
            Choose one…
          </option>
          {occasions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {errors.occasion ? (
          <p className={fieldError}>{errors.occasion.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="so-description" className={fieldLabel}>
          Tell us about it
        </label>
        <textarea
          id="so-description"
          rows={5}
          placeholder="Flavor, size, dietary restrictions, anything that matters."
          aria-invalid={errors.description ? true : undefined}
          className={cn(
            "mt-2 flex w-full rounded-md border border-input bg-card px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
            errors.description &&
              "border-destructive focus-visible:ring-destructive",
          )}
          {...register("description")}
        />
        {errors.description ? (
          <p className={fieldError}>{errors.description.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="so-reference" className={fieldLabel}>
          References / inspiration <span className="text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="so-reference"
          rows={3}
          placeholder="Links to images, Pinterest boards, or color references."
          className="mt-2 flex w-full rounded-md border border-input bg-card px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
          {...register("reference")}
        />
      </div>

      {errorMsg ? (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMsg}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={isSubmitting}>
        <Send aria-hidden />
        {isSubmitting ? "Sending…" : "Submit request"}
      </Button>
      <p className="text-xs text-muted-foreground">
        We&rsquo;ll get back to you within one business day with a quote.
      </p>
    </form>
  )
}
