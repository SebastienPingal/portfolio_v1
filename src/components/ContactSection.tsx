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
            variant="outline" 
            size="lg"
            className="flex gap-3 text-lg p-6"
            onClick={() => setIsContactFormOpen(true)}
          >
            <Send className="w-6 h-6" />
            {t('contact')}
          </Button>

          <Button 
            variant="default"
            size="lg"
            className="flex gap-3 text-lg p-6"
            onClick={() => window.open('https://cal.com/sebastienpingal/30min', '_blank')}
          >
            <Calendar className="w-6 h-6" />
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