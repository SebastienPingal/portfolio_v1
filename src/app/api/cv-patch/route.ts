import { NextResponse } from "next/server"
import OpenAI from "openai"
import {
  buildPrompt,
  parseAndValidateCVPatch,
  parseLLMJson,
} from "@/lib/cvPatch"

export const maxDuration = 60
export const runtime = "nodejs"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const jobOfferText = String(body?.jobOfferText ?? "").trim()
    const cvSnapshot = body?.cvSnapshot

    if (!jobOfferText || jobOfferText.length < 20) {
      return NextResponse.json(
        { error: "jobOfferText must be at least 20 characters" },
        { status: 400 },
      )
    }

    if (!cvSnapshot || typeof cvSnapshot !== "object") {
      return NextResponse.json(
        { error: "cvSnapshot is required" },
        { status: 400 },
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 })
    }

    const messages = buildPrompt({ jobOfferText, cvSnapshot })

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    })

    const raw = completion.choices[0]?.message?.content?.trim()
    if (!raw) {
      return NextResponse.json(
        { error: "Empty model response" },
        { status: 502 },
      )
    }

    const parsed = parseLLMJson(raw)
    const patch = parseAndValidateCVPatch(parsed)
    return NextResponse.json({ patch })
  } catch (error) {
    console.error("❌ Error generating CV patch:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate CV patch",
      },
      { status: 500 },
    )
  }
}
