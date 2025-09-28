import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function PUT(request, { params }) {
  try {
    await requireAuth()
    
    const { id } = params
    const data = await request.json()
    
    const tech = await prisma.tech.update({
      where: { id },
      data: {
        label: data.label,
        level: data.level,
        group: data.group,
      },
    })
    
    return NextResponse.json(tech)
  } catch (error) {
    console.error('Error updating tech:', error)
    return NextResponse.json({ error: 'Failed to update tech' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAuth()
    
    const { id } = params
    
    await prisma.tech.delete({
      where: { id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tech:', error)
    return NextResponse.json({ error: 'Failed to delete tech' }, { status: 500 })
  }
}
