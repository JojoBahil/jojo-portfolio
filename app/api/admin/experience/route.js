import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
    })
    return NextResponse.json(experiences)
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await requireAuth()

    const data = await request.json()

    // Handle highlights - it's already a JSON string from the admin form
    let highlights = '[]'
    if (data.highlights) {
      if (typeof data.highlights === 'string') {
        // Already a JSON string from admin form
        highlights = data.highlights
      } else {
        // If it's an array, stringify it
        highlights = JSON.stringify(data.highlights)
      }
    }

    const experience = await prisma.experience.create({
      data: {
        role: data.role,
        company: data.company,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        summary: data.summary,
        highlights: highlights,
      },
    })
    return NextResponse.json(experience)
  } catch (error) {
    console.error('Error creating experience:', error)
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    )
  }
}
