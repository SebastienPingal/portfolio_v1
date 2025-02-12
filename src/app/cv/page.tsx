'use client'
import { Switch } from '@/components/ui/switch'
import React, { useState, useEffect } from 'react'
import { englishCV as cvEn } from '../../../public/json/my-cv-en'
import { frenchCV as cvFr } from '../../../public/json/my-cv-fr'
import { CVData } from '../../types/CV'
import CV from './CV'
import TalkingLogo from '@/components/TalkingLogo'
import { Button } from '@/components/ui/button'
import { Save, Plus, Loader2, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { saveCVPreset, getCVPresets, deleteCVPreset, getUser } from '@/app/actions'
import { useToast } from '@/components/ui/use-toast'

interface CVPreset {
  id: string
  title: string
  data: CVData
  updatedAt: Date
}

const CVPage: React.FC = () => {
  const { toast } = useToast()
  const [language, setLanguage] = useState('en')
  const [cvData, setCvData] = useState<CVData>(language === 'en' ? cvEn : cvFr)
  const [presetTitle, setPresetTitle] = useState('')
  const [presets, setPresets] = useState<CVPreset[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  const text = 'Hey, if you want to create your own CV with my style, go <a href="/cv-sebifyer">here</a>'

  const loadPresets = async () => {
    try {
      // Always load default presets first
      const defaultPresets = await getCVPresets()
      let data = defaultPresets
      setPresets(data as unknown as CVPreset[])

      // Set cvData to the last preset if any
      if (data.length > 0) {
        const lastPreset = data[data.length - 1]
        if (lastPreset.data) {
          setCvData(lastPreset.data as unknown as CVData)
          setPresetTitle(lastPreset.title)
        }
      }

      toast({
        title: "Success", 
        description: "Presets loaded successfully"
      })
    } catch (error) {
      console.error('❌ Error loading presets:', error)
      toast({
        variant: "destructive",
        title: "Failed to load presets"
      })
    }
  }

  useEffect(() => {

    loadPresets()
  }, [session?.user?.email])

  const savePreset = async () => {
    if (!session?.user?.email || !presetTitle) return
    setIsLoading(true)
    toast({
      title: "Saving preset",
      description: "Please wait..."
    })

    try {
      const email = session.user.email
      if (!email) throw new Error('No email found')
      const user = await getUser({ email: email })
      if (!user) throw new Error('No user found')

      await saveCVPreset(user.id, presetTitle, cvData)
      console.log('🎉 Preset saved successfully')
      toast({
        title: "Success",
        description: "Preset saved successfully"
      })
      setPresetTitle('')
      loadPresets()
    } catch (error) {
      console.error('❌ Error saving preset:', error)
      toast({
        variant: "destructive",
        title: "Failed to save preset"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePreset = async (id: string) => {
    if (!session?.user?.email) {
      toast({
        variant: "destructive",
        title: "You must be logged in to delete a preset"
      })
      return
    }

    try {
      const email = session.user.email
      if (!email) throw new Error('No email found')
      const user = await getUser({ email: email })
      if (!user) throw new Error('No user found')
      await deleteCVPreset(id, user.id)
      toast({
        title: "Success",
        description: "Preset deleted successfully"
      })
      loadPresets()
    } catch (error) {
      console.error('❌ Error deleting preset:', error)
      toast({
        variant: "destructive",
        title: "Failed to delete preset"
      })
    }
  }

  const handlePresetChange = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId)
    if (preset) {
      setCvData(preset.data)
    }
  }

  return (
    <div className='w-full flex flex-col gap-4'>
      <TalkingLogo text={text} littleHead={true} tooltip={true} className='w-full mb-4 bg-background/40 backdrop-blur-sm p-4 rounded-xl' />

      <div className='w-full flex justify-center'>
        <div className='flex items-center'>
          <div className='flex gap-2'>
            {session?.user && (
              <>
                <Select defaultValue={presetTitle} onValueChange={handlePresetChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Load preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {presets.map(preset => (
                      <div key={preset.id} className="flex items-center justify-between p-2">
                        <SelectItem value={preset.id}>
                          {preset.title}
                        </SelectItem>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeletePreset(preset.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </SelectContent>
                </Select>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save Preset
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save CV Preset</DialogTitle>
                    </DialogHeader>
                    <div className='flex flex-col gap-2'>
                      <Input
                        placeholder="Preset name"
                        value={presetTitle}
                        onChange={(e) => setPresetTitle(e.target.value)}
                      />
                      <Button onClick={savePreset} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>

          {/* <div className='flex items-center gap-2'>
            <div className='text-sm text-foreground'>
              {language === 'en' ? 'English version' : 'Version Française'}
            </div>
            <Switch
              onClick={() => {
                setLanguage(language === 'en' ? 'fr' : 'en')
                setCvData(language === 'en' ? cvFr : cvEn)
              }}
              className='h-4'
            />
          </div> */}
        </div>
      </div>

      <CV
        data={cvData}
        language={language}
        showMe={true}
        onDataChange={setCvData}
        isUserConnected={!!session?.user && session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL}
      />
    </div>
  )
}

export default CVPage