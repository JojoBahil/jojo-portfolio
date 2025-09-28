import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const tech = await prisma.tech.findMany({
      orderBy: { label: 'asc' },
    })
    return NextResponse.json(tech)
  } catch (error) {
    console.error('Error fetching tech:', error)
    return NextResponse.json({ error: 'Failed to fetch tech' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await requireAuth()
    
    const data = await request.json()
    
    const tech = await prisma.tech.create({
      data: {
        label: data.label,
        level: data.level,
        group: data.group,
      },
    })
    
    return NextResponse.json(tech)
  } catch (error) {
    console.error('Error creating tech:', error)
    return NextResponse.json({ error: 'Failed to create tech' }, { status: 500 })
  }
}
