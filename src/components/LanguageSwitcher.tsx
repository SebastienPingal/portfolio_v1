'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { setCookie, getCookie } from 'cookies-next'
import { useTransition, useEffect, useState } from 'react'

export default function LanguageSwitcher() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [currentLocale, setCurrentLocale] = useState('fr')

  useEffect(() => {
    setCurrentLocale((getCookie('NEXT_LOCALE') as string) || 'fr')
  }, [])

  const switchLanguage = (newLocale: string) => {
    if (newLocale === currentLocale) return

    startTransition(() => {
      setCookie('NEXT_LOCALE', newLocale)
      setCurrentLocale(newLocale)
      router.refresh()
    })
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        disabled={isPending}
        onClick={() => switchLanguage(currentLocale === 'fr' ? 'en' : 'fr')}
      >
        {isPending ? <span className="animate-spin">⟳</span> : currentLocale === 'fr' ? 'FR' : 'EN'}
      </Button>
    </div>
  )
} 