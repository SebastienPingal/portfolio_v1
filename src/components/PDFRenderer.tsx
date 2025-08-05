import dynamic from 'next/dynamic'
import { Document, Page, Text, View, StyleSheet, Font, Link, Image } from '@react-pdf/renderer'
import { CVProps } from '@/types/CV'
import React from 'react'

// Dynamically import PDFViewer to ensure it's only used on the client side
const PDFViewer = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFViewer), { ssr: false })

// Define a type for the theme keys
type ThemeType = 'light' | 'dark';

interface PDFDocumentProps extends CVProps {
  theme: ThemeType
}

Font.register({
  family: 'Montserrat',
  src: 'https://fonts.gstatic.com/s/montserrat/v10/zhcz-_WihjSQC0oHJ9TCYC3USBnSvpkopQaUR-2r7iU.ttf'
})

Font.register({
  family: 'Cereal',
  fonts: [
    {
      src: '/fonts/AirbnbCereal_W_Md.otf',
      fontWeight: 'normal',
      fontStyle: 'normal'
    },
    {
      src: '/fonts/AirbnbCereal_W_Bd.otf',
      fontWeight: 'bold',
      fontStyle: 'normal'
    },
    {
      src: '/fonts/AirbnbCereal_W_Lt.otf',
      fontWeight: 'light',
      fontStyle: 'normal'
    },
    {
      src: '/fonts/AirbnbCereal_W_XBd.otf',
      fontWeight: 'ultrabold',
      fontStyle: 'normal'
    }
  ]
})

// Theme colors from your globals.css
const themeColors = {
  light: {
    background: '#faf2fa',
    foreground: '#2E052E',
    card: '#E1D7F9',
    primary: '#7743CB',
    secondary: '#92bf92',
    accent: '#8F6AE7',
  },
  dark: {
    background: '#202D20',
    foreground: '#F1FDF1',
    card: '#2E382E',
    primary: '#D6F5D6',
    secondary: '#BF92BF',
    accent: '#B3CCB3',
  }
}

// Separate the Document component from the PDFViewer wrapper
const PDFDocument = ({ data, language, theme }: PDFDocumentProps) => {
  if (!data) return null

  const currentThemeColors = themeColors[theme] || themeColors.light

  const styles = StyleSheet.create({
    page: {
      padding: 20,
      backgroundColor: currentThemeColors.background,
      color: currentThemeColors.foreground,
      fontFamily: 'Cereal'
    },
    header: {
      flexDirection: 'row',
      // justifyContent: 'space-between',
      gap: 20,
      marginBottom: 10,
      padding: 10,
      backgroundColor: currentThemeColors.card,
      borderRadius: 10,
    },
    profileImage: {
      height: 200,
      opacity: 0.8,
      objectFit: 'cover',
      borderRadius: 10,
    },
    headerText: {
      flexDirection: 'column'
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 20,
    },
    headerRight: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 4,
      alignItems: 'flex-start',
      flex: 1,
      minWidth: 0
    },
    languagesContactContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      gap: 20,
    },
    languagesContainer: {
      flexDirection: 'row',
      gap: 20,
      alignItems: 'flex-end',
    },
    languagesContent: {
      fontSize: 14,
      color: currentThemeColors.primary,
    },
    name: {
      fontSize: 24,
      color: currentThemeColors.accent,
      fontWeight: 'ultrabold'
    },
    title: {
      fontSize: 24,
      color: currentThemeColors.primary,
      fontWeight: 'bold'
    },
    subtitle: {
      fontSize: 18,
      color: currentThemeColors.primary,
      fontWeight: 'bold'
    },
    contact: {
      fontSize: 9,
      color: currentThemeColors.accent
    },
    contactContainer: {
      flexDirection: 'column',
      gap: 4,
      alignItems: 'flex-end'
    },
    section: {
      flexDirection: 'column',
      gap: 10,
      marginBottom: 8,
      padding: 6,
      borderRadius: 3
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: currentThemeColors.primary,
    },
    experienceRow: {
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'space-between'
    },
    leftColumn: {
      width: '30%',
      flexDirection: 'column',
      gap: 4
    },
    rightColumn: {
      width: '65%',
      flexDirection: 'column'
    },
    placeDescription: {
      fontSize: 9,
      color: currentThemeColors.accent,
      marginBottom: 4
    },
    experienceTitle: {
      fontSize: 14,
      marginBottom: 10,
      fontWeight: 'bold',
      color: currentThemeColors.primary,
    },
    experiencePeriod: {
      fontSize: 9,
      color: currentThemeColors.primary
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
      textDecoration: 'underline',
      color: currentThemeColors.primary,
      fontWeight: 'bold'
    },
    mainContent: {
      flexDirection: 'column',
      gap: 30,
    },
    skillsSection: {
      marginBottom: 3,
      flexDirection: 'column',
      gap: 3
    },
    skillCategory: {
      flexDirection: 'column',
      gap: 2
    },
    skillCategoryTitle: {
      fontSize: 12,
      fontWeight: 'extrabold',
      marginTop: 30,
      textDecoration: 'underline',
      color: currentThemeColors.accent,
      marginBottom: 2
    },
    skillsContent: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 3,
      marginTop: 20
    },
    activitiesContent: {
      flexDirection: 'column',
      gap: 20,
      marginTop: 20
    },
    skillItem: {
      fontSize: 10
    },
    experienceSkills: {
      marginTop: 5,
      marginBottom: 5,
    },
    experienceSkillsTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      color: currentThemeColors.accent,
      marginBottom: 2,
    },
    experienceSkillsContent: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 2,
    },
    experienceLinkSection: {
      marginTop: 8,
      padding: 3,
      backgroundColor: currentThemeColors.background,
      borderRadius: 2
    },
    experienceLinkTitle: {
      fontSize: 8,
      fontWeight: 'bold',
      color: currentThemeColors.primary,
      marginBottom: 2
    },
    experienceLink: {
      fontSize: 8,
      color: currentThemeColors.accent,
      textDecoration: 'underline'
    },
    experienceContent: {
      flexDirection: 'column',
      gap: 58,
    },
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {data.profileImage && data.profileImageDark && (
              <Image
                src={theme === 'light' ? data.profileImage : data.profileImageDark}
                style={styles.profileImage}
              />
            )}
          </View>
          <View style={styles.headerRight}>
            <View style={styles.headerText}>
              <Text style={styles.name}>{data.name}</Text>
              <Text style={styles.title}>
                {data.title}
              </Text>
              <Text style={styles.subtitle}>{data.subtitle}</Text>
              {data.yearsOfExperience && (
                <Text style={{ fontSize: 14, color: currentThemeColors.accent, fontWeight: 'normal' }}>
                  {data.yearsOfExperience}{" "}
                  {language === 'en'
                    ? `${data.yearsOfExperience > 1 ? 'years' : 'year'} of experience`
                    : `${data.yearsOfExperience > 1 ? 'années' : 'année'} d'expérience`
                  }
                </Text>
              )}
            </View>
            <View style={styles.languagesContactContainer}>
              <View style={styles.languagesContainer}>
                {data.languages && data.languages.map((lang) => (
                  <Text key={lang.name} style={styles.languagesContent}>{lang.name}</Text>
                ))}
              </View>
              {data.contact && (
                <View style={styles.contactContainer}>
                  {data.contact.map((contact) => (
                    contact.value && <Link key={contact.key} style={styles.contact} src={contact.link}>{contact.value}</Link>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Experience Section */}
          {data.experience && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {language === 'en' ? 'Professional Experience' : 'Expérience Professionnelle'}
              </Text>

              <View style={styles.experienceContent}>
                {data.experience
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((exp, index) => (

                    <View key={index} >
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
                        {/* Left Column - Basic Info Only */}
                        <View style={styles.leftColumn}>
                          <Text style={styles.experiencePeriod}>{exp.period}</Text>
                          {exp.placeDescription && (
                            <Text style={styles.placeDescription}>{exp.placeDescription}</Text>
                          )}
                        </View>

                        {/* Right Column - Detailed Descriptions + Skills */}
                        <View style={styles.rightColumn}>

                          {/* Subtitle for responsibilities */}
                          <Text style={styles.experienceSkillsTitle}>
                            {language === 'en' ? 'My responsibilities / tasks performed:' : 'Mes responsabilités / tâches effectuées :'}
                          </Text>

                          {/* Descriptions */}
                          {exp.description?.map((desc, i) => (
                            <Text
                              key={i}
                              style={
                                desc.startsWith('*')
                                  ? styles.experienceDescriptionAsterisk
                                  : desc.startsWith('-')
                                    ? styles.experienceDescriptionDash
                                    : styles.experienceDescription
                              }
                            >
                              {desc}
                            </Text>
                          ))}

                          {/* Skills Section - After descriptions */}
                          {exp.skills && exp.skills.length > 0 && (
                            <View style={styles.experienceSkills}>
                              <Text style={styles.experienceSkillsTitle}>
                                {language === 'en' ? 'Skills:' : 'Compétences :'}
                              </Text>
                              <View style={styles.experienceSkillsContent}>
                                {exp.skills.map((skill, skillIndex) => (
                                  <React.Fragment key={skillIndex}>
                                    <Text style={styles.skillItem}>
                                      {skill}
                                    </Text>
                                    {skillIndex !== (exp.skills?.length || 0) - 1 && (
                                      <Text style={styles.skillItem}>·</Text>
                                    )}
                                  </React.Fragment>
                                ))}
                              </View>
                            </View>
                          )}

                          {/* Link Section - After skills */}
                          {exp.link && (
                            <View style={styles.experienceLinkSection}>
                              <Text style={styles.experienceLinkTitle}>
                                {language === 'en' ? 'More details:' : 'Plus de détails :'}
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

          {/* Education Section */}
          {data.education && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {language === 'en' ? 'Education' : 'Formation'}
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
                          desc.startsWith('*')
                            ? styles.experienceDescriptionAsterisk
                            : desc.startsWith('-')
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

// Export both a viewer version and a raw document version
export const PDFRenderer = ({ data, language, theme }: PDFDocumentProps) => {
  return (
    <PDFViewer width="100%" height="100%">
      <PDFDocument data={data} language={language} theme={theme} />
    </PDFViewer>
  )
}

// Add this export for direct PDF generation
export const PDFDocumentRenderer = ({ data, language, theme }: PDFDocumentProps) => {
  return <PDFDocument data={data} language={language} theme={theme} />
}