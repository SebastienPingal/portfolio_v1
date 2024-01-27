import React from 'react'
import { getStacks } from '../actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { MoveUpRight } from 'lucide-react'
import { Icon } from '@icons-pack/react-simple-icons'

const StackPage = async () => {
  const techStack = await getStacks()

  return (
    <div className="p-5 w-full">
      <h1 className="mb-5">My Tech Stack</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {techStack.map((tech, index) => {
          return (
          <Card key={index} className='w-full'>
            <CardHeader>
              <CardTitle className='flex gap-3 items-center'>
                <div className='bg-white/90 w-16 h-16 rounded relative'>
                  <Image src={tech.logo} alt={tech.title} fill={true} className='object-contain p-1' />
                </div>
                  <h2>{tech.title}</h2>

              </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
              <CardDescription>{tech.description}</CardDescription>
              <a href={tech.link} target="_blank" rel="noreferrer">
                <Button className='flex gap-2'>
                  Learn More <MoveUpRight className="w-4 h-4" />
                </Button>
              </a>
            </CardContent>
          </Card>
        ) })}
      </div>
    </div>
  )
}

export default StackPage