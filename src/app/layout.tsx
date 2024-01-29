import type { Metadata } from "next"
import { cereal } from './font'
import "./globals.css"

import SessionProvider from "./SessionProvider"
import { ThemeProvider } from "./theme-provider"

import Navbar from "@/components/NavBar"
import PerlinBackground from "@/components/perlinBackground.jsx"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={[cereal.className, "flex w-screen h-screen overflow-hidden"].join(" ")}>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <SessionProvider>
            <Navbar />
            <main className="flex-1 page z-10 mt-10 max-w-4xl mx-auto px-8 pt-2 overflow-auto">{children}</main>
            <PerlinBackground />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
