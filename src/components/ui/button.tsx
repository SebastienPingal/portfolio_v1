import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary/70 text-primary-foreground hover:bg-primary/80 backdrop-blur-md",
        destructive:
          "bg-destructive/90 text-destructive-foreground hover:bg-destructive/30 hover:text-foreground backdrop-blur-md",
        outline:
          "border border-input bg-background hover:bg-primary/50 hover:text-accent-foreground backdrop-blur-md",
        secondary:
          "bg-secondary/70 text-secondary-foreground hover:bg-secondary backdrop-blur-md",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        shine: "backdrop-blur-md hover:-translate-y-1 bg-primary/50 text-foreground hover:bg-primary/90 relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.4)_50%,transparent_70%)] before:translate-x-[-100%] before:animate-[shine_5s_ease-in-out_infinite_2s]",
        secondaryshine: "backdrop-blur-md hover:-translate-y-1 bg-secondary/50 text-secondary-foreground hover:bg-secondary/90 relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.4)_50%,transparent_70%)] before:translate-x-[-100%] before:animate-[shine_5s_ease-in-out_infinite_1s]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-6 rounded-md px-1",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
