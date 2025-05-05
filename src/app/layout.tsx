// Next.js and React imports
import type { Metadata } from "next"
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

// Local styles and fonts
import "./globals.css"
import { cereal } from './font'

// Local providers
import SessionProvider from "./SessionProvider"
import { ThemeProvider } from "./theme-provider"

// Components
import Navbar from "@/components/NavBar"
import MobileNavMenu from "@/components/MobileNavMenu"
import PerlinBackground from "@/components/perlinBackground.jsx"
import { Toaster } from "@/components/ui/toaster"


// Actions
import { getPosts, getExternalLinks } from "./actions"
import ThemeToggler from "@/components/ThemeToggler"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import PageTransition from "@/components/PageTransition"
import Head from "next/head"

export const metadata: Metadata = {
  title: "Sébastien Pingal",
  description: "This is the website of Sébastien Pingal the developer fullstack and designer",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  const workPosts = await getPosts("WORK")
  const blogPosts = await getPosts("BLOGPOST")
  const externalLinks = await getExternalLinks()

  return (
    <html lang={locale} suppressHydrationWarning>
      <Head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="93d15f75-6182-4d42-9109-5b7d91dddd52"></script>
      </Head>
      <body className={cereal.className}>

        <NextIntlClientProvider messages={messages} locale={locale}>
          <Toaster />
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
          >
            <SessionProvider>
              <div className="min-h-screen overflow-x-hidden relative">
                {/* Desktop theme/language togglers */}
                <div className="hidden sm:flex glassPanel fixed top-10 right-10 z-30 rounded-full">
                  <ThemeToggler />
                  <LanguageSwitcher />
                </div>

                {/* Mobile theme/language togglers */}
                <div className="sm:hidden flex glassPanel fixed rounded-full z-30 bottom-16 left-1/2 -translate-x-1/2">
                  <ThemeToggler />
                  <LanguageSwitcher />
                </div>

                {/* Desktop navbar */}
                <Navbar workPosts={workPosts} blogPosts={blogPosts} externalLinks={externalLinks} className="hidden sm:flex fixed z-20 h-screen" />

                {/* Main content */}
                <main className="w-full sm:w-[calc(100vw-14rem)] p-3 sm:p-8 pb-20 sm:pb-8 sm:ml-[14rem] max-w-5xl sm:left-[calc(50%-7rem)] sm:-translate-x-1/2 relative z-10">
                  <PageTransition>
                    {children}
                  </PageTransition>
                </main>

                {/* Mobile navbar */}
                <MobileNavMenu workPosts={workPosts} blogPosts={blogPosts} externalLinks={externalLinks} />
              </div>
              <PerlinBackground className="inset-0 -z-10" />
            </SessionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
