import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function PUT(request, { params }) {
  try {
    await requireAuth()
    
    const { id } = params
    const data = await request.json()
    
    const media = await prisma.media.update({
      where: { id },
      data: {
        title: data.title,
        publicId: data.publicId,
        type: data.type,
      },
    })
    
    return NextResponse.json(media)
  } catch (error) {
    console.error('Error updating media:', error)
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAuth()
    
    const { id } = params
    
    await prisma.media.delete({
      where: { id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 })
  }
}
