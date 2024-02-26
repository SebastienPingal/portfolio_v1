import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename') || ''

  if (!filename) {
    return new NextResponse(null, { status: 400, statusText: 'No filename provided' })
  }

  const blob = await put(filename, await request.arrayBuffer(), {
    access: 'public',
  })

  return NextResponse.json(blob)
}