"use client"

import dynamic from "next/dynamic"
import React from "react"
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

