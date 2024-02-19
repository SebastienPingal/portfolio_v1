import { User } from "@prisma/client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const UsingItAvatarStack = ({ users }: { users: User[] }) => {
  return (
    <div>
      {users.map((user) => (
        <Avatar key={user.id}>
          <AvatarImage src={user.image || ''} />
          <AvatarFallback>{user.firstname?.[0]}{user.lastname?.[0]}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  )
}

export default UsingItAvatarStack