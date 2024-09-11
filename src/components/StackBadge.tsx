import { StackExtended } from '@/types/stack'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import StackCard from './StackCard'
import { Badge } from './ui/badge'

const StackBadge = ({ stack }: { stack: StackExtended }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge>
            {stack.title}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <StackCard stack={stack} tooltiped={true} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default StackBadge