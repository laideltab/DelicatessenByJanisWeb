import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getSquareClient } from "@/lib/square/client"
import { withSquare } from "@/lib/square/errors"
import { Button } from "@/components/ui/button"
import { OrderDetails } from "@/components/order/order-details"

// On-demand revalidation only — the Square webhook calls revalidatePath when
// the order or its fulfillment state changes.
export const revalidate = 3600

export const metadata: Metadata = {
  title: "Your Order",
  description: "Check the status of your order — Delicatessen by Janis.",
  robots: { index: false, follow: false },
}

async function getOrder(orderId: string) {
  return withSquare("orders.get.status", async () => {
    const client = getSquareClient()
    const resp = await client.orders.get({ orderId })
    return resp.order ?? null
  })
}

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params

  let order
  try {
    order = await getOrder(orderId)
  } catch (err) {
    console.error("[order-status] failed:", err)
    order = null
  }

  return (
    <section className="bg-sugar-100 pb-20 pt-12 sm:pb-24 sm:pt-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
          <span className="h-px w-6 bg-brass-500" aria-hidden />
          Your order
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-ink-900 sm:text-5xl">
          Order <span className="italic text-ink-800">status.</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          ID: <span className="font-mono text-ink-800">{orderId}</span>
        </p>

        <div className="mt-10">
          {order ? (
            <OrderDetails order={order} />
          ) : (
            <div className="rounded-2xl bg-card p-10 text-center ring-1 ring-blush-200/60">
              <p className="font-display text-2xl text-ink-900">
                We couldn&rsquo;t find that order.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                The link may be incorrect, or the order may have been placed in
                a different environment. Reach out and we&rsquo;ll help you
                track it down.
              </p>
              <Button asChild size="md" className="mt-6">
                <Link href="/contact">
                  Contact us
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {order ? (
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="outline">
              <Link href="/shop">Keep shopping</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/contact">Need help?</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
