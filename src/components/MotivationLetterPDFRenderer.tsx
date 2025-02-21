'use client'

import dynamic from 'next/dynamic'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { MotivationLetterData } from '@/types/MotivationLetter'

const PDFViewer = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFViewer), { ssr: false })

type ThemeType = 'light' | 'dark'

interface PDFDocumentProps {
  data: MotivationLetterData
  theme: ThemeType
}

// Reuse the font registrations from PDFRenderer
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
    }
  ]
})

const themeColors = {
  light: {
    background: '#f6dff6',
    foreground: '#2E052E',
    accent: '#633663',
  },
  dark: {
    background: '#202D20',
    foreground: '#F1FDF1',
    accent: '#B3CCB3',
  }
}

const PDFDocument = ({ data, theme }: PDFDocumentProps) => {
  const currentThemeColors = themeColors[theme]

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      backgroundColor: currentThemeColors.background,
      color: currentThemeColors.foreground,
      fontFamily: 'Cereal',
      fontSize: 11
    },
    header: {
      marginBottom: 30,
      fontSize: 10
    },
    recipient: {
      marginBottom: 20,
      fontSize: 10,
      textAlign: 'right'
    },
    recipientLabel: {
      fontSize: 10,
      textAlign: 'right',
      marginBottom: 2,
      color: currentThemeColors.accent
    },
    date: {
      marginBottom: 20,
      textAlign: 'right',
      fontSize: 10
    },
    subject: {
      marginBottom: 20,
      fontWeight: 'bold',
      color: currentThemeColors.accent,
      fontSize: 12
    },
    content: {
      marginBottom: 30,
      lineHeight: 1.6,
      textAlign: 'justify',
      fontSize: 11
    },
    signature: {
      textAlign: 'right',
      color: currentThemeColors.accent,
      fontSize: 11
    }
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>{data.sender.name}</Text>
          {data.sender.contact && <Text>{data.sender.contact}</Text>}
        </View>

        <View style={styles.recipient}>
          <Text style={styles.recipientLabel}>pour</Text>
          {data.recipient.company && <Text>{data.recipient.company}</Text>}
        </View>

        <Text style={styles.date}>Fait le {data.date}</Text>

        {data.subject && <Text style={styles.subject}>{data.subject}</Text>}

        <Text style={styles.content}>{data.content}</Text>

        {data.signature && (
          <Text style={styles.signature}>{data.signature}</Text>
        )}
      </Page>
    </Document>
  )
}

export const MotivationLetterPDFRenderer = ({ data, theme }: PDFDocumentProps) => {
  return (
    <PDFViewer width="100%" height="100%">
      <PDFDocument data={data} theme={theme} />
    </PDFViewer>
  )
} 