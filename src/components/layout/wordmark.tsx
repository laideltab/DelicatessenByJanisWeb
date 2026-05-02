import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface WordmarkProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizes = {
  sm: { whisk: "h-7", wordmark: "h-7", gap: "gap-2.5" },
  md: { whisk: "h-10", wordmark: "h-11", gap: "gap-3" },
  lg: { whisk: "h-16", wordmark: "h-[4.5rem]", gap: "gap-5" },
} as const

const WHISK_RATIO = 1080 / 592.94
const WORDMARK_RATIO = 1313.27 / 383.53

export function Wordmark({ className, size = "md" }: WordmarkProps) {
  const s = sizes[size]
  return (
    <Link
      href="/"
      aria-label="Delicatessen by Janis — home"
      className={cn("inline-flex items-center", s.gap, className)}
    >
      <Image
        src="/brand/whisk.svg"
        alt=""
        aria-hidden
        width={1080}
        height={593}
        priority
        className={cn("w-auto", s.whisk)}
      />
      <Image
        src="/brand/wordmark.svg"
        alt="Delicatessen by Janis"
        width={1314}
        height={384}
        priority
        className={cn("w-auto", s.wordmark)}
      />
    </Link>
  )
}

export const WordmarkRatios = { WHISK_RATIO, WORDMARK_RATIO }
