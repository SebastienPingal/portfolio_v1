import type { Metadata } from "next"
import { cereal } from './font'
import "./globals.css"

import SessionProvider from "./SessionProvider"
import { ThemeProvider } from "./theme-provider"

import Navbar from "@/components/NavBar"
import PerlinBackground from "@/components/perlinBackground.jsx"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Toaster } from "@/components/ui/toaster"

import { MenuIcon } from "lucide-react"
import { getPosts } from "./actions"

export const metadata: Metadata = {
  title: "Sébastien Pingal",
  description: "This is the website of Sébastien Pingal the developer fullstack and designer",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const workPosts = await getPosts("WORK")
  const blogPosts = await getPosts("BLOGPOST")
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={[cereal.className, "flex flex-col sm:flex-row w-screen h-screen overflow-hidden"].join(" ")}>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
        >
          <SessionProvider>

            <div className="sm:hidden z-20 w-full fixed backdrop-blur-md">
              <DropdownMenu>
                <DropdownMenuTrigger className="h-10 w-full" asChild >
                  <Button className="w-full rounded-none" asChild>
                    <MenuIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={0}>
                  <Navbar workPosts={workPosts} blogPosts={blogPosts} className="w-screen" />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Navbar workPosts={workPosts} blogPosts={blogPosts} className="hidden sm:flex" />

            <main className="flex-1 page z-10 max-w-4xl sm:mx-auto p-3 sm:p-8 overflow-auto pt-16 sm:pt-8">
              {children}
            </main>

            <PerlinBackground />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
