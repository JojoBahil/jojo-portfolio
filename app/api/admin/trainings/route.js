import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const trainings = await prisma.training.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
    })
    return NextResponse.json(trainings)
  } catch (error) {
    console.error('Error fetching trainings:', error)
    return NextResponse.json({ error: 'Failed to fetch trainings' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await requireAuth()
    
    const data = await request.json()
    
    // Get the highest order number and add 1 for new training
    const lastTraining = await prisma.training.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    })
    const newOrder = (lastTraining?.order || 0) + 1

    const training = await prisma.training.create({
      data: {
        title: data.title,
        institution: data.institution,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description,
        certificate: data.certificate,
        order: newOrder,
      },
    })
    
    // Revalidate the main page to update the public site
    revalidatePath('/')
    
    return NextResponse.json(training)
  } catch (error) {
    console.error('Error creating training:', error)
    return NextResponse.json({ error: 'Failed to create training' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    await requireAuth()
    
    const { trainingOrders } = await request.json()
    
    // Update all training orders in a transaction
    const updates = trainingOrders.map(({ id, order }) =>
      prisma.training.update({
        where: { id },
        data: { order }
      })
    )
    
    await prisma.$transaction(updates)
    
    // Revalidate the main page to update the public site
    revalidatePath('/')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering trainings:', error)
    return NextResponse.json({ error: 'Failed to reorder trainings' }, { status: 500 })
  }
}
