import React from 'react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

const SignoutButton = ({ className }: { className?: string }) => {
  return (
    <Button variant="outline" className={className} onClick={() => signOut()}>
      Sign out
    </Button>
  )
}

export default SignoutButton

