"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send, CheckCircle2 } from "lucide-react"
import { contactSchema, type ContactInput } from "@/lib/schemas/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Status = "idle" | "submitting" | "success" | "error"

const fieldLabel =
  "block text-[11px] font-medium uppercase tracking-[0.22em] text-ink-800"
const fieldError = "mt-1.5 text-xs text-destructive"

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  })

  async function onSubmit(values: ContactInput) {
    setStatus("submitting")
    setErrorMsg(null)
    try {
      const res = await fetch("/api/contact", {
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
          Message received.
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you for reaching out — Janis will reply within one business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-ink-800 underline-offset-4 hover:underline"
        >
          Send another message
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
          <label htmlFor="contact-name" className={fieldLabel}>
            Name
          </label>
          <Input
            id="contact-name"
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
          <label htmlFor="contact-email" className={fieldLabel}>
            Email
          </label>
          <Input
            id="contact-email"
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

      <div>
        <label htmlFor="contact-subject" className={fieldLabel}>
          Subject
        </label>
        <Input
          id="contact-subject"
          type="text"
          aria-invalid={errors.subject ? true : undefined}
          className={cn(
            "mt-2",
            errors.subject && "border-destructive focus-visible:ring-destructive",
          )}
          {...register("subject")}
        />
        {errors.subject ? (
          <p className={fieldError}>{errors.subject.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-message" className={fieldLabel}>
          Message
        </label>
        <textarea
          id="contact-message"
          rows={6}
          aria-invalid={errors.message ? true : undefined}
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

      <Button type="submit" size="lg" disabled={isSubmitting}>
        <Send aria-hidden />
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  )
}
