'use client'
import { Button } from "./ui/button"
import { Calendar, Mail, Send } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import ContactForm from "./ContactForm"

export default function ContactSection() {
  const t = useTranslations('Contact')
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  return (
    <>
      <div className="w-full max-w-3xl mx-auto py-16">
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <Button
            variant="secondaryshine"
            size="lg"
            className="flex gap-4 text-xl p-8 h-auto"
            onClick={() => setIsContactFormOpen(true)}
          >
            <Send className="w-8 h-8" />
            {t('contact')}
          </Button>

          <Button
            variant="shine"
            size="lg"
            className="flex gap-4 text-xl p-8 h-auto"
            onClick={() => window.open('https://cal.com/sebastienpingal/prise-de-contact', '_blank')}
          >
            <Calendar className="w-8 h-8" />
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