import React from 'react'

interface SectionProps {
  title?: string
  children: React.ReactNode
}

export const Section: React.FC<SectionProps> = ({ title, children }) => (
  <section className="flex flex-col gap-2 glassPanel">
    {title && <h3>{title}</h3>}
    {children}
  </section>
) 