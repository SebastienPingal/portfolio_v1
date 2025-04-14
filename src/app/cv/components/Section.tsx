import React from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export const Section: React.FC<SectionProps> = ({ title, children, className }) => (
  <section className={cn("flex flex-col gap-2 glassPanel", className)}>
    {title && <h3>{title}</h3>}
    {children}
  </section>
) 