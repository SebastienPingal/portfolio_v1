'use client'

import { deletePost } from '@/app/actions'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Post } from '@prisma/client'
import { NotebookPen, PencilRuler, Plus, Trash } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { NavigationMenuItem, NavigationMenuLink } from './ui/navigation-menu'
import { useToast } from './ui/use-toast'

const PostSession = ({ posts, subSlug = 'post', type = 'BLOGPOST', title }: { posts: Post[], subSlug: string, type: string, title: string }) => {
  const router = useRouter()
  const pathname = usePathname()
  const session = useSession()
  const { toast } = useToast()

  const handleDelete = async (slug: string) => {
    await deletePost(slug)
    toast({
      title: 'Post deleted',
      description: 'The post has been deleted',
    })
    if (pathname === `/work/${slug}`) router.push('/')
  }


  return (
    <div className='w-full'>
      <NavigationMenuItem className="font-extrabold mb-2">
        {title}
      </NavigationMenuItem>
      {posts.map((post: Post) => (
        <NavigationMenuItem key={post.id}>
          <Link href={`/${subSlug}/${post.slug}`} className="w-full" legacyBehavior passHref>
            <NavigationMenuLink className="w-full relative">
              <NotebookPen className="w-4 h-4" />
              <p>{post.title}</p>

              {session.data && session.data.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                // div is needed to prevent the link to be triggered
                <div className="absolute right-0 flex gap-1">
                  <Link href={`/${subSlug}/edit/${post.slug}`} className="absolute right-9" legacyBehavior passHref>
                    <NavigationMenuLink className="w-full">
                      <Button variant="outline" size="sm">
                        <PencilRuler className="w-4 h-4" />
                      </Button>
                    </NavigationMenuLink>
                  </Link>
                  <div onClick={(e) => e.preventDefault()}>
                    <Popover>
                      <PopoverTrigger>
                        <Button variant="destructive" size="sm">
                          <Trash className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="flex flex-col gap-2">
                        <p>Are you sure you want to delete this post ?</p>
                        <PopoverClose className="flex gap-9 justify-center">
                          <Button onClick={() => handleDelete(post.slug)} variant="destructive">Yes</Button>
                          <Button variant="outline">No</Button>
                        </PopoverClose>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      ))}

      {session.data && session.data.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
        <NavigationMenuItem hover={false} >
          <Link href={`/${subSlug}/new?type=${type}`} className="w-full" legacyBehavior passHref>
            <NavigationMenuLink className="w-full">
              <Button variant="outline" className="w-full text-foreground">
                <Plus className="w-6 h-6" />
              </Button>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      )}
    </div>
  )
}

export default PostSession