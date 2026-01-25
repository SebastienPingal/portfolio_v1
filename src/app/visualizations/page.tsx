"use client"

import React from 'react'
import { CobwebPlot } from './components/CobwebPlot'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from 'next-intl'
import MarkdownInterpreter from '@/components/MarkdownInterpreter'

export default function VisualizationsPage() {
  const t = useTranslations('Visualizations')

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
      </div>

      <section className="flex flex-col gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              {t('logisticMap.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              {t('logisticMap.description')}
            </p>
            <div className="bg-muted p-4 rounded-md flex justify-center">
              <span className="text-2xl">
                <span>
                  x<sub>n+1</sub> = r&nbsp;·&nbsp;x<sub>n</sub>(1&nbsp;-&nbsp;x<sub>n</sub>)
                </span>
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              <MarkdownInterpreter content={t('logisticMap.instruction')} />
            </div>
          </CardContent>
        </Card>

        <CobwebPlot />
      </section>
    </div>
  )
}
