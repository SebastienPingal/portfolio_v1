'use client'

import dynamic from 'next/dynamic'
import { Document, Page, Text, View, StyleSheet, Font, Link, Image } from '@react-pdf/renderer'
import { CVProps } from '@/types/CV'

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
    background: '#f6dff6',
    foreground: '#2E052E',
    card: '#F4D7F4',
    primary: '#9E709E',
    secondary: '#92bf92',
    accent: '#633663',
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
      justifyContent: 'space-between',
      marginBottom: 10,
      padding: 5,
      backgroundColor: currentThemeColors.card,
      borderRadius: 3,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10
    },
    profileImage: {
      height: 60,
      objectFit: 'contain'
    },
    headerText: {
      flexDirection: 'column'
    },
    headerRight: {
      flexDirection: 'column',
      alignItems: 'flex-end'
    },
    name: {
      fontSize: 24,
      color: currentThemeColors.accent,
      fontWeight: 'ultrabold'
    },
    title: {
      fontSize: 16,
      color: currentThemeColors.primary,
      fontWeight: 'bold'
    },
    contact: {
      fontSize: 9,
      color: currentThemeColors.primary
    },
    section: {
      marginBottom: 3,
      padding: 4,
      backgroundColor: currentThemeColors.card,
      borderRadius: 3
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold'
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
    experience: {
      padding: 3,
      marginBottom: 4
    },
    experienceHeader: {
      fontSize: 12,
      fontWeight: 'bold',
      color: currentThemeColors.accent
    },
    experienceTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5
    },
    experienceTitle: {
      fontSize: 10,
      textTransform: 'uppercase'
    },
    experiencePeriod: {
      fontSize: 10,
      color: currentThemeColors.accent
    },
    experienceDescription: {
      fontSize: 9,
      marginTop: 5,
      marginLeft: 5,
    },
    experienceDescriptionDash: {
      fontSize: 9,
      marginLeft: 15,
    },
    experienceDescriptionAsterisk: {
      fontSize: 9,
      marginLeft: 30,
    },
    link: {
      textDecoration: 'underline',
      color: currentThemeColors.accent,
      fontWeight: 'bold'
    },
    mainContent: {
      flexDirection: 'row',
      gap: 10,
    },
    sidebar: {
      width: '25%',
    },
    contentArea: {
      width: '75%',
      flexDirection: 'column',
      gap: 3,
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
            <View style={styles.headerText}>
              <Text style={styles.name}>{data.name}</Text>
              <Text style={styles.title}>{data.title}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            {data.contact && (
              <>
                {data.contact.map((contact) => (
                  contact.value && <Link key={contact.key} style={styles.contact} src={contact.link}>{contact.value}</Link>
                ))}
              </>
            )}
          </View>
        </View>

        {/* New layout structure */}
        <View style={styles.mainContent}>
          {/* Sidebar */}
          <View style={styles.sidebar}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{language === 'en' ? 'Skills' : 'Compétences'}</Text>
              <View style={styles.skillsSection}>
                {data.skills?.stack && (
                  <View style={styles.skillCategory}>
                    <Text style={styles.skillCategoryTitle}>
                      {language === 'en' ? 'Technical Stack' : 'Stack Technique'}
                    </Text>
                    {data.skills.stack.map((group, groupIndex) => (
                      <View key={groupIndex} style={styles.skillsContent}>
                        {group.map((skill, i) => (
                          <Text key={i} style={styles.skillItem}>
                            {skill.name}
                            {i < group.length - 1 && ', '}
                          </Text>
                        ))}
                      </View>
                    ))}
                  </View>
                )}

                {data.skills?.other && data.skills.other.length > 0 && (
                  <View style={styles.skillCategory}>
                    <Text style={styles.skillCategoryTitle}>
                      {language === 'en' ? 'Other Skills' : 'Autres Compétences'}
                    </Text>
                    <View style={styles.skillsContent}>
                      {data.skills.other.map((skill, i) => (
                        <Text key={i} style={styles.skillItem}>
                          {skill.name}
                          {i < data.skills!.other!.length - 1 && ', '}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {data.languages && data.languages.length > 0 && (
                  <View style={styles.skillCategory}>
                    <Text style={styles.skillCategoryTitle}>
                      {language === 'en' ? 'Languages' : 'Langues'} :
                    </Text>
                    <View style={styles.skillsContent}>
                      {data.languages.map((lang, i) => (
                        <Text key={i} style={styles.skillItem}>
                          {lang.name} ({lang.level})
                          {i < data.languages!.length - 1 && ', '}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
            {data.activities && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{language === 'en' ? 'Activities' : 'Activités'}</Text>
                <View style={styles.activitiesContent}>
                  {data.activities.map((activity, i) => (
                    <Text key={i} style={styles.skillItem}>
                      {activity}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Main Content Area */}
          <View style={styles.contentArea}>
            {/* Experience Section */}
            {data.experience && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {language === 'en' ? 'Experiences' : 'Expérience Professionnelle'}
                </Text>
                {data.experience.map((exp, index) => (
                  <View key={index} style={styles.experience}>
                    <Text style={styles.experienceHeader}>
                      {exp.link ? (
                        <Link style={styles.link} src={exp.link}>
                          <Text>{exp.place}</Text>
                        </Link>
                      ) : (
                        exp.place
                      )}
                    </Text>
                    <View style={styles.experienceTitleRow}>
                      <Text style={styles.experienceTitle}>{exp.title}</Text>
                      <Text style={styles.experiencePeriod}>{exp.period}</Text>
                    </View>
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
                  </View>
                ))}
              </View>
            )}

            {/* Education Section */}
            {data.education && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {language === 'en' ? 'Education' : 'Formation'}
                </Text>
                {data.education.map((edu, index) => (
                  <View key={index} style={styles.experience}>
                    <Text style={styles.experienceHeader}>{edu.title}</Text>
                    <Text style={styles.experiencePeriod}>{edu.period}</Text>
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
                ))}
              </View>
            )}
          </View>
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