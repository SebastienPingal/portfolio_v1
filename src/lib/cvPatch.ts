export interface CVPatch {
  title?: string
  subtitle?: string
  about?: string
  coreKeywords?: string[]
  atsKeywords?: string[]
  skillsPriority?: string[]
  experienceTweaks?: Array<{
    place: string
    addBullets?: string[]
  }>
}

export function buildPrompt(args: {
  jobOfferText: string
  cvSnapshot: unknown
}) {
  const yearsOfExperience = 4

  return [
    {
      role: "system",
      content:
        "You are an ATS optimization engine for a French CV. Output MUST be valid JSON only, matching the schema provided. No markdown, no comments. Never fabricate experience, companies, dates, metrics. Only rephrase existing content and prioritize keywords from the job offer. Keep French.",
    },
    {
      role: "user",
      content: JSON.stringify(
        {
          schema: {
            title: "string (optional)",
            subtitle: "string (optional)",
            about: "string (optional)",
            coreKeywords: "string[] (optional, max 40)",
            atsKeywords: "string[] (optional, max 30)",
            skillsPriority: "string[] (optional)",
            experienceTweaks:
              "Array<{ place: string; addBullets?: string[] }> (optional, max 6 tweaks, addBullets: max 6 strings each 2-160 chars)",
          },
          jobOfferText: args.jobOfferText,
          currentCV: args.cvSnapshot,
          constraints: {
            titleStyle:
              "Use common ATS job titles (e.g. 'Frontend React Developer', 'Backend Node.js Developer', 'Full Stack JavaScript Developer').",
            subtitleStyle:
              "Use dot separators ' · ' and only technologies present in currentCV OR explicitly in jobOfferText.",
            aboutStyle:
              "1 paragraph, dense keywords, French, highlight relevant stacks and responsibilities from currentCV.",
            keywordsStyle:
              "Put the job's most important keywords first. Prefer exact spellings from jobOfferText when possible.",
            ...(yearsOfExperience != null && {
              yearsOfExperienceConstraint: `CRITICAL: yearsOfExperience is ${yearsOfExperience}. In the about section, ALWAYS state exactly "${yearsOfExperience} ans" (or "${yearsOfExperience} années") for software development experience. Do NOT infer or modify years of experience. Use format: "Expérience professionnelle totale : X ans (dont ${yearsOfExperience} ans en développement logiciel)" when mentioning total experience. Never write 5, 6, 7, 8, 9, 10+ years for development experience.`,
            }),
          },
        },
        null,
        0,
      ),
    },
  ] as const
}

function isStringArray(
  value: unknown,
  options?: { max?: number; minLen?: number; maxLen?: number },
): value is string[] {
  if (!Array.isArray(value)) return false
  if (options?.max != null && value.length > options.max) return false
  return value.every((item) => {
    if (typeof item !== "string") return false
    if (options?.minLen != null && item.length < options.minLen) return false
    if (options?.maxLen != null && item.length > options.maxLen) return false
    return true
  })
}

export function parseAndValidateCVPatch(input: unknown): CVPatch {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Patch must be an object")
  }

  const patch = input as Record<string, unknown>
  const out: CVPatch = {}

  if (patch.title !== undefined) {
    if (typeof patch.title !== "string" || patch.title.length < 3 || patch.title.length > 80) {
      throw new Error("Invalid patch.title")
    }
    out.title = patch.title
  }

  if (patch.subtitle !== undefined) {
    if (typeof patch.subtitle !== "string" || patch.subtitle.length < 3 || patch.subtitle.length > 120) {
      throw new Error("Invalid patch.subtitle")
    }
    out.subtitle = patch.subtitle
  }

  if (patch.about !== undefined) {
    if (typeof patch.about !== "string" || patch.about.length < 50 || patch.about.length > 900) {
      throw new Error("Invalid patch.about")
    }
    out.about = patch.about
  }

  if (patch.coreKeywords !== undefined) {
    if (!isStringArray(patch.coreKeywords, { max: 40, minLen: 2, maxLen: 60 })) {
      throw new Error("Invalid patch.coreKeywords")
    }
    out.coreKeywords = patch.coreKeywords
  }

  if (patch.atsKeywords !== undefined) {
    if (!isStringArray(patch.atsKeywords, { max: 30, minLen: 2, maxLen: 60 })) {
      throw new Error("Invalid patch.atsKeywords")
    }
    out.atsKeywords = patch.atsKeywords
  }

  if (patch.skillsPriority !== undefined) {
    if (!isStringArray(patch.skillsPriority, { max: 80, minLen: 2, maxLen: 60 })) {
      throw new Error("Invalid patch.skillsPriority")
    }
    out.skillsPriority = patch.skillsPriority
  }

  if (patch.experienceTweaks !== undefined && patch.experienceTweaks !== null) {
    if (!Array.isArray(patch.experienceTweaks)) {
      // LLM sometimes returns null/object; skip invalid experienceTweaks
      console.warn(
        "⚠️ Skipping invalid patch.experienceTweaks: expected array, got",
        typeof patch.experienceTweaks,
      )
    } else {
      const rawTweaks = patch.experienceTweaks.slice(0, 6)
      if (patch.experienceTweaks.length > 6) {
        console.warn(
          `⚠️ Truncating patch.experienceTweaks from ${patch.experienceTweaks.length} to 6`,
        )
      }

      const tweaks: NonNullable<CVPatch["experienceTweaks"]> = []
      for (const tweak of rawTweaks) {
        if (!tweak || typeof tweak !== "object" || Array.isArray(tweak)) {
          throw new Error("Invalid experience tweak entry")
        }

        const item = tweak as Record<string, unknown>
        if (typeof item.place !== "string" || item.place.length < 1 || item.place.length > 80) {
          throw new Error("Invalid experience tweak place")
        }

        const cleanTweak: NonNullable<CVPatch["experienceTweaks"]>[number] = {
          place: item.place,
        }

        if (item.addBullets !== undefined && item.addBullets !== null) {
          if (!Array.isArray(item.addBullets)) {
            console.warn("⚠️ Skipping invalid addBullets: expected array")
          } else {
            const valid = item.addBullets
              .filter((b): b is string => typeof b === "string")
              .map((s) => s.trim())
              .filter((s) => s.length >= 2 && s.length <= 160)
              .slice(0, 6)
            if (valid.length > 0) cleanTweak.addBullets = valid
          }
        }

        tweaks.push(cleanTweak)
      }
      out.experienceTweaks = tweaks
    }
  }

  return out
}

export function parseLLMJson(raw: string): unknown {
  const responseText = raw.trim()
  const jsonMatch = responseText.match(/```(?:json)?([\s\S]*?)```/)
  const textToParse = jsonMatch ? jsonMatch[1].trim() : responseText
  return JSON.parse(textToParse)
}

export function applyCVPatch<T extends Record<string, any>>(
  base: T,
  patch: CVPatch,
): T {
  const out: Record<string, any> = structuredClone(base)

  if (patch.title) out["title"] = patch.title
  if (patch.subtitle) out["subtitle"] = patch.subtitle
  if (patch.about) out["about"] = patch.about
  if (patch.coreKeywords) out["coreKeywords"] = patch.coreKeywords
  if (patch.atsKeywords) out["atsKeywords"] = patch.atsKeywords

  // Reorder skills by priority (non-destructive).
  if (patch.skillsPriority?.length && out.skills?.stack) {
    const priority = new Map(
      patch.skillsPriority.map((s, i) => [s.toLowerCase(), i]),
    )
    for (const group of out.skills.stack) {
      group.sort((a: any, b: any) => {
        const ai = priority.get(String(a.name).toLowerCase())
        const bi = priority.get(String(b.name).toLowerCase())
        if (ai == null && bi == null) return 0
        if (ai == null) return 1
        if (bi == null) return -1
        return ai - bi
      })
    }
  }

  // Inject small bullets into matching experiences.
  if (patch.experienceTweaks?.length && Array.isArray(out.experience)) {
    for (const tweak of patch.experienceTweaks) {
      const exp = out.experience.find((e: any) => e.place === tweak.place)
      if (!exp || !tweak.addBullets?.length) continue

      const existing = new Set(
        (exp.description ?? []).map((s: string) => s.trim()),
      )

      for (const b of tweak.addBullets) {
        const clean = `* ${b}`.trim()
        if (!existing.has(clean)) {
          exp.description = [...(exp.description ?? []), clean]
        }
      }
    }
  }

  return out as T
}
