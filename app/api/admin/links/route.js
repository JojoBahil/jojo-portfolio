import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { label: 'asc' },
    })
    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await requireAuth()
    
    const data = await request.json()
    
    const link = await prisma.link.create({
      data: {
        label: data.label,
        url: data.url,
      },
    })
    
    return NextResponse.json(link)
  } catch (error) {
    console.error('Error creating link:', error)
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 })
  }
}
