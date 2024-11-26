import { Button } from "./ui/button"
import { Trash } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "./ui/popover"
import { useToast } from "./ui/use-toast"
import { usePathname, useRouter } from "next/navigation"

export default function DeleteConfirmationPopover({ entity, id, className, deleteAction }: { entity: string, id: string, className?: string, deleteAction: (id: string) => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    await deleteAction(id)
    toast({
      title: `${entity} deleted`,
      description: `${entity} has been deleted`,
    })
    if (pathname === `/${entity}/${id}`) router.push('/')
    else router.refresh()
  }

  return (
    <div onClick={(e) => e.preventDefault()} className={className}>
      <Popover>
        <PopoverTrigger>
          <Button variant="destructive" size="sm">
            <Trash className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2">
          <p>Are you sure you want to delete this {entity} ?</p>
          <PopoverClose className="flex gap-9 justify-center">
            <Button onClick={handleDelete} variant="destructive">Yes</Button>
            <Button variant="outline">No</Button>
          </PopoverClose>
        </PopoverContent>
      </Popover>
    </div>
  )
}
