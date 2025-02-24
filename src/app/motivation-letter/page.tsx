'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Download } from 'lucide-react'
import { MotivationLetterData } from '@/types/MotivationLetter'
import { MotivationLetterPDFRenderer } from '@/components/MotivationLetterPDFRenderer'
import TalkingLogo from '@/components/TalkingLogo'

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

const MotivationLetterPage = () => {
  const { theme } = useTheme()
  const [showPDF, setShowPDF] = useState(false)
  const [letterData, setLetterData] = useState<MotivationLetterData>({
    recipient: {
      company: ''
    },
    sender: {
      name: 'Sébastien PINGAL',
      contact: 'sebastien.pingal@gmail.com'
    },
    date: formatDate(new Date()),
    content: `Bonjour,

Il y a trois ans, j'ai fait une reconversion. J'étais ingénieur du son et compositeur et j'ai décidé de plonger dans ma nouvelle passion.
Depuis, j'ai fait la refonte complète d'un SaaS de simulation d'investissement immobilier. 
J'ai monté une entreprise et ai donc créé de zéro un site permettant aux travailleurs en télétravail de se rencontrer. 
Et dernièrement, j'ai créé un site de gestion de projets de rénovation immobilière : ce site permet de mettre en relation les agences immobilières et leurs clients avec les sociétés de BTP. Ce dernier site comprend aussi un système de génération automatisée de devis et de factures.
`,
    signature: 'Sébastien Pingal'
  })

  const autre = `
Je suis maintenant à la recherche d'une nouvelle aventure. Je cherche un projet challengeant et passionnant.

Je sais bien que je n'ai pas assez d'expérience, mais je suis passionné et motivé, je suis prêt à donner tout ce que j'ai pour votre offre. 

Testez-moi.
`

  const exemple = `Bonjour,

Il y a trois ans, j'ai fait une reconversion. J'étais ingénieur du son et compositeur et j'ai décidé de plonger dans ma nouvelle passion.
Depuis, j'ai fait la refonte complète d'un SaaS de simulation d'investissement immobilier. 
J'ai monté une entreprise et ai donc créé de zéro un site permettant aux travailleurs en télétravail de se rencontrer. 
Et dernièrement, j'ai créé un site de gestion de projets de rénovation immobilière : ce site permet de mettre en relation les agences immobilières et leurs clients avec les sociétés de BTP. Ce dernier site comprend aussi un système de génération automatisée de devis et de factures.

Je suis maintenant à la recherche d'une nouvelle aventure. Je cherche un projet challengeant et passionnant.

Voilà ce que vous allez aimer chez moi :
- Je travaille avec Next, React, Tailwind ET Shadcn/ui (!!) tous les jours, je connais très bien ces technologies. https://sebastienpingal.dev
- J'ai une expérience fullstack qui facilitera la compréhension des enjeux du back.
- Je suis touche à tout, rigoureux, et je travaille efficacement.
- Je n'ai pas peur des nouveaux défis, bien au contraire, c'est ce qui me donne de l'énergie au quotidien.
- une grosse expérience d'Ux/Ui

Et voilà ce que j'aime chez vous :
- J'ai l'impression de rejoindre une équipe dynamique et sympathique. 
- Participer aux enjeux de développement durable.
- Les petits bonus comme la mutuelle et le vélo électrique a 1euro/jour qui montre que votre société tient au bien-être de ses employés. 

Testez-moi.

Sébastien Pingal`

  const handleChange = (value: string) => {
    setLetterData(prev => ({
      ...prev,
      recipient: {
        company: value
      }
    }))
  }

  const handleContentChange = (value: string) => {
    setLetterData(prev => ({
      ...prev,
      content: value
    }))
  }

  if (showPDF) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm h-full">
        <div className="fixed inset-10">
          <Button
            onClick={() => setShowPDF(false)}
            className="absolute top-2 right-36 z-10"
          >
            Close
          </Button>
          <MotivationLetterPDFRenderer
            data={letterData}
            theme={theme === 'light' ? 'light' : 'dark'}
          />
        </div>
      </div>
    )
  }

  return (
    <div className='w-full flex flex-col gap-4'>
      <TalkingLogo
        text="Write your motivation letter here. I'll help you make it look professional! 📝"
        littleHead={true}
        tooltip={true}
        className='w-full mb-4 bg-background/40 backdrop-blur-sm p-4 rounded-xl'
      />

      <div className="glassPanel flex flex-col gap-6 aspect-[1/1.4134] p-8">
        <Button
          onClick={() => setShowPDF(true)}
          className='absolute top-5 right-5'
        >
          <Download className='w-4 h-4 mr-2' /> Export to PDF
        </Button>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">Recipient Information</h3>
          <Input
            placeholder="Company Name"
            value={letterData.recipient.company}
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">Letter Details</h3>
          <Input
            placeholder="Subject"
            value={letterData.subject}
            onChange={(e) => setLetterData(prev => ({ ...prev, subject: e.target.value }))}
          />
          <Textarea
            placeholder="Write your motivation letter here..."
            className="min-h-[300px]"
            value={letterData.content}
            onChange={(e) => handleContentChange(e.target.value)}
          />
          <Input
            placeholder="Signature"
            value={letterData.signature}
            onChange={(e) => setLetterData(prev => ({ ...prev, signature: e.target.value }))}
          />
        </div>
      </div>
    </div>
  )
}

export default MotivationLetterPage 