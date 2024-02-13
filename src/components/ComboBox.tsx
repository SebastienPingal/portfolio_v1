import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/command'
import { ChevronsUpDown, Check } from "lucide-react"
import { Stack } from "@prisma/client"
import { cn } from "@/lib/utils"

const ComboBox = ({ stacks, selectedStacks, setSelectedStacks } : {stacks: Stack[], selectedStacks: Stack[], setSelectedStacks: (stacks: Stack[]) => void}) => {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          Add a tech to the stack
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search stack..." />
          <CommandEmpty>No stack found.</CommandEmpty>
          <CommandGroup>
            {stacks.map((stack) => (
              <CommandItem
                key={stack.title}
                value={stack.title}
                onSelect={() => {
                  setSelectedStacks(selectedStacks.includes(stack) ?
                    selectedStacks.filter((s) => s !== stack)
                    : [...selectedStacks, stack])
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedStacks.includes(stack) ? "opacity-100" : "opacity-0"
                  )}
                />
                {stack.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default ComboBox