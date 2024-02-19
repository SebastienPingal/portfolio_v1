import { StackExtended } from '@/app/types'

import UsingItAvatarStack from './UsingItAvatarStack'
import UsingItButton from './UsingItButton'

const UsingItSection = ({ stack, userMail, usingIt }: { stack: StackExtended, userMail: string, usingIt: boolean }) => {

  return (
    <div className={`flex flex-col gap-2 ${stack.users.length > 0 ? 'bg-primary/20 p-2' : ''} rounded`}>
      <UsingItButton stack={stack} usingIt={usingIt} userMail={userMail} />
      {stack.users.length > 0 &&
        <>
          <p className='text-sm text-foreground'>Users using it:</p>
          <UsingItAvatarStack users={stack.users} />
        </>
      }
    </div>
  )
}

export default UsingItSection