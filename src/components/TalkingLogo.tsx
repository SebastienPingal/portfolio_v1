"use client"
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { Input } from './ui/input'
import { Button } from './ui/button'
import DOMPurify from 'isomorphic-dompurify'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'

const MeBlack = '/img/me_black.svg'
const MeWhite = '/img/me_white.svg'

const TalkingLogo = ({ className, text, littleHead = false, tooltip = false }: { className?: string, text?: string, littleHead?: boolean, tooltip?: boolean }) => {
  const t = useTranslations('TalkingLogo')
  const locale = useLocale()
  const { theme } = useTheme()
  const [userInput, setUserInput] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayTexts, setDisplayTexts] = useState<string[]>([])
  const [fullText, setFullText] = useState('')
  const [meImage, setMeImage] = useState(MeBlack)

  useEffect(() => {
    if (text) {
      setFullText(text)
    } else {
      const nextjs = `<span class="animate-sparkle bg-gradient-to-r from-secondary via-white to-secondary bg-[length:200%_100%] bg-clip-text text-transparent font-bold">${t('technologies.nextjs')}</span>`
      const react = `<span class="animate-sparkle bg-gradient-to-r from-secondary via-white to-secondary bg-[length:200%_100%] bg-clip-text text-transparent font-bold">${t('technologies.react')}</span>`
      
      setFullText(t('defaultText', {
        nextjs,
        react
      }))
    }
    setDisplayTexts([])
  }, [text, locale, t])

  const onSubmit = async () => {
    try {
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userInput,
          locale
        })
      })
      const data = await response.json()
      setFullText(data.text)
      setDisplayTexts([])
      setUserInput('')
    } catch (error) {
      console.log('❌ Error:', error)
    }
  }

  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        if (fullText[i] === '<') {
          while (i < fullText.length && fullText[i] !== '>') {
            i++
          }
        }
        const currentTexts = fullText.slice(0, i + 1).split('\n')
        setDisplayTexts(currentTexts.map(text => 
          DOMPurify.sanitize(text, 
            { ALLOWED_TAGS: ['a', 'span'], ALLOWED_ATTR: ['href', 'class'] }
          )
        ))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 10)

    return () => clearInterval(typingInterval)
  }, [fullText])

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setMeImage(theme === 'dark' ? MeWhite : MeBlack)
  }, [theme])

  return (
    <div className={`${className} flex flex-col gap-8 talking-logo`} >
      <div className="flex gap-2 items-end justify-start">
        <div className={`relative cursor-pointer transition-transform flex-shrink-0 ${isAnimating ? 'animate-wiggle' : ''} ${littleHead ? 'w-20 h-20' : 'w-40 h-40'}`}>
          <Image src={meImage} fill={true} alt='Sébastien' />
        </div>

        <div className="flex flex-col gap-2">
          {displayTexts.map((text, index) => (
            <div key={index} className="glassPanel p-4 rounded-xl">
              <p className="text-lg overflow-visible w-fit" dangerouslySetInnerHTML={{ __html: text }}></p>
            </div>
          ))}
        </div>
      </div>

      {!tooltip && <div className='flex flex-col gap-2'>
        <Input
          type="text"
          placeholder={t('inputPlaceholder')}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="font-handwriting"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit()
            }
          }}
        />
        {userInput && <Button className='w-full' type='button' onClick={onSubmit}>{t('submit')}</Button>}
      </div>}
    </div>
  )
}

export default TalkingLogo
