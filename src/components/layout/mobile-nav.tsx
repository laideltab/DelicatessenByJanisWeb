"use client"

import * as React from "react"
import Link from "next/link"
import * as Dialog from "@radix-ui/react-dialog"
import { Menu, X } from "lucide-react"
import { mainNav } from "./nav-config"
import { Wordmark } from "./wordmark"
import { Button } from "@/components/ui/button"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-800 hover:bg-blush-100 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-card p-6 shadow-xl data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right">
          <Dialog.Title className="sr-only">Main navigation</Dialog.Title>
          <Dialog.Description className="sr-only">
            Links to site sections
          </Dialog.Description>
          <div className="flex items-center justify-between">
            <Wordmark size="sm" />
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-800 hover:bg-blush-100"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <nav className="mt-10 flex flex-col gap-1">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 font-display text-2xl text-ink-800 hover:bg-blush-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3 pt-8">
            <Button asChild size="lg">
              <Link href="/shop" onClick={() => setOpen(false)}>
                Order now
              </Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Pickup and delivery available
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
