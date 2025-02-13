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
import { getPosts, getExternalLinks } from "./actions"
import GoogleTagManager from "@/components/GoogleTagManager"

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
  const externalLinks = await getExternalLinks()
  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleTagManager />
      <body className={[cereal.className, "flex flex-col sm:flex-row w-screen h-screen overflow-x-hidden relative"].join(" ")}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P42CZR92"
            height="0" width="0" style={{ display: "none", visibility: "hidden" }}>
          </iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

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
                  <Navbar workPosts={workPosts} blogPosts={blogPosts} externalLinks={externalLinks} className="w-screen" />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Navbar workPosts={workPosts} blogPosts={blogPosts} externalLinks={externalLinks} className="hidden sm:flex fixed z-20" />

            <main className="page z-10 max-w-5xl p-3 sm:p-8 pt-16 sm:pt-8 sm:ml-56">
              {children}
            </main>

            <PerlinBackground overflow-x-scroll />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
