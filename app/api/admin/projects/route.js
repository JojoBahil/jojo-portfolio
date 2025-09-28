import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await requireAuth()
    
    const data = await request.json()
    
    // Get the highest order number and add 1 for new project
    const lastProject = await prisma.project.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    })
    const newOrder = (lastProject?.order || 0) + 1

    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        summary: data.summary,
        description: data.description || data.summary,
        tags: data.tags || '[]', // Already JSON string from frontend
        repoUrl: data.repoUrl,
        liveUrl: data.liveUrl,
        coverId: data.coverId,
        mediaIds: data.mediaIds ? JSON.stringify(data.mediaIds) : '[]',
        projectType: data.projectType || 'developed',
        order: newOrder,
      },
    })
    
    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    await requireAuth()
    
    const { projectOrders } = await request.json()
    
    // Update all project orders in a transaction
    const updates = projectOrders.map(({ id, order }) =>
      prisma.project.update({
        where: { id },
        data: { order }
      })
    )
    
    await prisma.$transaction(updates)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering projects:', error)
    return NextResponse.json({ error: 'Failed to reorder projects' }, { status: 500 })
  }
}
