"use client"

import React from "react"
import { useLocale } from "next-intl"
import { useTheme } from "next-themes"

import { PDFRenderer } from "@/components/PDFRenderer"
import { englishCV as cvEn } from "../../../public/json/my-cv-en"
import { frenchCV as cvFr } from "../../../public/json/my-cv-fr"

const CVAtsPreview = () => {
  const locale = useLocale()
  const { theme } = useTheme()
  const data = locale === "en" ? cvEn : cvFr

  return (
    <div className="w-full h-screen">
      <PDFRenderer
        data={data}
        language={locale}
        theme={theme === "light" ? "light" : "dark"}
        variant="ats"
      />
    </div>
  )
}

export default CVAtsPreview
