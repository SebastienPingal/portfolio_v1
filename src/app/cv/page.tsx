'use client'
import { Switch } from '@/components/ui/switch'
import React, { useState } from 'react'
import cvEn from '../../../public/json/my-cv-en.json'
import cvFr from '../../../public/json/my-cv-fr.json'
import { CVData } from '../../types/CV'
import CV from './CV'
import TalkingLogo from '@/components/TalkingLogo'
const CVPage: React.FC = () => {
  const [language, setLanguage] = useState('en')
  const cvData = language === 'en' ? cvEn : cvFr
  
  const text = 'Hey, if you want to create your own CV with my style, go <a href="/cv-sebifyer">here</a >'


  return (
    <div className='flex flex-col gap-4'>
      <TalkingLogo text={text} littleHead={true} tooltip={true} className='mb-4 bg-background/40 backdrop-blur-sm p-4 rounded-xl' />
      <div className='flex justify-end gap-2'>
        <div className='text-sm text-foreground'>{language === 'en' ? 'English version' : 'Version Française'}</div>
        <Switch onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')} className='h-4'/>
      </div>
      <CV data={cvData as CVData} language={language} showMe={true} />
    </div>
  )
}

export default CVPage