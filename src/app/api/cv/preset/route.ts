import { auth as getServerSession } from '../../auth/[...nextauth]/auth'
import { NextResponse } from 'next/server'
import { saveCVPreset, getCVPresets, getUser } from '@/app/actions'


export async function POST(req: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { title, data } = await req.json()
    const email = session.user.email ?? undefined; // Ensure email is string or undefined
    const user = await getUser({ email })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const cv = await saveCVPreset(user.id, title, data)

    return NextResponse.json(cv)

  } catch (error) {
    console.error('❌ Error saving CV preset:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const email = session.user.email ?? undefined; // Ensure email is string or undefined
    const user = await getUser({ email })
    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }
    const cvs = await getCVPresets(user.id)

    return NextResponse.json(cvs)
  } catch (error) {
    console.error('❌ Error fetching CV presets:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 