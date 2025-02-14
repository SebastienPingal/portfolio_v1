import { StackExtended } from '@/types/stack'
import { VariantProps } from "class-variance-authority"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import StackCard from './StackCard'
import { Badge, badgeVariants } from './ui/badge'
import { cn } from '@/lib/utils'

const StackBadge = ({ stack, variant, className, session }: {
  stack: StackExtended,
  variant?: VariantProps<typeof badgeVariants>["variant"],
  className?: string
  session: any
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={cn("cursor-default", className)} variant={variant}>
            {stack.title}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <StackCard stack={stack} tooltiped={true} session={session} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default StackBadge