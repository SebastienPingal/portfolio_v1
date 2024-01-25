import React from 'react'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'

const SigninButton = ({ className }: { className?: string }) => {
  return (
    <Button variant="outline" className={className} onClick={() => signIn('linkedin')}>
      Sign in
    </Button>
  )
}

export default SigninButton