import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function PUT(request, { params }) {
  try {
    await requireAuth()

    const { id } = params
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

    const experience = await prisma.experience.update({
      where: { id },
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
    console.error('Error updating experience:', error)
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAuth()

    const { id } = params

    await prisma.experience.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting experience:', error)
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    )
  }
}
