'use client'
import { Button } from "./ui/button"
import { Calendar, Mail, Send } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import ContactForm from "./ContactForm"

export default function ContactSection({ compact = false }: { compact?: boolean }) {
  const t = useTranslations('Contact')
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  return (
    <>
      <div className={compact ? "w-full" : "w-full max-w-3xl mx-auto py-16"}>
        <div className={`flex flex-col md:flex-row justify-center items-center ${compact ? 'gap-4 sm:justify-start' : 'gap-8'}`}>
          <Button
            variant="secondaryshine"
            size="lg"
            className={`flex gap-4 h-auto ${compact ? 'text-lg px-6 py-4' : 'text-xl p-8'}`}
            onClick={() => setIsContactFormOpen(true)}
          >
            <Send className={compact ? "w-6 h-6" : "w-8 h-8"} />
            {t('contact')}
          </Button>

          <Button
            variant="shine"
            size="lg"
            className={`flex gap-4 h-auto ${compact ? 'text-lg px-6 py-4' : 'text-xl p-8'}`}
            onClick={() => window.open('https://cal.com/sebastienpingal/prise-de-contact', '_blank')}
          >
            <Calendar className={compact ? "w-6 h-6" : "w-8 h-8"} />
            {t('schedule')}
          </Button>
        </div>
      </div>

      <ContactForm
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
      />
    </>
  )
} 