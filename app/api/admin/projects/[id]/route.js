import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function PUT(request, { params }) {
  try {
    await requireAuth()
    
    const { id } = params
    const data = await request.json()
    
    const project = await prisma.project.update({
      where: { id },
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
        order: data.order !== undefined ? data.order : undefined,
      },
    })
    
    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAuth()
    
    const { id } = params
    
    await prisma.project.delete({
      where: { id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
