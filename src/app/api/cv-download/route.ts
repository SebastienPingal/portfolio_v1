import { NextRequest } from "next/server"
import React from "react"
import { pdf } from "@react-pdf/renderer"
import { englishCV } from "../../../../public/json/my-cv-en"
import { frenchCV } from "../../../../public/json/my-cv-fr"
import { CVPdfDocument } from "@/lib/pdf/CVPdfDocument"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get("lang") === "fr" ? "fr" : "en"
    const theme = searchParams.get("theme") === "dark" ? "dark" : "light"
    const shouldDownload = searchParams.get("download") !== "0"

    const data = language === "fr" ? frenchCV : englishCV
    const document = React.createElement(CVPdfDocument, {
      data,
      language,
      theme,
    })
    const pdfBlob = await pdf(document).toBlob()
    const pdfBytes = await pdfBlob.arrayBuffer()

    const filename =
      language === "fr" ? "cv-sebastien-pingal-fr.pdf" : "cv-sebastien-pingal-en.pdf"

    return new Response(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${shouldDownload ? "attachment" : "inline"}; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("❌ Failed to generate downloadable CV:", error)
    return Response.json(
      { error: "Failed to generate CV PDF" },
      { status: 500 },
    )
  }
}

