"use client"

import dynamic from "next/dynamic"
import React from "react"
import { BlobProvider } from "@react-pdf/renderer"
import { CVProps } from "@/types/CV"
import { ThemeType } from "./pdfTheme"
import { CVPdfDocument } from "@/lib/pdf/CVPdfDocument"

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false },
)

interface PDFDocumentProps extends CVProps {
  theme: ThemeType
}

export const PDFRenderer = ({ data, language, theme }: PDFDocumentProps) => {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)")
    const updateMobile = (event?: MediaQueryListEvent) => {
      setIsMobile(event ? event.matches : mediaQuery.matches)
    }

    updateMobile()
    mediaQuery.addEventListener("change", updateMobile)
    return () => {
      mediaQuery.removeEventListener("change", updateMobile)
    }
  }, [])

  if (isMobile) {
    const filename =
      language === "en" ? "cv-sebastien-pingal-en.pdf" : "cv-sebastien-pingal-fr.pdf"

    return (
      <BlobProvider
        document={<CVPdfDocument data={data} language={language ?? "fr"} theme={theme} />}
      >
        {({ url, loading, error }) => {
          if (loading) {
            return (
              <div className="w-full h-full rounded-xl border border-border bg-card flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Generating PDF...</p>
              </div>
            )
          }

          if (error || !url) {
            return (
              <div className="w-full h-full rounded-xl border border-destructive/40 bg-card flex items-center justify-center">
                <p className="text-sm text-destructive">
                  Unable to generate the PDF on this device.
                </p>
              </div>
            )
          }

          return (
            <div className="w-full h-full rounded-xl border border-border bg-card flex flex-col items-center justify-center gap-3">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground"
              >
                Open PDF
              </a>
              <a
                href={url}
                download={filename}
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-5 text-sm font-medium"
              >
                Download PDF
              </a>
            </div>
          )
        }}
      </BlobProvider>
    )
  }

  return (
    <PDFViewer width="100%" height="100%">
      <CVPdfDocument data={data} language={language ?? "fr"} theme={theme} />
    </PDFViewer>
  )
}

export const PDFDocumentRenderer = ({
  data,
  language,
  theme,
}: PDFDocumentProps) => {
  return <CVPdfDocument data={data} language={language ?? "fr"} theme={theme} />
}

