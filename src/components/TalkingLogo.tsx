"use client"
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { Input } from './ui/input'
import { Button } from './ui/button'
import DOMPurify from 'isomorphic-dompurify'

const MeBlack = '/img/me_black.svg'
const MeWhite = '/img/me_white.svg'

const TalkingLogo = ({ className }: { className: string }) => {
  const { theme } = useTheme()
  const [userInput, setUserInput] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayTexts, setDisplayTexts] = useState<string[]>([])
  const [fullText, setFullText] = useState(`Hey, I'm Sébastien. I am designer, software tinkerer, music maker, and sometimes a teacher.  I am currently working on this website, so it's a bit empty for now.  But I'm glad to finally making some kind of hub for all my projects.
How can I help you today?`)

  const onSubmit = async () => {
    try {
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput })
      })
      const data = await response.json()
      setFullText(data.text)
      setDisplayTexts([])
      setUserInput('')
    } catch (error) {
      console.log('Error:', error, '🚀')
    }
  }

  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        const currentTexts = fullText.slice(0, i + 1).split('\n')
        setDisplayTexts(currentTexts.map(text => DOMPurify.sanitize(text, { ALLOWED_TAGS: ['a'] })))
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

  return (
    <div className={`${className} flex flex-col gap-8 talking-logo`} >
      <div className="flex gap-2 items-end justify-start">
        <div className={`relative cursor-pointer transition-transform w-40 h-40 flex-shrink-0 ${isAnimating ? 'animate-wiggle' : ''}`}>
          <Image src={theme === 'dark' ? MeWhite : MeBlack} fill={true} alt='Sébastien' />
        </div>
        <div className="flex flex-col gap-2">
          {displayTexts.map((text, index) => (
            <div key={index} className="border glassPanel p-4 rounded-xl">
              <p className="text-lg overflow-hidden w-fit" dangerouslySetInnerHTML={{ __html: text }}></p>
            </div>
          ))}
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <Input
          type="text"
          placeholder="Ask me anything..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="font-handwriting"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit()
            }
          }}
        />
        { userInput && <Button className='w-full' type='button' onClick={onSubmit}>Submit</Button> }
      </div>
    </div>
  )
}

export default TalkingLogo
