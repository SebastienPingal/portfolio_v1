import React from "react"
import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"
import { themeColors, ThemeType } from "@/components/pdfTheme"
import { CVData } from "@/types/CV"

interface CVPdfAtsDocumentProps {
  data: CVData | null;
  language: string;
  theme: ThemeType;
}

const technicalSkillLabels: Record<"en" | "fr", string[]> = {
  en: [
    "Core",
    "Frontend",
    "Backend & Data",
    "DevOps & Testing",
    "Tools",
    "Additional",
  ],
  fr: [
    "Socle",
    "Frontend",
    "Backend & data",
    "DevOps & tests",
    "Outils",
    "Compléments",
  ],
} as const

const buildTechnicalSkillGroups = (data: CVData, language: string) => {
  const labels =
    language === "en" ? technicalSkillLabels.en : technicalSkillLabels.fr
  const stackGroups = (data.skills?.stack ?? [])
    .filter((group) => group.length > 0)
    .map((group, index) => ({
      label:
        labels[index] ??
        `${language === "en" ? "Technical Stack" : "Stack technique"} ${index + 1}`,
      skills: group.map((skill) => skill.name).filter(Boolean),
    }))

  const otherSkills = (data.skills?.other ?? [])
    .map((skill) => skill.name)
    .filter(Boolean)
  if (otherSkills.length > 0) {
    stackGroups.push({
      label: language === "en" ? "Other Skills" : "Autres compétences",
      skills: otherSkills,
    })
  }

  return stackGroups
}

type CVExperience = NonNullable<CVData["experience"]>[number];

const monthMap: Record<string, string> = {
  jan: "01",
  january: "01",
  janvier: "01",
  feb: "02",
  fev: "02",
  february: "02",
  fevrier: "02",
  mar: "03",
  march: "03",
  mars: "03",
  apr: "04",
  avr: "04",
  april: "04",
  avril: "04",
  may: "05",
  mai: "05",
  jun: "06",
  june: "06",
  juin: "06",
  jul: "07",
  july: "07",
  juillet: "07",
  aug: "08",
  aou: "08",
  august: "08",
  aout: "08",
  sep: "09",
  sept: "09",
  september: "09",
  septembre: "09",
  oct: "10",
  october: "10",
  octobre: "10",
  nov: "11",
  november: "11",
  novembre: "11",
  dec: "12",
  december: "12",
  decembre: "12",
}

const normalizeMonthToken = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()

const formatAtsPeriod = (period?: string | null) => {
  if (!period) return null

  const compact = period.replace(/\([^)]*\)/g, "").trim()
  const presentLabel = "Present"
  const normalizedCompact = normalizeMonthToken(compact)

  const normalizeYear = (value: string) => {
    if (value.length === 2) return `20${value}`
    return value
  }

  const parseDatePart = (
    input: string,
    boundary: "start" | "end" = "start",
  ): string | null => {
    const value = normalizeMonthToken(input)
    if (!value) return null

    if (value.includes("depuis ")) {
      return parseDatePart(value.replace("depuis ", ""), boundary)
    }

    if (value.includes("since ")) {
      return parseDatePart(value.replace("since ", ""), boundary)
    }

    if (
      [
        "present",
        "presently",
        "current",
        "actuel",
        "aujourd'hui",
        "maintenant",
        "en cours",
      ].includes(value)
    ) {
      return presentLabel
    }

    const slashMatch = value.match(/^(0?[1-9]|1[0-2])\/(\d{2}|\d{4})$/)
    if (slashMatch) {
      const [, rawMonth, rawYear] = slashMatch
      return `${rawMonth.padStart(2, "0")}/${normalizeYear(rawYear)}`
    }

    const isoMatch = value.match(/^(\d{4})-(0?[1-9]|1[0-2])$/)
    if (isoMatch) {
      const [, year, month] = isoMatch
      return `${month.padStart(2, "0")}/${year}`
    }

    const monthYearMatch = value.match(
      /^([a-zA-Z\u00C0-\u017F.]+)\s+(\d{4})$/,
    )
    if (monthYearMatch) {
      const [, rawMonth, year] = monthYearMatch
      const month = monthMap[normalizeMonthToken(rawMonth).replace(/\./g, "")]
      if (month) return `${month}/${year}`
    }

    const yearMatch = value.match(/^(\d{4})$/)
    if (yearMatch) {
      const [, year] = yearMatch
      const month = boundary === "end" ? "12" : "01"
      return `${month}/${year}`
    }

    return input.trim()
  }

  if (
    normalizedCompact.startsWith("depuis ") ||
    normalizedCompact.startsWith("since ")
  ) {
    const start = parseDatePart(compact, "start")
    return start ? `${start} - ${presentLabel}` : compact
  }

  const rangeParts = compact.split(/\s+-\s+/)
  if (rangeParts.length === 2) {
    const start = parseDatePart(rangeParts[0], "start")
    const end = parseDatePart(rangeParts[1], "end")
    if (start && end) return `${start} - ${end}`
  }

  return parseDatePart(compact, "start") ?? compact
}

const splitDescriptionLines = (description?: string[] | null) => {
  const lines = description ?? []
  return {
    contextLine: lines.find(
      (line) => !line.startsWith("-") && !line.startsWith("*"),
    ),
    bulletLines: lines.filter(
      (line) => line.startsWith("-") || line.startsWith("*"),
    ),
  }
}

const sanitizeBullet = (line: string) => line.replace(/^(\*|-)\s*/, "")

const dedupeStrings = (values: Array<string | null | undefined>) => {
  const seen = new Set<string>()
  const out: string[] = []

  for (const value of values) {
    const normalized = value?.trim()
    if (!normalized) continue
    const key = normalized.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(normalized)
  }

  return out
}

const formatAtsExperienceTitle = (title?: string | null) => {
  if (!title) return null

  return title
    .replace(/\s*\([^)]*\)/g, "")
    .split(" / ")[0]
    .trim()
}

const splitAtsPeriodRange = (period?: string | null) => {
  const formatted = formatAtsPeriod(period)
  if (!formatted) return { start: null, end: null }

  const [start, end] = formatted.split(/\s+-\s+/)
  return {
    start: start?.trim() || null,
    end: end?.trim() || null,
  }
}

const isPersonalProjectsExperience = (exp: CVExperience) => {
  const place = exp.place?.trim().toLowerCase()
  const title = exp.title?.trim().toLowerCase()

  const projectPlace = place === "mon bureau" || place === "my office"

  const projectTitle =
    title === "projets personnels sélectionnés" ||
    title === "selected personal projects"

  return projectPlace || projectTitle
}

export const CVPdfAtsDocument = ({
  data,
  language,
  theme,
}: CVPdfAtsDocumentProps) => {
  if (!data) return null

  const currentThemeColors = themeColors[theme] || themeColors.light
  const technicalSkills = buildTechnicalSkillGroups(data, language)
  const sortedExperiences = [...(data.experience ?? [])].sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  )
  const atsExperiences = sortedExperiences.filter((experience) => {
    const place = experience.place?.toLowerCase() ?? ""
    const title = experience.title?.toLowerCase() ?? ""
    return !place.includes("hors tech") && !title.includes("hors tech")
  })
  const atsVisibleExperiences = atsExperiences
  const atsEducationEntries = (data.education ?? []).slice(0, 3)
  const atsDetailedSkillGroups = technicalSkills
    .slice(0, 4)
    .map((group, index) => ({
      label: group.label,
      skills: group.skills.slice(0, index < 2 ? 5 : 4),
    }))
    .filter((group) => group.skills.length > 0)
  const atsCoreSkills = dedupeStrings(data.coreSkills ?? []).slice(0, 10)
  const atsLanguageSummary = (data.languages ?? [])
    .map((lang) => `${lang.name} (${(lang.level ?? "").toLowerCase()})`)
    .filter(Boolean)
    .join(" | ")

  const profileTitle = language === "en" ? "Profile" : "Profil"
  const experienceTitle =
    language === "en"
      ? "Professional Experience"
      : "Expérience professionnelle"
  const educationTitle = language === "en" ? "Education" : "Formation"
  const technicalSkillsTitle =
    language === "en" ? "Technical Skills" : "Compétences techniques"
  const languagesTitle = language === "en" ? "Languages" : "Langues"
  const atsPeriodLabel = language === "en" ? "Period" : "Période"
  const atsJobTitleLabel = language === "en" ? "Job Title" : "Poste"
  const atsCompanyLabel = language === "en" ? "Company" : "Entreprise"
  const atsSummaryLabel = language === "en" ? "Summary" : "Résumé"
  const atsTechnologiesLabel =
    language === "en" ? "Technologies" : "Technologies"
  const typeScale = {
    caption: 8,
    small: 8.5,
    base: 8,
    bodyStrong: 10,
    heading: 11,
    subheading: 12,
    display: 16,
  } as const

  const styles = StyleSheet.create({
    page: {
      padding: 9,
      backgroundColor: currentThemeColors.background,
      color: currentThemeColors.foreground,
      fontFamily: "Cereal",
    },
    pageContent: {
      flexDirection: "column",
      gap: 5,
    },
    atsLayout: {
      flexDirection: "row",
      gap: 6,
      alignItems: "flex-start",
    },
    atsMainColumn: {
      width: "72%",
      flexDirection: "column",
      gap: 4,
      minWidth: 0,
    },
    atsSidebarColumn: {
      width: "28%",
      flexDirection: "column",
      gap: 3,
      minWidth: 0,
    },
    sectionTitle: {
      fontSize: typeScale.heading,
      fontWeight: "bold",
      color: currentThemeColors.primary,
    },
    sectionBody: {
      flexDirection: "column",
      gap: 8,
    },
    aboutText: {
      fontSize: typeScale.base,
      lineHeight: 1.08,
      color: currentThemeColors.foreground,
    },
    atsHeader: {
      flexDirection: "column",
      gap: 1.5,
    },
    atsName: {
      fontSize: typeScale.display,
      color: currentThemeColors.primary,
      fontWeight: "ultrabold",
    },
    atsTitle: {
      fontSize: typeScale.subheading,
      color: currentThemeColors.accent,
      fontWeight: "bold",
    },
    atsSubtitle: {
      fontSize: typeScale.small,
      color: currentThemeColors.foreground,
      lineHeight: 1.02,
    },
    atsYears: {
      fontSize: typeScale.small,
      color: currentThemeColors.foreground,
    },
    atsContactList: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 3,
    },
    atsContactLine: {
      fontSize: typeScale.caption,
      color: currentThemeColors.foreground,
    },
    atsSection: {
      flexDirection: "column",
      gap: 1.5,
    },
    atsItem: {
      flexDirection: "column",
      gap: 0.5,
    },
    atsExperienceHeader: {
      fontSize: typeScale.bodyStrong,
      lineHeight: 1.06,
      color: currentThemeColors.primary,
      fontWeight: "bold",
    },
    atsExperienceMeta: {
      fontSize: typeScale.base,
      lineHeight: 1.05,
      color: currentThemeColors.foreground,
    },
    atsFieldLine: {
      fontSize: typeScale.base,
      lineHeight: 1.05,
    },
    atsFieldLabel: {
      fontSize: typeScale.small,
      fontWeight: "bold",
      color: currentThemeColors.primary,
    },
    atsDescription: {
      fontSize: typeScale.base,
      lineHeight: 1.06,
    },
    atsBulletRow: {
      flexDirection: "row",
      gap: 2,
      alignItems: "flex-start",
    },
    atsBulletMarker: {
      fontSize: typeScale.small,
      color: currentThemeColors.primary,
    },
    atsBulletText: {
      flex: 1,
      fontSize: typeScale.base,
      lineHeight: 1.06,
    },
    atsSkillsRow: {
      flexDirection: "column",
      gap: 0.5,
    },
    atsCompactList: {
      flexDirection: "column",
      gap: 1.2,
    },
    atsCompactEducationLine: {
      fontSize: typeScale.caption,
      lineHeight: 1.02,
    },
    atsSkillGroup: {
      flexDirection: "column",
      gap: 0.5,
    },
    atsSkillGroupLabel: {
      fontSize: typeScale.caption,
      lineHeight: 1.02,
      fontWeight: "bold",
      color: currentThemeColors.primary,
    },
    atsSkillGroupValue: {
      fontSize: typeScale.small,
      lineHeight: 1.02,
      color: currentThemeColors.foreground,
    },
  })

  const renderAtsExperienceItem = (exp: CVExperience, index: number) => {
    const { contextLine, bulletLines } = splitDescriptionLines(exp.description)
    const { start, end } = splitAtsPeriodRange(exp.period)
    const isPersonalProjects = isPersonalProjectsExperience(exp)
    const cleanTitle = isPersonalProjects
      ? language === "en"
        ? "Full Stack Developer - Personal Projects"
        : "Développeur Full Stack - Projets personnels"
      : (formatAtsExperienceTitle(exp.title) ?? exp.title)
    const companyName = isPersonalProjects
      ? language === "en"
        ? "Independent Personal Projects"
        : "Projets personnels en indépendant"
      : exp.place
    const maxBullets = index < 2 ? 3 : 2
    const atsBullets = bulletLines.slice(0, maxBullets)
    const atsSkills = (exp.skills ?? []).slice(0, 8)

    return (
      <View
        key={`${exp.place ?? "experience"}-${index}`}
        style={styles.atsItem}
        wrap={false}
      >
        {cleanTitle ? (
          <Text style={styles.atsFieldLine}>
            <Text style={styles.atsFieldLabel}>{atsJobTitleLabel}: </Text>
            {cleanTitle}
          </Text>
        ) : null}
        {companyName ? (
          <Text style={styles.atsFieldLine}>
            <Text style={styles.atsFieldLabel}>{atsCompanyLabel}: </Text>
            {companyName}
          </Text>
        ) : null}
        {start || end ? (
          <Text style={styles.atsFieldLine}>
            <Text style={styles.atsFieldLabel}>{atsPeriodLabel}: </Text>
            {start ? <>{start}</> : null}
            {start && end ? " - " : null}
            {end ? <>{end}</> : null}
          </Text>
        ) : null}
        {contextLine ? (
          <Text style={styles.atsDescription}>
            <Text style={styles.atsFieldLabel}>{atsSummaryLabel}: </Text>
            {contextLine}
          </Text>
        ) : null}
        {atsBullets.map((desc, itemIndex) => (
          <View key={itemIndex} style={styles.atsBulletRow}>
            <Text style={styles.atsBulletMarker}>-</Text>
            <Text style={styles.atsBulletText}>{sanitizeBullet(desc)}</Text>
          </View>
        ))}
        {atsSkills.length > 0 ? (
          <View style={styles.atsSkillsRow}>
            <Text style={styles.atsFieldLine}>
              <Text style={styles.atsFieldLabel}>{atsTechnologiesLabel}: </Text>
              {atsSkills.join(", ")}
            </Text>
          </View>
        ) : null}
      </View>
    )
  }

  const renderAtsEducationSection = () => {
    if (!atsEducationEntries.length) return null

    return (
      <View style={styles.atsSection}>
        <Text style={styles.sectionTitle}>{educationTitle}</Text>
        <View style={styles.atsCompactList}>
          {atsEducationEntries.map((edu, index) => (
            <View
              key={`${edu.title ?? "education"}-${index}`}
              style={styles.atsItem}
              wrap={false}
            >
              {edu.place ? (
                <Text style={styles.atsExperienceHeader}>{edu.place}</Text>
              ) : null}
              {edu.title ? (
                <Text style={styles.atsExperienceMeta}>{edu.title}</Text>
              ) : null}
              {edu.period ? (
                <Text style={styles.atsCompactEducationLine}>
                  {formatAtsPeriod(edu.period) ?? edu.period}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      </View>
    )
  }

  const renderAtsSupplementalSections = () => (
    <>
      {atsCoreSkills.length > 0 ? (
        <View style={styles.atsSection}>
          <Text style={styles.sectionTitle}>
            {language === "en" ? "Core Skills" : "Compétences clés"}
          </Text>
          <Text style={styles.atsDescription}>{atsCoreSkills.join(", ")}</Text>
        </View>
      ) : null}

      {atsDetailedSkillGroups.length > 0 && (
        <View style={styles.atsSection}>
          <Text style={styles.sectionTitle}>{technicalSkillsTitle}</Text>
          <View style={styles.atsCompactList}>
            {atsDetailedSkillGroups.map((group) => (
              <View key={group.label} style={styles.atsSkillGroup}>
                <Text style={styles.atsSkillGroupLabel}>{group.label}</Text>
                <Text style={styles.atsSkillGroupValue}>
                  {group.skills.join(", ")}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {atsLanguageSummary ? (
        <View style={styles.atsSection} wrap={false}>
          <Text style={styles.sectionTitle}>{languagesTitle}</Text>
          <Text style={styles.atsDescription}>{atsLanguageSummary}</Text>
        </View>
      ) : null}
    </>
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContent}>
          <View style={styles.atsHeader}>
            <Text style={styles.atsName}>{data.name}</Text>
            <Text style={styles.atsTitle}>{data.title}</Text>
            {data.subtitle ? (
              <Text style={styles.atsSubtitle}>{data.subtitle}</Text>
            ) : null}
            {data.yearsOfExperience ? (
              <Text style={styles.atsYears}>
                {data.yearsOfExperience}{" "}
                {language === "en"
                  ? `${data.yearsOfExperience > 1 ? "years" : "year"} of experience`
                  : `${data.yearsOfExperience > 1 ? "années" : "année"} d'expérience`}
              </Text>
            ) : null}
            {data.contact && data.contact.length > 0 ? (
              <View style={styles.atsContactList}>
                {data.contact.map(
                  (contact) =>
                    contact.value &&
                    (contact.link ? (
                      <Link
                        key={contact.key}
                        style={styles.atsContactLine}
                        src={contact.link}
                      >
                        {contact.value}
                      </Link>
                    ) : (
                      <Text key={contact.key} style={styles.atsContactLine}>
                        {contact.value}
                      </Text>
                    )),
                )}
              </View>
            ) : null}
          </View>

          <View style={styles.atsLayout}>
            <View style={styles.atsMainColumn}>
              {atsVisibleExperiences.length > 0 ? (
                <View style={styles.atsSection}>
                  <Text style={styles.sectionTitle}>{experienceTitle}</Text>
                  <View style={styles.sectionBody}>
                    {atsVisibleExperiences.map((exp, index) =>
                      renderAtsExperienceItem(exp, index),
                    )}
                  </View>
                </View>
              ) : null}
            </View>

            <View style={styles.atsSidebarColumn}>
              {data.about ? (
                <View style={styles.atsSection}>
                  <Text style={styles.sectionTitle}>{profileTitle}</Text>
                  <Text style={styles.aboutText}>{data.about}</Text>
                </View>
              ) : null}
              {renderAtsEducationSection()}
              {renderAtsSupplementalSections()}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
