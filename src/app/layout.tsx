// Next.js and React imports
import type { Metadata } from "next"
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { headers } from 'next/headers'

// Local styles and fonts
import "./globals.css"
import { cereal, aquaRounded } from './font'

// Local providers
import SessionProvider from "./SessionProvider"
import { ThemeProvider } from "./theme-provider"
import { PaletteProvider } from "@/components/PaletteProvider"
import { AquaEffectsProvider } from "@/components/AquaEffectsProvider"
import { DEFAULT_PALETTE, paletteInitScript } from "@/lib/palette"
import { aquaEffectsInitScript } from "@/lib/aquaEffects"

// Components
import Navbar from "@/components/NavBar"
import MobileNavMenu from "@/components/MobileNavMenu"
import AdaptiveBackground from "@/components/AdaptiveBackground.jsx"
import { Toaster } from "@/components/ui/toaster"


// Actions
import { getPosts, getExternalLinks } from "./actions"
import ThemeToggler from "@/components/ThemeToggler"
import PaletteToggler from "@/components/PaletteToggler"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import PageTransition from "@/components/PageTransition"
import Script from "next/script"

const SITE_URL = "https://sebastienpingal.dev"
const SITE_DESCRIPTION = "Sébastien Pingal, développeur Full Stack TypeScript senior & UX/UI (React, Next.js, Vue.js, Node.js, PostgreSQL). Ouvert aux missions freelance."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sébastien Pingal · Développeur Full Stack TypeScript",
    template: "%s · Sébastien Pingal",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Sébastien Pingal",
    title: "Sébastien Pingal · Développeur Full Stack TypeScript",
    description: SITE_DESCRIPTION,
    images: [{ url: "/img/seb.jpeg", alt: "Sébastien Pingal" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sébastien Pingal · Développeur Full Stack TypeScript",
    description: SITE_DESCRIPTION,
    images: ["/img/seb.jpeg"],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  const headersList = await headers()
  const pathname = headersList.get("x-pathname") ?? ""
  const isIsolated = pathname.startsWith("/date-planner")

  const workPosts = isIsolated ? [] : await getPosts("WORK")
  const blogPosts = isIsolated ? [] : await getPosts("BLOGPOST")
  const externalLinks = isIsolated ? [] : await getExternalLinks()

  return (
    <html lang={locale} data-palette={DEFAULT_PALETTE} suppressHydrationWarning>
      <body className={`${cereal.className} ${aquaRounded.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: paletteInitScript + aquaEffectsInitScript }} />
        <Script defer src="https://cloud.umami.is/script.js" data-website-id="93d15f75-6182-4d42-9109-5b7d91dddd52"></Script>

        <NextIntlClientProvider messages={messages} locale={locale}>
          <Toaster />
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
          >
            <PaletteProvider>
            <AquaEffectsProvider>
            <SessionProvider>
              {isIsolated ? (
                <main className="min-h-screen w-full max-w-5xl mx-auto p-3 sm:p-8 relative z-10">
                  <PageTransition>
                    {children}
                  </PageTransition>
                </main>
              ) : (
                <div className="min-h-screen overflow-x-hidden relative">
                  {/* Desktop theme/language togglers */}
                  <div className="hidden sm:flex glassPanel fixed top-10 right-10 z-30 rounded-full">
                    <ThemeToggler />
                    <PaletteToggler />
                    <LanguageSwitcher />
                  </div>

                  {/* Mobile theme/language togglers */}
                  <div className="sm:hidden flex glassPanel fixed rounded-full z-30 bottom-16 left-1/2 -translate-x-1/2">
                    <ThemeToggler />
                    <PaletteToggler />
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
              )}
              <AdaptiveBackground className="inset-0 -z-10" defaultType="dithered" />
            </SessionProvider>
            </AquaEffectsProvider>
            </PaletteProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
