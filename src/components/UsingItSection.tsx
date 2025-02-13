import { StackExtended } from '@/types/stack'
import UsingItAvatarStack from './UsingItAvatarStack'
import UsingItButton from './UsingItButton'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/app/api/auth/[...nextauth]/auth'

const UsingItSection = async ({ stack, userMail, usingIt, tooltiped }: { stack: StackExtended, userMail: string, usingIt: boolean, tooltiped: boolean }) => {
  const t = await getTranslations('UsingItSection')
  const session = await auth()

  return (
    <div className={`flex flex-col gap-2 ${stack.users.length > 0 ? 'bg-primary/20 p-2' : ''} rounded`}>
      {session?.user &&
        <UsingItButton stack={stack} usingIt={usingIt} userMail={userMail} tooltiped={tooltiped} />
      }
      {stack.users.length > 0 &&
        <>
          <p className='text-sm text-foreground'>{t('usersUsingIt')}:</p>
          <UsingItAvatarStack users={stack.users} />
        </>
      }
    </div>
  )
}

export default UsingItSection