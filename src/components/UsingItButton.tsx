"use client"
import { Stack } from "@prisma/client"

import { Button } from "./ui/button"
import { ThumbsDown, ThumbsUp } from "lucide-react"
import { updateUser } from "@/app/actions"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "./ui/tooltip"


const UsingItButton = ({ stack, userMail, usingIt, tooltiped }: { stack: Stack, userMail: string, usingIt: boolean, tooltiped: boolean }) => {

  const router = useRouter()
  const [isUsingIt, setisUsingIt] = useState(usingIt)

  const setUsingIt = () => {
    if (isUsingIt) {
      updateUser(userMail, { stack: { disconnect: { title: stack.title } } })
      setisUsingIt(false)
    } else {
      updateUser(userMail, { stack: { connect: { title: stack.title } } })
      setisUsingIt(true)
    }
    router.refresh()
  }

  return (
    <>
      {!tooltiped ?
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" className='flex w-fit gap-3' onClick={() => { setUsingIt()}>
                {isUsingIt ? <ThumbsDown className="w-4 h-4" /> : <ThumbsUp className="w-4 h-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="p-1 glassPanel bg-secondary/50">
              {isUsingIt ? "I'm not using it" : "I'm using it"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        : <Button variant="secondary" className='flex w-fit gap-3' onClick={() => { setUsingIt()}>
          {isUsingIt ?
            <div className="flex gap-2 items-center">
              <ThumbsDown className="w-4 h-4" />
              <p className="text-xs">I&apos;m not using it</p>
            </div>
            : <div className="flex gap-2 items-center">
              <ThumbsUp className="w-4 h-4" />
              <p className="text-xs">I&apos;m using it</p>
            </div>
          }
        </Button>
      }
    </>
  )
}

export default UsingItButton