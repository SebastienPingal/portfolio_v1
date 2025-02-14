import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        glow: "border-transparent bg-gradient-to-r from-secondary via-white to-secondary bg-[length:200%_100%] bg-clip-text text-transparent font-bold",
        secondaryshine: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.4)_50%,transparent_80%)] before:translate-x-[-100%] before:animate-[shine_5s_ease-in-out_infinite]",
        shine: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.4)_50%,transparent_80%)] before:translate-x-[-100%] before:animate-[shine_5s_ease-in-out_infinite]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
