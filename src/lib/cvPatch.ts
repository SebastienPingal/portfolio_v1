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

  const normalizedTokens = normalized.split(/\s+/).filter(Boolean)
  if (normalizedTokens.length > 0) {
    for (const [candidate, index] of priority.entries()) {
      const candidateTokens = candidate.split(/\s+/).filter(Boolean)
      if (candidateTokens.length === 0) continue

      const candidateFitsSkill = candidateTokens.every((token) =>
        normalizedTokens.includes(token),
      )
      const skillFitsCandidate = normalizedTokens.every((token) =>
        candidateTokens.includes(token),
      )

      if (candidateFitsSkill || skillFitsCandidate) {
        return index
      }
    }
  }

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

function countWords(value: string): number {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length
}

function sanitizeAbout(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined

  const singleParagraph = value.replace(/\s*\n+\s*/g, " ").replace(/\s+/g, " ").trim()
  if (singleParagraph.length < 8) return undefined

  const limitedWords = singleParagraph
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 60)
    .join(" ")

  if (limitedWords.length <= 320) return limitedWords

  const trimmedToChars = limitedWords.slice(0, 320)
  const lastSpaceIndex = trimmedToChars.lastIndexOf(" ")
  const safeValue = (lastSpaceIndex > 0
    ? trimmedToChars.slice(0, lastSpaceIndex)
    : trimmedToChars).trim()

  return safeValue.length >= 8 ? safeValue : undefined
}

export function buildPrompt(args: {
  jobOfferText: string
  cvSnapshot: unknown
}) {
  const yearsOfExperience = 5

  return [
    {
      role: "system",
      content:
        "You are an ATS optimization engine for a French CV. Output MUST be valid JSON only, matching the schema provided. No markdown, no comments. Never fabricate experience, companies, dates, metrics. Only rephrase existing content and prioritize keywords from the job offer. Hard skills have the highest ATS impact: prioritize exact hard-skill wording from the job offer whenever it is truthfully supported by the current CV, and favor the skills that appear most often or most explicitly in the job offer. Keep French.",
    },
    {
      role: "user",
      content: JSON.stringify(
        {
          schema: {
            title: "string (optional)",
            subtitle: "string (optional)",
            about: "string (optional, max 60 words)",
            coreSkills:
              "string[] (optional, max 12 items, hard-skill ATS keywords supported by currentCV and the job offer; use the exact wording from the job offer whenever it truthfully matches existing experience/skills)",
            skillsPriority: "string[] (optional, ordered by ATS importance; prioritize hard skills repeated in the job offer, and prefer the job-offer spelling when it clearly maps to an existing technical skill in currentCV.skills.stack)",
            otherSkillsPriority: "string[] (optional, ordered by ATS importance; prioritize hard skills repeated in the job offer, and prefer the job-offer spelling when it clearly maps to an existing skill in currentCV.skills.other)",
            experienceTweaks:
              "Array<{ place: string; addBullets?: string[] }> (optional, max 4 tweaks, addBullets: max 1 string each 2-160 chars)",
          },
          jobOfferText: args.jobOfferText,
          currentCV: args.cvSnapshot,
          constraints: {
            titleStyle:
              "Use common ATS job titles (e.g. 'Frontend React Developer', 'Backend Node.js Developer', 'Full Stack JavaScript Developer').",
            subtitleStyle:
              "Use dot separators ' · '. Keep it short, technical, and biased toward hard skills with the highest ATS impact. Prioritize technologies repeated in the job offer. When a supported skill appears in the job offer, prefer the exact job-offer spelling in the subtitle.",
            aboutStyle:
              "Write exactly 1 paragraph in French, maximum 60 words. Maximize ATS impact with precise role keywords, strongest relevant stacks, business/domain context, and core responsibilities grounded in currentCV. Be concise, credible, and avoid filler.",
            coreSkillsStyle:
              "The CV has a visible 'Compétences clés' section near the top. This section should focus on hard skills because they have the highest ATS impact. Return only concise ATS-friendly hard-skill keywords or role keywords that are clearly relevant to the job offer and supported by currentCV. Prioritize the hard skills that appear most frequently or most explicitly in the job offer. Match the exact job-offer spelling whenever it is truthful and supported. Remove weakly related, generic, or soft-skill keywords even if they exist in the current CV. It is better to return fewer keywords than to keep irrelevant ones. Do not invent unsupported tools, certifications, seniority, or responsibilities.",
            skillsStyle:
              "The CV has a visible 'Compétences techniques' section. Reorder existing skills to make that section fit the job offer better. Rank skills by ATS relevance, with repeated hard skills from the job offer first. Prefer frameworks, backend, database, cloud, testing, and product skills explicitly required by the job. Do not invent new skills: every returned item must clearly map to an existing skill in currentCV.skills.stack/currentCV.skills.other, even if you use the exact job-offer spelling.",
            experienceTweaksStyle:
              "Use experienceTweaks sparingly. Prefer 0 tweaks. Add a bullet only when it clearly improves ATS relevance for an important hard-skill or responsibility requirement in the job offer that is already truthfully supported by currentCV, but not explicit enough in the current experience bullets. When helpful, mirror the exact job-offer wording for the relevant hard skill or responsibility. Never restate information already obvious elsewhere in the CV. Add at most 1 bullet per experience and target at most 4 experiences total.",
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

function sanitizeStringList(
  value: unknown,
  options?: { max?: number; minLen?: number; maxLen?: number },
): string[] {
  if (!Array.isArray(value)) return []

  const seen = new Set<string>()
  const out: string[] = []

  for (const item of value) {
    if (typeof item !== "string") continue

    const cleaned = item.replace(/\s+/g, " ").trim()
    if (!cleaned) continue
    if (options?.minLen != null && cleaned.length < options.minLen) continue
    if (options?.maxLen != null && cleaned.length > options.maxLen) continue

    const dedupeKey = cleaned.toLowerCase()
    if (seen.has(dedupeKey)) continue
    seen.add(dedupeKey)
    out.push(cleaned)

    if (options?.max != null && out.length >= options.max) break
  }

  return out
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
    const about = sanitizeAbout(patch.about)
    if (!about) {
      console.warn("⚠️ Skipping invalid patch.about")
    } else {
      if (countWords(about) > 60 || about.length > 320) {
        console.warn("⚠️ Skipping invalid patch.about after sanitization")
      } else {
        out.about = about
      }
    }
  }

  if (patch.coreSkills !== undefined) {
    const coreSkills = sanitizeStringList(patch.coreSkills, {
      max: 12,
      minLen: 2,
      maxLen: 50,
    })
    if (coreSkills.length === 0) {
      console.warn("⚠️ Skipping invalid patch.coreSkills")
    } else {
      out.coreSkills = coreSkills
    }
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
      const rawTweaks = patch.experienceTweaks.slice(0, 2)
      if (patch.experienceTweaks.length > 2) {
        console.warn(
          `⚠️ Truncating patch.experienceTweaks from ${patch.experienceTweaks.length} to 2`,
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
              .slice(0, 1)
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

  if (patch.subtitle) {
    out["subtitle"] = patch.subtitle
  } else if (patch.skillsPriority?.length && out.skills?.stack) {
    const derivedSubtitle = buildSubtitleFromPrioritizedSkills(
      out.skills.stack,
      patch.skillsPriority,
      out.subtitle,
    )
    if (derivedSubtitle) out["subtitle"] = derivedSubtitle
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
