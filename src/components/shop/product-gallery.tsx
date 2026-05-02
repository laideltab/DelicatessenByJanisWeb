"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-blush-100">
        <span className="font-display text-7xl text-blush-200">
          {productName.charAt(0)}
        </span>
      </div>
    )
  }

  const main = images[active] ?? images[0]

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-blush-100">
        <Image
          src={main}
          alt={productName}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 ? (
        <ul
          aria-label={`${productName} gallery`}
          className="grid grid-cols-5 gap-2 sm:gap-3"
        >
          {images.map((src, i) => {
            const isActive = i === active
            return (
              <li key={`${src}-${i}`}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-pressed={isActive}
                  className={cn(
                    "relative block aspect-square w-full overflow-hidden rounded-lg bg-blush-100 ring-1 ring-blush-100 transition",
                    isActive
                      ? "ring-2 ring-ink-800"
                      : "hover:ring-2 hover:ring-blush-200",
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
