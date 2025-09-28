import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function PUT(request, { params }) {
  try {
    await requireAuth()
    
    const { id } = params
    const data = await request.json()
    
    const link = await prisma.link.update({
      where: { id },
      data: {
        label: data.label,
        url: data.url,
      },
    })
    
    return NextResponse.json(link)
  } catch (error) {
    console.error('Error updating link:', error)
    return NextResponse.json({ error: 'Failed to update link' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAuth()
    
    const { id } = params
    
    await prisma.link.delete({
      where: { id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting link:', error)
    return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 })
  }
}
