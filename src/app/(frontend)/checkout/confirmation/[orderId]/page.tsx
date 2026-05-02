import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { getSquareClient } from "@/lib/square/client"
import { withSquare } from "@/lib/square/errors"
import { Button } from "@/components/ui/button"
import { OrderDetails } from "@/components/order/order-details"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Thank you for your order — Delicatessen by Janis.",
  robots: { index: false, follow: false },
}

async function getOrder(orderId: string) {
  return withSquare("orders.get.confirmation", async () => {
    const client = getSquareClient()
    const resp = await client.orders.get({ orderId })
    return resp.order ?? null
  })
}

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params

  let order
  try {
    order = await getOrder(orderId)
  } catch (err) {
    console.error("[confirmation] failed:", err)
    order = null
  }

  if (!order) {
    return (
      <Shell>
        <p className="font-display text-3xl text-ink-900">
          Order not found.
        </p>
        <p className="mt-2 text-muted-foreground">
          We couldn&rsquo;t locate that order — please check your email for the
          confirmation, or reach out to us.
        </p>
        <Button asChild size="md" className="mt-6">
          <Link href="/contact">Contact us</Link>
        </Button>
      </Shell>
    )
  }

  const recipient =
    order.fulfillments?.[0]?.pickupDetails?.recipient ??
    order.fulfillments?.[0]?.deliveryDetails?.recipient
  const firstName = recipient?.displayName?.split(/\s+/)[0]

  return (
    <Shell>
      <div className="flex flex-col items-start gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-blush-100 text-brass-600">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </span>
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
            <span className="h-px w-6 bg-brass-500" aria-hidden />
            Order confirmed
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-ink-900 sm:text-5xl">
            Thank you,
            <span className="italic text-ink-800">
              {firstName ? ` ${firstName}` : ""}.
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
            We&rsquo;ve received your order — a confirmation will be on its way
            to your inbox shortly. Order ID:{" "}
            <span className="font-mono text-ink-800">{orderId}</span>
          </p>
        </div>
      </div>

      <div className="mt-10">
        <OrderDetails order={order} />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href={`/order/${encodeURIComponent(orderId)}`}>Track this order</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/shop">Keep shopping</Link>
        </Button>
        <Button asChild size="lg" variant="ghost">
          <Link href="/contact">Need to make a change?</Link>
        </Button>
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-sugar-100 pb-20 pt-12 sm:pb-24 sm:pt-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}
