"use client"

import React, { useState } from "react"
import { MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent
} from "@/components/ui/dropdown-menu"
import Navbar from "@/components/NavBar"
import { Post, ExternalLink } from "@prisma/client"

interface MobileNavMenuProps {
  workPosts: Post[]
  blogPosts: Post[]
  externalLinks: ExternalLink[]
}

const MobileNavMenu = ({ workPosts, blogPosts, externalLinks }: MobileNavMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)

  // Handle click on any navigation item
  const handleNavItemClick = () => {
    setIsOpen(false)
  }

  return (
    <div className="sm:hidden z-20 w-full fixed backdrop-blur-md bottom-0 left-0">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className="h-10 w-full" asChild>
          <Button className="w-full rounded-none" asChild>
            <p>
              <MenuIcon /><span>Menu</span>
            </p>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={0}>
          <div onClick={handleNavItemClick}>
            <Navbar 
              workPosts={workPosts} 
              blogPosts={blogPosts} 
              externalLinks={externalLinks} 
              className="w-screen" 
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default MobileNavMenu 