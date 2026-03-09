export interface CVPatch {
  title?: string
  subtitle?: string
  about?: string
  coreSkills?: string[]
  skillsPriority?: string[]
  otherSkillsPriority?: string[]
  experienceTweaks?: Array<{
    place: string
    addBullets?: string[]
  }>
}

function normalizeSkillName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\.js\b/g, "")
    .replace(/\s*&\s*/g, " and ")
    .replace(/\//g, " ")
    .replace(/[^a-z0-9+]+/g, " ")
    .trim()
}

function getSkillPriorityIndex(
  skillName: string,
  priority: Map<string, number>,
): number | undefined {
  const normalized = normalizeSkillName(skillName)
  if (priority.has(normalized)) return priority.get(normalized)

  const compact = normalized.replace(/\s+/g, "")
  if (priority.has(compact)) return priority.get(compact)

  return undefined
}

function sortSkillsByPriority<T extends { name: string }>(
  skills: T[],
  priority: Map<string, number>,
): T[] {
  return [...skills].sort((a, b) => {
    const ai = getSkillPriorityIndex(String(a.name), priority)
    const bi = getSkillPriorityIndex(String(b.name), priority)
    if (ai == null && bi == null) return 0
    if (ai == null) return 1
    if (bi == null) return -1
    return ai - bi
  })
}

function buildSubtitleFromPrioritizedSkills(
  skillGroups: Array<Array<{ name: string }>>,
  skillsPriority: string[],
  fallbackSubtitle?: string,
): string | undefined {
  const existingSkills = skillGroups.flatMap((group) => group.map((skill) => skill.name))
  const existingByNormalized = new Map<string, string>()

  for (const skill of existingSkills) {
    const normalized = normalizeSkillName(skill)
    if (!existingByNormalized.has(normalized)) {
      existingByNormalized.set(normalized, skill)
    }
  }

  const picked: string[] = []
  const seen = new Set<string>()

  for (const wantedSkill of skillsPriority) {
    const normalized = normalizeSkillName(wantedSkill)
    const existing = existingByNormalized.get(normalized)
    if (!existing) continue
    if (seen.has(normalized)) continue
    seen.add(normalized)
    picked.push(existing)
    if (picked.length >= 6) break
  }

  if (picked.length < 4) {
    for (const skill of existingSkills) {
      const normalized = normalizeSkillName(skill)
      if (seen.has(normalized)) continue
      seen.add(normalized)
      picked.push(skill)
      if (picked.length >= 6) break
    }
  }

  if (picked.length > 0) {
    return picked.join(" · ")
  }

  return fallbackSubtitle
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
            coreSkills:
              "string[] (optional, max 12 items, ATS-friendly role/tech keywords supported by currentCV and the job offer)",
            skillsPriority: "string[] (optional, use exact existing technical skill names from currentCV.skills.stack)",
            otherSkillsPriority: "string[] (optional, use exact existing skill names from currentCV.skills.other)",
            experienceTweaks:
              "Array<{ place: string; addBullets?: string[] }> (optional, max 6 tweaks, addBullets: max 6 strings each 2-160 chars)",
          },
          jobOfferText: args.jobOfferText,
          currentCV: args.cvSnapshot,
          constraints: {
            titleStyle:
              "Use common ATS job titles (e.g. 'Frontend React Developer', 'Backend Node.js Developer', 'Full Stack JavaScript Developer').",
            subtitleStyle:
              "Use dot separators ' · ' and only technologies present in currentCV OR explicitly in jobOfferText. Keep it short and technical. The system may derive the final subtitle from prioritized technical skills.",
            aboutStyle:
              "1 paragraph, dense keywords, French, highlight relevant stacks and responsibilities from currentCV.",
            coreSkillsStyle:
              "The CV has a visible 'Compétences clés' section near the top. Return only concise ATS-friendly keywords that are clearly relevant to the job offer and supported by currentCV. Remove weakly related or generic keywords even if they exist in the current CV. It is better to return fewer keywords than to keep irrelevant ones. Prefer job-family keywords and real technologies already supported by currentCV. Do not invent unsupported tools, certifications, seniority, or responsibilities.",
            skillsStyle:
              "The CV has a visible 'Compétences techniques' section. Reorder existing skills to make that section fit the job offer better. Only use exact skill names already present in currentCV.skills.stack/currentCV.skills.other. Do not invent new skills. Prefer frameworks, backend, database, cloud, testing and product skills explicitly required by the job.",
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

  if (patch.coreSkills !== undefined) {
    if (!isStringArray(patch.coreSkills, { max: 12, minLen: 2, maxLen: 50 })) {
      throw new Error("Invalid patch.coreSkills")
    }
    out.coreSkills = patch.coreSkills
  }

  if (patch.skillsPriority !== undefined) {
    if (!isStringArray(patch.skillsPriority, { max: 80, minLen: 2, maxLen: 60 })) {
      throw new Error("Invalid patch.skillsPriority")
    }
    out.skillsPriority = patch.skillsPriority
  }

  if (patch.otherSkillsPriority !== undefined) {
    if (!isStringArray(patch.otherSkillsPriority, { max: 40, minLen: 2, maxLen: 60 })) {
      throw new Error("Invalid patch.otherSkillsPriority")
    }
    out.otherSkillsPriority = patch.otherSkillsPriority
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
  if (patch.about) out["about"] = patch.about
  if (patch.coreSkills?.length) {
    out["coreSkills"] = Array.from(
      new Set(
        patch.coreSkills
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    ).slice(0, 12)
  }

  // Reorder visible technical skills by job relevance.
  if (patch.skillsPriority?.length && out.skills?.stack) {
    const priority = new Map(
      patch.skillsPriority.map((s, i) => [normalizeSkillName(s), i]),
    )

    const sortedGroups = out.skills.stack.map((group: any[]) =>
      sortSkillsByPriority(group, priority),
    )

    sortedGroups.sort((a: any[], b: any[]) => {
      const aBest = a
        .map((skill) => getSkillPriorityIndex(String(skill.name), priority))
        .filter((value): value is number => value != null)
      const bBest = b
        .map((skill) => getSkillPriorityIndex(String(skill.name), priority))
        .filter((value): value is number => value != null)

      if (aBest.length === 0 && bBest.length === 0) return 0
      if (aBest.length === 0) return 1
      if (bBest.length === 0) return -1

      const aMin = Math.min(...aBest)
      const bMin = Math.min(...bBest)
      if (aMin !== bMin) return aMin - bMin

      return aBest.length - bBest.length
    })

    out.skills.stack = sortedGroups
  }

  if (patch.skillsPriority?.length && out.skills?.stack) {
    const derivedSubtitle = buildSubtitleFromPrioritizedSkills(
      out.skills.stack,
      patch.skillsPriority,
      patch.subtitle ?? out.subtitle,
    )
    if (derivedSubtitle) out["subtitle"] = derivedSubtitle
  } else if (patch.subtitle) {
    out["subtitle"] = patch.subtitle
  }

  if (patch.otherSkillsPriority?.length && out.skills?.other) {
    const priority = new Map(
      patch.otherSkillsPriority.map((s, i) => [normalizeSkillName(s), i]),
    )
    out.skills.other = sortSkillsByPriority(out.skills.other, priority)
  }

  if (!patch.otherSkillsPriority?.length && patch.skillsPriority?.length && out.skills?.other) {
    const priority = new Map(
      patch.skillsPriority.map((s, i) => [normalizeSkillName(s), i]),
    )
    out.skills.other = sortSkillsByPriority(out.skills.other, priority)
  }

  if (patch.skillsPriority?.length && out.skills?.stack) {
    const seen = new Set<string>()
    out.skills.stack = out.skills.stack.map((group: any[]) =>
      group.filter((skill) => {
        const key = normalizeSkillName(String(skill.name))
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
    )
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
