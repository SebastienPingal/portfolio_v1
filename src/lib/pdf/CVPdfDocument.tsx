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

export const CVPdfDocument = ({ data, language, theme }: CVPdfDocumentProps) => {
  if (!data) return null

  const currentThemeColors = themeColors[theme] || themeColors.light

  const styles = StyleSheet.create({
    page: {
      padding: 20,
      backgroundColor: currentThemeColors.background,
      color: currentThemeColors.foreground,
      fontFamily: "Cereal",
    },
    header: {
      flexDirection: "row",
      gap: 20,
      marginBottom: 10,
      padding: 10,
      backgroundColor: currentThemeColors.card,
      borderRadius: 10,
    },
    profileImage: {
      height: 200,
      opacity: 0.8,
      objectFit: "cover",
      borderRadius: 10,
    },
    headerText: {
      flexDirection: "column",
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 20,
    },
    headerRight: {
      flexDirection: "column",
      justifyContent: "space-between",
      gap: 4,
      alignItems: "flex-start",
      flex: 1,
      minWidth: 0,
    },
    languagesContactContainer: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      gap: 20,
    },
    languagesContainer: {
      flexDirection: "row",
      gap: 20,
      alignItems: "flex-end",
    },
    languagesContent: {
      fontSize: 14,
      color: currentThemeColors.primary,
    },
    name: {
      fontSize: 24,
      color: currentThemeColors.accent,
      fontWeight: "ultrabold",
    },
    title: {
      fontSize: 24,
      color: currentThemeColors.primary,
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: 18,
      color: currentThemeColors.primary,
      fontWeight: "bold",
    },
    contact: {
      fontSize: 9,
      color: currentThemeColors.accent,
    },
    contactContainer: {
      flexDirection: "column",
      gap: 4,
      alignItems: "flex-end",
    },
    section: {
      flexDirection: "column",
      gap: 5,
      marginBottom: 8,
      padding: 6,
      borderRadius: 3,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      color: currentThemeColors.primary,
    },
    experienceRow: {
      flexDirection: "row",
      gap: 10,
      justifyContent: "space-between",
    },
    leftColumn: {
      width: "30%",
      flexDirection: "column",
      gap: 4,
    },
    rightColumn: {
      width: "65%",
      flexDirection: "column",
    },
    placeDescription: {
      fontSize: 9,
      color: currentThemeColors.accent,
      marginBottom: 4,
    },
    experienceTitle: {
      fontSize: 14,
      marginBottom: 10,
      fontWeight: "bold",
      color: currentThemeColors.primary,
    },
    experiencePeriod: {
      fontSize: 9,
      color: currentThemeColors.primary,
    },
    experienceDescription: {
      fontSize: 9,
      marginBottom: 2,
    },
    experienceDescriptionDash: {
      fontSize: 9,
      marginLeft: 10,
      marginBottom: 2,
      marginTop: 5,
    },
    experienceDescriptionAsterisk: {
      fontSize: 9,
      marginLeft: 20,
    },
    link: {
      textDecoration: "underline",
      color: currentThemeColors.primary,
      fontWeight: "bold",
    },
    mainContent: {
      flexDirection: "column",
      gap: 10,
    },
    skillItem: {
      fontSize: 10,
    },
    experienceSkills: {
      marginTop: 5,
      marginBottom: 5,
    },
    experienceSkillsTitle: {
      fontSize: 10,
      fontWeight: "bold",
      color: currentThemeColors.accent,
      marginBottom: 2,
    },
    experienceSkillsContent: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 2,
    },
    experienceLinkSection: {
      marginTop: 8,
      padding: 3,
      backgroundColor: currentThemeColors.background,
      borderRadius: 2,
    },
    experienceLinkTitle: {
      fontSize: 8,
      fontWeight: "bold",
      color: currentThemeColors.primary,
      marginBottom: 2,
    },
    experienceLink: {
      fontSize: 8,
      color: currentThemeColors.accent,
      textDecoration: "underline",
    },
    experienceContent: {
      flexDirection: "column",
      gap: 20,
    },
    aboutText: {
      fontSize: 10,
      lineHeight: 1.4,
      color: currentThemeColors.foreground,
    },
    keywordsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
    },
    keywordTag: {
      fontSize: 1,
      padding: 2,
      paddingLeft: 6,
      paddingRight: 6,
      color: currentThemeColors.accent,
    },
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
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
          </View>
          <View style={styles.headerRight}>
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
            <View style={styles.languagesContactContainer}>
              <View style={styles.languagesContainer}>
                {data.languages &&
                  data.languages.map((lang) => (
                    <Text key={lang.name} style={styles.languagesContent}>
                      {lang.name}
                    </Text>
                  ))}
              </View>
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

        <View style={styles.mainContent}>
          {data.about && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {language === "en" ? "About" : "À propos"}
              </Text>
              <Text style={styles.aboutText}>{data.about}</Text>
            </View>
          )}

          {data.coreKeywords && data.coreKeywords.length > 0 && (
            <View style={styles.section}>
              <View style={styles.keywordsContainer}>
                {data.coreKeywords.map((keyword, index) => (
                  <Text key={index} style={styles.keywordTag}>
                    {keyword}
                  </Text>
                ))}
              </View>
              <View style={styles.keywordsContainer}>
                {(data.atsKeywords ?? []).map((keyword, index) => (
                  <Text key={index} style={styles.keywordTag}>
                    {keyword}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {data.experience && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {language === "en"
                  ? "Professional Experience"
                  : "Expérience Professionnelle"}
              </Text>

              <View style={styles.experienceContent}>
                {data.experience
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((exp, index) => (
                    <View key={index}>
                      <View style={styles.experienceRow}>
                        <View style={styles.leftColumn}>
                          <Text style={styles.experienceTitle}>
                            {exp.link ? (
                              <Link style={styles.link} src={exp.link}>
                                {exp.place}
                              </Link>
                            ) : (
                              exp.place
                            )}
                          </Text>
                        </View>

                        <View style={styles.rightColumn}>
                          <Text style={styles.experienceTitle}>{exp.title}</Text>
                        </View>
                      </View>

                      <View style={styles.experienceRow}>
                        <View style={styles.leftColumn}>
                          <Text style={styles.experiencePeriod}>{exp.period}</Text>
                          {exp.placeDescription && (
                            <Text style={styles.placeDescription}>
                              {exp.placeDescription}
                            </Text>
                          )}
                        </View>

                        <View style={styles.rightColumn}>
                          <Text style={styles.experienceSkillsTitle}>
                            {language === "en"
                              ? "My responsibilities / tasks performed:"
                              : "Mes responsabilités / tâches effectuées :"}
                          </Text>

                          {exp.description?.map((desc, i) => (
                            <Text
                              key={i}
                              style={
                                desc.startsWith("*")
                                  ? styles.experienceDescriptionAsterisk
                                  : desc.startsWith("-")
                                    ? styles.experienceDescriptionDash
                                    : styles.experienceDescription
                              }
                            >
                              {desc}
                            </Text>
                          ))}

                          {exp.skills && exp.skills.length > 0 && (
                            <View style={styles.experienceSkills}>
                              <Text style={styles.experienceSkillsTitle}>
                                {language === "en" ? "Skills:" : "Compétences :"}
                              </Text>
                              <View style={styles.experienceSkillsContent}>
                                {exp.skills.map((skill, skillIndex) => (
                                  <React.Fragment key={skillIndex}>
                                    <Text style={styles.skillItem}>{skill}</Text>
                                    {skillIndex !== (exp.skills?.length || 0) - 1 && (
                                      <Text style={styles.skillItem}>·</Text>
                                    )}
                                  </React.Fragment>
                                ))}
                              </View>
                            </View>
                          )}

                          {exp.link && (
                            <View style={styles.experienceLinkSection}>
                              <Text style={styles.experienceLinkTitle}>
                                {language === "en"
                                  ? "More details:"
                                  : "Plus de détails :"}
                              </Text>
                              <Link style={styles.experienceLink} src={exp.link}>
                                {exp.link}
                              </Link>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  ))}
              </View>
            </View>
          )}

          {data.education && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {language === "en" ? "Education" : "Formation"}
              </Text>
              {data.education.map((edu, index) => (
                <View key={index} style={styles.experienceRow}>
                  <View style={styles.leftColumn}>
                    <Text style={styles.experienceTitle}>{edu.title}</Text>
                    {edu.placeDescription && (
                      <Text style={styles.placeDescription}>{edu.placeDescription}</Text>
                    )}
                    <Text style={styles.experiencePeriod}>{edu.period}</Text>
                  </View>
                  <View style={styles.rightColumn}>
                    {edu.description?.map((desc, i) => (
                      <Text
                        key={i}
                        style={
                          desc.startsWith("*")
                            ? styles.experienceDescriptionAsterisk
                            : desc.startsWith("-")
                              ? styles.experienceDescriptionDash
                              : styles.experienceDescription
                        }
                      >
                        {desc}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}

