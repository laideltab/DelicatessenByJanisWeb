import type { Metadata } from "next"
import { Breadcrumb } from "@/components/shop/breadcrumb"
import { CheckoutPanel } from "@/components/checkout/checkout-panel"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout for Delicatessen by Janis.",
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return (
    <>
      <div className="bg-sugar-100 py-10 sm:py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "Cart", href: "/cart" },
              { name: "Checkout" },
            ]}
          />
        </div>
      </div>

      <section className="bg-sugar-100 pb-20 sm:pb-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-ink-800">
              <span className="h-px w-6 bg-brass-500" aria-hidden />
              Checkout
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-ink-900 sm:text-5xl">
              One last <span className="italic text-ink-800">step.</span>
            </h1>
          </div>

          <CheckoutPanel />
        </div>
      </section>
    </>
  )
}
