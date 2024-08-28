"use client"
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { Input } from './ui/input'

const MeBlack = '/me_black.svg'
const MeWhite = '/me_white.svg'

const TalkingLogo = ({ className }: { className: string }) => {
  const { theme } = useTheme()
  const [userInput, setUserInput] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayTexts, setDisplayTexts] = useState<string[]>([])
  const fullText = `Hey, I'm Sébastien. I am designer, software tinkerer, music maker, and sometimes a teacher.  I am currently working on this website, so it's a bit empty for now.  But I'm glad to finally making some kind of hub for all my projects.
How can I help you today?`

  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      setIsAnimating(true)

      if (i < fullText.length) {
        const currentTexts = fullText.slice(0, i + 1).split('\n')
        setDisplayTexts(currentTexts)
        i++
      } else {
        clearInterval(typingInterval)
        setIsAnimating(false)
      }
    }, 10)

    return () => clearInterval(typingInterval)
  }, [])

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`${className} flex flex-col gap-8`}>
      <div className="flex gap-2 items-end justify-start">
        <div className={`relative cursor-pointer transition-transform w-40 h-40 flex-shrink-0 ${isAnimating ? 'animate-wiggle' : ''}`}>
          <Image src={theme === 'dark' ? MeWhite : MeBlack} fill={true} alt='Sébastien' />
        </div>
        <div className="flex flex-col gap-2">
          {displayTexts.map((text, index) => (
            <div key={index} className="border glassPanel p-4 rounded-xl">
              <p className="text-lg overflow-hidden w-fit">{text}</p>
            </div>
          ))}
        </div>
      </div>
      <Input
        type="text"
        placeholder="Ask me anything..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="font-handwriting"
      />
    </div>
  )
}

export default TalkingLogo
