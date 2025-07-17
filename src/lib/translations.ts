import { useLocale } from 'next-intl'

export interface TranslatedContent {
  en: string
  fr: string
}

export function getTranslatedContent(content: TranslatedContent, locale: string): string {
  return content[locale as keyof TranslatedContent] || content.en || content.fr
}

export function useTranslatedContent(content: TranslatedContent): string {
  const locale = useLocale()
  return getTranslatedContent(content, locale)
}

// For server components
export function getTranslatedContentServer(content: TranslatedContent, locale: string): string {
  return content[locale as keyof TranslatedContent] || content.en || content.fr
} 