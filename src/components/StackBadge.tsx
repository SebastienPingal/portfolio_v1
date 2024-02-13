import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { Stack } from '@prisma/client'
import StackCard from './StackCard'
import { Badge } from './ui/badge'

const StackBadge = ({ stack }: { stack: Stack }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge>
            {stack.title}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <StackCard stack={stack} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default StackBadge