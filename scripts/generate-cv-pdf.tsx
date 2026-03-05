#!/usr/bin/env tsx
/**
 * Generates static CV PDFs into public/ at build time.
 * Fonts and images are resolved to absolute fs paths so
 * @react-pdf/renderer can access them in a Node.js environment.
 *
 * Usage: pnpm run generate-cv-pdf
 */
import React from "react"
import { renderToFile, Font } from "@react-pdf/renderer"
import path from "path"
import fs from "fs"

import { CVPdfDocument } from "../src/lib/pdf/CVPdfDocument"
import { englishCV } from "../public/json/my-cv-en"
import { frenchCV } from "../public/json/my-cv-fr"
import { CVData } from "../src/types/CV"

const ROOT = process.cwd()
const PUBLIC = path.resolve(ROOT, "public")

// CVPdfDocument registers "Cereal" with web paths (/fonts/...) at module-load time.
// Those paths are invalid in Node.js — delete only that family so built-in fonts
// (Helvetica, Courier, Times) are preserved, then re-register with absolute fs paths.
delete (Font.getRegisteredFonts() as Record<string, unknown>)["Cereal"]
Font.register({
  family: "Cereal",
  fonts: [
    {
      src: path.join(PUBLIC, "fonts/AirbnbCereal_W_Md.otf"),
      fontWeight: "normal",
      fontStyle: "normal",
    },
    {
      src: path.join(PUBLIC, "fonts/AirbnbCereal_W_Bd.otf"),
      fontWeight: "bold",
      fontStyle: "normal",
    },
    {
      src: path.join(PUBLIC, "fonts/AirbnbCereal_W_Lt.otf"),
      fontWeight: "light",
      fontStyle: "normal",
    },
    {
      src: path.join(PUBLIC, "fonts/AirbnbCereal_W_XBd.otf"),
      fontWeight: "ultrabold",
      fontStyle: "normal",
    },
  ],
})

/** Convert a public-relative web path (e.g. /img/foo.jpg) to an absolute fs path. */
function toAbsPath(webPath: string | undefined): string | undefined {
  if (!webPath) return undefined
  return path.join(PUBLIC, webPath.replace(/^\//, ""))
}

/** Replace all image paths in a CVData object with absolute fs paths. */
function resolveImagePaths(data: CVData): CVData {
  return {
    ...data,
    profileImage: toAbsPath(data.profileImage),
    profileImagePdf: toAbsPath(data.profileImagePdf),
    profileImageDark: toAbsPath(data.profileImageDark),
    profileImageDarkPdf: toAbsPath(data.profileImageDarkPdf),
  }
}

async function main() {
  const variants: Array<{ data: CVData; language: string; filename: string }> = [
    {
      data: resolveImagePaths(englishCV),
      language: "en",
      filename: "cv-sebastien-pingal-en.pdf",
    },
    {
      data: resolveImagePaths(frenchCV),
      language: "fr",
      filename: "cv-sebastien-pingal-fr.pdf",
    },
  ]

  for (const { data, language, filename } of variants) {
    const outputPath = path.join(PUBLIC, filename)

    console.log(`📄 Generating ${filename}...`)

    await renderToFile(
      <CVPdfDocument data={data} language={language} theme="light" />,
      outputPath,
    )

    const sizeKb = (fs.statSync(outputPath).size / 1024).toFixed(0)
    console.log(`✅ ${filename} (${sizeKb} KB) → ${outputPath}`)
  }
}

main().catch((err) => {
  console.error("❌ PDF generation failed:", err)
  process.exit(1)
})
