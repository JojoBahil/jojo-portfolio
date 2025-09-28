import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function PUT(request, { params }) {
  try {
    await requireAuth()
    
    const { id } = params
    const data = await request.json()

    const training = await prisma.training.update({
      where: { id },
      data: {
        title: data.title,
        institution: data.institution,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description,
        certificate: data.certificate,
        order: data.order,
      },
    })
    
    // Revalidate the main page to update the public site
    revalidatePath('/')
    
    return NextResponse.json(training)
  } catch (error) {
    console.error('Error updating training:', error)
    return NextResponse.json({ error: 'Failed to update training' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAuth()
    
    const { id } = params

    await prisma.training.delete({
      where: { id },
    })
    
    // Revalidate the main page to update the public site
    revalidatePath('/')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting training:', error)
    return NextResponse.json({ error: 'Failed to delete training' }, { status: 500 })
  }
}
