'use client'

import dynamic from 'next/dynamic'
import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer'
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
    background: '#F4D7F4',
    foreground: '#2E052E',
    card: '#dbbddb',
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
      marginBottom: 5,
      padding: 4,
      backgroundColor: currentThemeColors.card,
      borderRadius: 3
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold'
    },
    skillsRow: {
      flexDirection: 'row',
      marginLeft: 5,
      fontSize: 10
    },
    skillLabel: {
      marginRight: 3,
      color: currentThemeColors.accent
    },
    experience: {
      padding: 3,
      marginBottom: 2
    },
    experienceHeader: {
      fontSize: 12,
      fontWeight: 'bold',
      color: currentThemeColors.accent
    },
    experiencePeriod: {
      fontSize: 10,
      color: currentThemeColors.accent
    },
    experienceDescription: {
      fontSize: 10,
      marginLeft: 5,
    }
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.title}>{data.title}</Text>
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

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{language === 'en' ? 'Skills' : 'Compétences'}</Text>
          {data.skills?.stack && (
            <View style={styles.skillsRow}>
              <Text style={styles.skillLabel}>{language === 'en' ? 'Technical Stack' : 'Stack Technique'}: </Text>
              <Text>{data.skills.stack.map(skill => skill.name).join(' | ')}</Text>
            </View>
          )}
          {data.skills?.other && (
            <View style={styles.skillsRow}>
              <Text style={styles.skillLabel}>{language === 'en' ? 'Other Skills' : 'Autres Compétences'}: </Text>
              <Text>{data.skills.other.map(skill => skill.name).join(' | ')}</Text>
            </View>
          )}
          {data.languages && (
            <View style={styles.skillsRow}>
              <Text style={styles.skillLabel}>{language === 'en' ? 'Languages' : 'Langues'}: </Text>
              <Text>{data.languages.map(lang => `${lang.name} (${lang.level})`).join(' | ')}</Text>
            </View>
          )}
        </View>

        {/* Experience */}
        {data.experience && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {language === 'en' ? 'Experiences' : 'Expérience Professionnelle'}
            </Text>
            {data.experience.map((exp, index) => (
              <View key={index} style={styles.experience}>
                <Text style={styles.experienceHeader}>{exp.place} - {exp.title}</Text>
                <Text style={styles.experiencePeriod}>{exp.period}</Text>
                {exp.description?.map((desc, i) => (
                  <Text key={i} style={styles.experienceDescription}>
                    • {desc}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
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
                  <Text key={i} style={styles.experienceDescription}>
                    • {desc}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}

export const PDFRenderer = ({ data, language, theme }: PDFDocumentProps) => {
  return (
    <PDFViewer width="100%" height="100%">
      <PDFDocument data={data} language={language} theme={theme} />
    </PDFViewer>
  )
} 