"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowRight, Loader2, Lock, Truck } from "lucide-react"
import { useCartStore } from "@/store/cart"
import type { Money } from "@/lib/schemas/cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  SquareCardForm,
  type SquareCardFormHandle,
} from "./square-card-form"
import { SquareWalletButtons } from "./square-wallet-buttons"
import { useSquarePayments } from "./square-payments-context"

const formSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().min(7, "Enter a valid phone number.").max(30),
  pickupMode: z.enum(["asap", "scheduled"]),
  pickupAt: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
})
type FormValues = z.infer<typeof formSchema>

const fieldLabel =
  "block text-[11px] font-medium uppercase tracking-[0.22em] text-ink-800"
const fieldError = "mt-1.5 text-xs text-destructive"

function genIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function CheckoutForm({
  promoCode,
  total,
}: {
  promoCode: string
  /** Calculated order total — enables Apple Pay / Google Pay when present. */
  total: Money | null
}) {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const clear = useCartStore((s) => s.clear)
  const cardRef = useRef<SquareCardFormHandle | null>(null)
  const { status: sdkStatus } = useSquarePayments()
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { pickupMode: "asap" },
  })

  const pickupMode = watch("pickupMode")

  /** Shared order placement — `token` comes from the card form or a wallet. */
  async function placeOrder(values: FormValues, token: string) {
    if (items.length === 0) {
      setErrorMsg("Your bag is empty.")
      return
    }
    setSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch("/api/checkout/place-order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: values.name,
            email: values.email,
            phone: values.phone,
          },
          fulfillment: {
            type: "pickup",
            pickupAt:
              values.pickupMode === "scheduled" ? values.pickupAt : "",
            notes: values.notes,
          },
          items: items.map((i) => ({
            productId: i.productId,
            variationId: i.variationId,
            qty: i.qty,
          })),
          promoCode: promoCode || undefined,
          paymentToken: token,
          idempotencyKey: genIdempotencyKey(),
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error ?? "Could not place the order.")
      }

      const orderId = data.orderId as string | undefined
      if (!orderId) {
        throw new Error("Order placed but no ID was returned.")
      }
      clear()
      router.push(`/checkout/confirmation/${orderId}`)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.")
      setSubmitting(false)
    }
  }

  async function onSubmitCard(values: FormValues) {
    if (sdkStatus !== "ready") {
      setErrorMsg("Card form is still loading — please try again in a moment.")
      return
    }
    try {
      const token = await cardRef.current!.tokenize()
      await placeOrder(values, token)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  /**
   * The wallet sheet already authorized payment when this runs; validate the
   * contact fields and place the order, or surface the field errors so the
   * customer can fix them and tap the wallet button again.
   */
  async function onWalletToken(token: string) {
    await handleSubmit(
      (values) => placeOrder(values, token),
      () => setErrorMsg("Please complete your details above first."),
    )()
  }

  // datetime-local min = now+30 minutes (rounded), max = 30 days out
  const minDateTime = (() => {
    const d = new Date(Date.now() + 30 * 60 * 1000)
    d.setSeconds(0, 0)
    return toLocalDateTimeValue(d)
  })()
  const maxDateTime = (() => {
    const d = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    return toLocalDateTimeValue(d)
  })()

  return (
    <form
      onSubmit={handleSubmit(onSubmitCard)}
      noValidate
      className="space-y-8 rounded-2xl bg-card p-7 ring-1 ring-blush-200/60 shadow-sm sm:p-9"
    >
      <Section title="Your details" subtitle="So we know who the cake is for.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ck-name" className={fieldLabel}>
              Name
            </label>
            <Input
              id="ck-name"
              type="text"
              autoComplete="name"
              className={cn(
                "mt-2",
                errors.name && "border-destructive focus-visible:ring-destructive",
              )}
              {...register("name")}
            />
            {errors.name ? <p className={fieldError}>{errors.name.message}</p> : null}
          </div>
          <div>
            <label htmlFor="ck-email" className={fieldLabel}>
              Email
            </label>
            <Input
              id="ck-email"
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
          <div className="sm:col-span-2">
            <label htmlFor="ck-phone" className={fieldLabel}>
              Phone
            </label>
            <Input
              id="ck-phone"
              type="tel"
              autoComplete="tel"
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
        </div>
      </Section>

      <Section
        title="Pickup"
        subtitle="Local delivery is currently arranged by phone — call us to schedule."
      >
        <fieldset className="space-y-3">
          <legend className="sr-only">Pickup or delivery</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="cursor-pointer rounded-xl border border-ink-800 bg-ink-800 p-4 text-left text-white">
              <span className="block font-display text-base">Pickup</span>
              <span className="mt-1 block text-xs text-white/70">
                Miami International Mall, Doral
              </span>
            </label>
            <div
              aria-disabled
              className="rounded-xl border border-blush-200 bg-blush-100/40 p-4 text-left text-muted-foreground"
            >
              <span className="inline-flex items-center gap-2">
                <Truck className="h-4 w-4" aria-hidden />
                <span className="font-display text-base">Delivery</span>
              </span>
              <span className="mt-1 block text-xs">
                Call us to arrange — coming online soon.
              </span>
            </div>
          </div>
        </fieldset>

        <div className="mt-5 grid gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-ink-800">
            <input
              type="radio"
              value="asap"
              {...register("pickupMode")}
              className="h-4 w-4 accent-ink-800"
            />
            <span>
              <span className="font-medium">ASAP</span>
              <span className="ml-2 text-muted-foreground">
                — we&rsquo;ll have it ready in about 30 minutes
              </span>
            </span>
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-ink-800">
            <input
              type="radio"
              value="scheduled"
              {...register("pickupMode")}
              className="h-4 w-4 accent-ink-800"
            />
            <span className="font-medium">Schedule a pickup time</span>
          </label>

          {pickupMode === "scheduled" ? (
            <div>
              <label htmlFor="ck-pickup-at" className={fieldLabel}>
                Pickup date &amp; time
              </label>
              <Input
                id="ck-pickup-at"
                type="datetime-local"
                min={minDateTime}
                max={maxDateTime}
                className="mt-2"
                {...register("pickupAt")}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Hours: Mon–Sat 10 AM – 9 PM · Sun 11 AM – 7 PM.
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-5">
          <label htmlFor="ck-notes" className={fieldLabel}>
            Notes <span className="text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="ck-notes"
            rows={3}
            placeholder="Special requests, allergies, decoration tweaks…"
            className="mt-2 flex w-full rounded-md border border-input bg-card px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
            {...register("notes")}
          />
        </div>
      </Section>

      <Section
        title="Payment"
        subtitle="Card information is processed by Square — we never see or store it."
      >
        <div className="space-y-5">
          <SquareWalletButtons
            total={total}
            disabled={submitting}
            onToken={onWalletToken}
          />
          <SquareCardForm ref={cardRef} />
        </div>
      </Section>

      {errorMsg ? (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMsg}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={submitting || sdkStatus !== "ready"}
        className="w-full"
      >
        {submitting ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            Placing your order…
          </>
        ) : (
          <>
            <Lock aria-hidden />
            Place order
            <ArrowRight aria-hidden />
          </>
        )}
      </Button>
    </form>
  )
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-2xl text-ink-900">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function toLocalDateTimeValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
