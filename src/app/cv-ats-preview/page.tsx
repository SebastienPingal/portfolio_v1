import { redirect } from "next/navigation"

import { auth } from "@/app/api/auth/[...nextauth]/auth"
import CVAtsPreview from "./CVAtsPreview"

const CVAtsPreviewPage = async () => {
  const session = await auth()

  if (!session?.user?.email || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    redirect("/")
  }

  return <CVAtsPreview />
}

export default CVAtsPreviewPage
