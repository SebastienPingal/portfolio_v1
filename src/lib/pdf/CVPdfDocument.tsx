import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
  Image,
} from "@react-pdf/renderer"
import { CVData } from "@/types/CV"
import { themeColors, ThemeType } from "@/components/pdfTheme"

export interface CVPdfDocumentProps {
  data: CVData | null
  language: string
  theme: ThemeType
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
  const labels = language === "en" ? technicalSkillLabels.en : technicalSkillLabels.fr
  const stackGroups = (data.skills?.stack ?? [])
    .filter((group) => group.length > 0)
    .map((group, index) => ({
      label: labels[index] ?? `${language === "en" ? "Technical Stack" : "Stack technique"} ${index + 1}`,
      skills: group.map((skill) => skill.name).filter(Boolean),
    }))

  const otherSkills = (data.skills?.other ?? []).map((skill) => skill.name).filter(Boolean)
  if (otherSkills.length > 0) {
    stackGroups.push({
      label: language === "en" ? "Other Skills" : "Autres compétences",
      skills: otherSkills,
    })
  }

  return stackGroups
}

type CVExperience = NonNullable<CVData["experience"]>[number]

const estimateLineCount = (text: string, charsPerLine: number) => {
  const normalized = text.trim()
  if (!normalized) return 0
  return Math.max(1, Math.ceil(normalized.length / charsPerLine))
}

const estimateExperienceScore = (experience: CVExperience) => {
  const header = [experience.place, experience.title, experience.period]
    .filter(Boolean)
    .join(" · ")
  const description = experience.description ?? []
  const contextLine = description.find((line) => !line.startsWith("-") && !line.startsWith("*"))
  const bulletLines = description.filter((line) => line.startsWith("-") || line.startsWith("*"))
  const skillsLine = experience.skills?.join(" · ") ?? ""

  return (
    estimateLineCount(header, 42) +
    (contextLine ? estimateLineCount(contextLine, 62) : 0) +
    bulletLines.reduce(
      (total, line) => total + estimateLineCount(line.replace(/^(\*|-)\s*/, ""), 60),
      0,
    ) +
    (skillsLine ? estimateLineCount(skillsLine, 60) : 0) +
    3
  )
}

const splitExperiencesForFirstPage = ({
  about,
  experiences,
  sidebarDensity,
}: {
  about?: string | null
  experiences: CVExperience[]
  sidebarDensity: number
}) => {
  if (experiences.length <= 1) {
    return {
      firstPageExperiences: experiences,
      remainingExperiences: [] as CVExperience[],
    }
  }

  const maxScore = sidebarDensity >= 8 ? 42 : 50
  let accumulatedScore = about ? estimateLineCount(about, 70) + 6 : 0
  let splitIndex = experiences.length

  for (let index = 0; index < experiences.length; index += 1) {
    const nextScore = accumulatedScore + estimateExperienceScore(experiences[index])
    if (index > 0 && nextScore > maxScore) {
      splitIndex = index
      break
    }

    accumulatedScore = nextScore
  }

  if (splitIndex === 0) {
    splitIndex = 1
  }

  // Avoid leaving a large empty area under the first experience on page 1.
  // The sidebar often makes the heuristic too conservative, while two entries
  // still fit comfortably in the left column for this CV layout.
  if (splitIndex === 1 && experiences.length > 1) {
    splitIndex = 2
  }

  return {
    firstPageExperiences: experiences.slice(0, splitIndex),
    remainingExperiences: experiences.slice(splitIndex),
  }
}

Font.register({
  family: "Cereal",
  fonts: [
    {
      src: "/fonts/AirbnbCereal_W_Md.otf",
      fontWeight: "normal",
      fontStyle: "normal",
    },
    {
      src: "/fonts/AirbnbCereal_W_Bd.otf",
      fontWeight: "bold",
      fontStyle: "normal",
    },
    {
      src: "/fonts/AirbnbCereal_W_Lt.otf",
      fontWeight: "light",
      fontStyle: "normal",
    },
    {
      src: "/fonts/AirbnbCereal_W_XBd.otf",
      fontWeight: "ultrabold",
      fontStyle: "normal",
    },
  ],
})

// Keep words intact in PDF output instead of splitting them mid-word.
Font.registerHyphenationCallback((word) => [word])

export const CVPdfDocument = ({ data, language, theme }: CVPdfDocumentProps) => {
  if (!data) return null

  const currentThemeColors = themeColors[theme] || themeColors.light
  const technicalSkills = buildTechnicalSkillGroups(data, language)
  const sortedExperiences = [...(data.experience ?? [])].sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  )
  const { firstPageExperiences, remainingExperiences } = splitExperiencesForFirstPage({
    about: data.about,
    experiences: sortedExperiences,
    sidebarDensity:
      technicalSkills.length +
      (data.coreSkills?.length ? 1 : 0) +
      (data.languages?.length ? 1 : 0),
  })
  const shouldRenderEducationOnFirstPage =
    Boolean(data.education?.length) && remainingExperiences.length === 0
  const shouldRenderContinuationPage =
    remainingExperiences.length > 0 ||
    (Boolean(data.education?.length) && !shouldRenderEducationOnFirstPage)
  const coreSkillsTitle = language === "en" ? "Core Skills" : "Compétences clés"
  const languagesTitle = language === "en" ? "Languages" : "Langues"
  const profileTitle = language === "en" ? "Profile" : "Profil"
  const experienceTitle = language === "en"
    ? "Professional Experience"
    : "Expérience professionnelle"
  const spacing = {
    pageInset: 15,
    pageStack: 10,
    headerInset: 10,
    headerGap: 25,
    headerColumnsGap: 16,
    headerTextGap: 2,
    contactGap: 4,
    contentColumnsGap: 10,
    mainColumnGap: 8,
    sidebarColumnGap: 6,
    fullWidthGap: 6,
    sectionInset: 4,
    sectionGap: 5,
    sectionContentGap: 6,
    itemGap: 3,
    technicalGroupGap: 3,
    technicalRowGap: 1,
    languageGap: 4,
  } as const

  const styles = StyleSheet.create({
    page: {
      padding: spacing.pageInset,
      backgroundColor: currentThemeColors.background,
      color: currentThemeColors.foreground,
      fontFamily: "Cereal",
    },
    pageContent: {
      flexDirection: "column",
      gap: spacing.pageStack,
    },
    header: {
      flexDirection: "row",
      gap: spacing.headerGap,
      padding: spacing.headerInset,
      backgroundColor: currentThemeColors.card,
      borderRadius: 10,
      alignItems: "flex-start",
    },
    profileImage: {
      height: 80,
      opacity: 0.8,
      objectFit: "cover",
      borderRadius: 10,
    },
    headerContent: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      gap: spacing.headerColumnsGap,
      minWidth: 0,
    },
    headerText: {
      flexDirection: "column",
      flex: 1,
      gap: spacing.headerTextGap,
      minWidth: 0,
    },
    headerLeft: {
      width: "66%",
      flexDirection: "column",
      gap: spacing.headerTextGap,
      minWidth: 0,
    },
    headerRight: {
      flexDirection: "column",
      gap: spacing.contactGap,
      width: "34%",
      alignItems: "flex-end",
      minWidth: 0,
    },
    name: {
      fontSize: 21,
      color: currentThemeColors.accent,
      fontWeight: "ultrabold",
    },
    title: {
      fontSize: 15,
      color: currentThemeColors.primary,
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: 11,
      color: currentThemeColors.primary,
      fontWeight: "bold",
      lineHeight: 1.2,
    },
    contact: {
      fontSize: 9,
      color: currentThemeColors.accent,
    },
    contactContainer: {
      flexDirection: "column",
      gap: spacing.contactGap,
      alignItems: "flex-end",
    },
    section: {
      flexDirection: "column",
      gap: spacing.sectionGap,
      padding: spacing.sectionInset,
      borderRadius: 3,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: currentThemeColors.primary,
    },
    sectionBody: {
      flexDirection: "column",
      gap: spacing.sectionContentGap,
    },
    experienceItem: {
      flexDirection: "column",
      gap: spacing.itemGap,
    },
    experienceHeader: {
      fontSize: 12,
      fontWeight: "bold",
      color: currentThemeColors.primary,
    },
    experienceContext: {
      fontSize: 9,
      lineHeight: 1.35,
    },
    experienceBullet: {
      fontSize: 9,
      lineHeight: 1.1,
      marginLeft: 10,
    },
    experienceStack: {
      fontSize: 9,
      color: currentThemeColors.accent,
    },
    educationItem: {
      flexDirection: "column",
      gap: 3,
    },
    educationHeader: {
      fontSize: 11,
      fontWeight: "bold",
      color: currentThemeColors.primary,
    },
    educationDescription: {
      fontSize: 9,
      lineHeight: 1.35,
    },
    link: {
      textDecoration: "underline",
      color: currentThemeColors.primary,
      fontWeight: "bold",
    },
    contentLayout: {
      flexDirection: "row",
      gap: spacing.contentColumnsGap,
    },
    mainColumn: {
      width: "66%",
      flexDirection: "column",
      gap: spacing.mainColumnGap,
    },
    sidebarColumn: {
      width: "34%",
      flexDirection: "column",
      gap: spacing.sidebarColumnGap,
      padding: spacing.mainColumnGap,
      backgroundColor: currentThemeColors.sidebar,
      borderRadius: 10,
    },
    fullWidthColumn: {
      width: "100%",
      flexDirection: "column",
      gap: spacing.fullWidthGap,
    },
    aboutText: {
      fontSize: 10,
      lineHeight: 1.4,
      color: currentThemeColors.foreground,
    },
    technicalSkillsList: {
      flexDirection: "column",
      gap: spacing.technicalGroupGap,
    },
    technicalSkillRow: {
      flexDirection: "column",
      gap: spacing.technicalRowGap,
    },
    technicalSkillLabel: {
      fontSize: 9,
      fontWeight: "bold",
      color: currentThemeColors.primary,
    },
    technicalSkillValue: {
      fontSize: 9.1,
      lineHeight: 1.35,
    },
    languageRow: {
      flexDirection: "row",
      gap: spacing.languageGap,
      alignItems: "baseline",
    },
    languageText: {
      fontSize: 9,
      lineHeight: 1.35,
    },
  })

  const renderExperienceItem = (exp: CVExperience, index: number) => {
    const description = exp.description ?? []
    const contextLine = description.find((desc) => !desc.startsWith("-") && !desc.startsWith("*"))
    const bulletLines = description.filter((desc) => desc.startsWith("-") || desc.startsWith("*"))
    const header = [exp.place, exp.title, exp.period].filter(Boolean).join(" · ")

    return (
      <View key={`${exp.place ?? "experience"}-${index}`} style={styles.experienceItem} wrap={false}>
        <Text style={styles.experienceHeader}>
          {exp.link ? (
            <Link style={styles.link} src={exp.link}>
              {header}
            </Link>
          ) : (
            header
          )}
        </Text>
        {contextLine ? <Text style={styles.experienceContext}>{contextLine}</Text> : null}
        {bulletLines.map((desc, itemIndex) => (
          <Text key={itemIndex} style={styles.experienceBullet}>
            {desc.replace(/^(\*|-)\s*/, "• ")}
          </Text>
        ))}
        {exp.skills && exp.skills.length > 0 ? (
          <Text style={styles.experienceStack}>
            {language === "en" ? "Stack:" : "Stack :"} {exp.skills.join(" · ")}
          </Text>
        ) : null}
      </View>
    )
  }

  const renderEducationSection = () => {
    if (!data.education?.length) return null

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {language === "en" ? "Education" : "Formation"}
        </Text>
        <View style={styles.sectionBody}>
          {data.education.map((edu, index) => {
            const header = [edu.place, edu.title, edu.period].filter(Boolean).join(" · ")

            return (
              <View
                key={`${edu.title ?? "education"}-${index}`}
                style={styles.educationItem}
                wrap={false}
              >
                <Text style={styles.educationHeader}>{header}</Text>
                {edu.description?.map((desc, itemIndex) => (
                  <Text key={itemIndex} style={styles.educationDescription}>
                    {desc}
                  </Text>
                ))}
              </View>
            )
          })}
        </View>
      </View>
    )
  }

  const renderSidebar = () => (
    <View style={styles.sidebarColumn}>
      {data.coreSkills && data.coreSkills.length > 0 && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>{coreSkillsTitle}</Text>
          <View style={styles.technicalSkillsList}>
            <View style={styles.technicalSkillRow}>
              <Text style={styles.technicalSkillValue}>{data.coreSkills.join(" · ")}</Text>
            </View>
          </View>
        </View>
      )}

      {data.languages && data.languages.length > 0 && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>{languagesTitle}</Text>
          <View style={styles.technicalSkillsList}>
            {data.languages.map((lang) => (
              <View key={lang.name} style={styles.languageRow}>
                <Text style={styles.languageText}>
                  {lang.name} : {(lang.level ?? "").toLowerCase()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {technicalSkills.length > 0 && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>
            {language === "en" ? "Technical Skills" : "Compétences techniques"}
          </Text>
          <View style={styles.technicalSkillsList}>
            {technicalSkills.map((group) => (
              <View key={group.label} style={styles.technicalSkillRow}>
                <Text style={styles.technicalSkillLabel}>{group.label}</Text>
                <Text style={styles.technicalSkillValue}>{group.skills.join(" · ")}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContent}>
          <View style={styles.header}>
            {(data.profileImage || data.profileImagePdf) &&
              (data.profileImageDark || data.profileImageDarkPdf) && (
              <Image
                src={
                  (theme === "light"
                    ? (data.profileImagePdf ?? data.profileImage)
                    : (data.profileImageDarkPdf ?? data.profileImageDark)) as string
                }
                style={styles.profileImage}
              />
            )}
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <View style={styles.headerText}>
                  <Text style={styles.name}>{data.name}</Text>
                  <Text style={styles.title}>{data.title}</Text>
                  <Text style={styles.subtitle}>{data.subtitle}</Text>
                  {data.yearsOfExperience && (
                    <Text
                      style={{
                        fontSize: 14,
                        color: currentThemeColors.accent,
                        fontWeight: "normal",
                      }}
                    >
                      {data.yearsOfExperience}{" "}
                      {language === "en"
                        ? `${data.yearsOfExperience > 1 ? "years" : "year"} of experience`
                        : `${data.yearsOfExperience > 1 ? "années" : "année"} d'expérience`}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.headerRight}>
                {data.contact && (
                  <View style={styles.contactContainer}>
                    {data.contact.map(
                      (contact) =>
                        contact.value &&
                        (contact.link ? (
                          <Link key={contact.key} style={styles.contact} src={contact.link}>
                            {contact.value}
                          </Link>
                        ) : (
                          <Text key={contact.key} style={styles.contact}>
                            {contact.value}
                          </Text>
                        )),
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.contentLayout}>
            <View style={styles.mainColumn}>
              {data.about && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>{profileTitle}</Text>
                  <View style={styles.sectionBody}>
                    <Text style={styles.aboutText}>{data.about}</Text>
                  </View>
                </View>
              )}

              {firstPageExperiences.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>{experienceTitle}</Text>
                  <View style={styles.sectionBody}>
                    {firstPageExperiences.map((exp, index) => renderExperienceItem(exp, index))}
                  </View>
                </View>
              )}

              {shouldRenderEducationOnFirstPage ? renderEducationSection() : null}
            </View>

            {renderSidebar()}
          </View>
        </View>
      </Page>

      {shouldRenderContinuationPage && (
        <Page size="A4" style={styles.page}>
          <View style={styles.pageContent}>
            <View style={styles.fullWidthColumn}>
              {remainingExperiences.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>{experienceTitle}</Text>
                  <View style={styles.sectionBody}>
                    {remainingExperiences.map((exp, index) => renderExperienceItem(exp, index))}
                  </View>
                </View>
              )}

              {!shouldRenderEducationOnFirstPage ? renderEducationSection() : null}
            </View>
          </View>
        </Page>
      )}
    </Document>
  )
}

