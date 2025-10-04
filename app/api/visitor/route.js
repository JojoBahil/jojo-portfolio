import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { ipAddress, userAgent, referer } = await request.json()
    
    // Create a new visitor record
    const visitor = await prisma.visitor.create({
      data: {
        ipAddress: ipAddress || 'unknown',
        userAgent: userAgent || null,
        referer: referer || null,
      },
    })

    return NextResponse.json({ 
      success: true, 
      visitorId: visitor.id 
    })
  } catch (error) {
    console.error('Visitor tracking error:', error)
    return NextResponse.json({ 
      error: 'Failed to track visitor' 
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  try {
    // Get total visitor count
    const totalVisitors = await prisma.visitor.count()
    
    // Get unique visitors (by IP address)
    const uniqueVisitors = await prisma.visitor.groupBy({
      by: ['ipAddress'],
      _count: {
        ipAddress: true,
      },
    })
    
    // Get visitors from today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayVisitors = await prisma.visitor.count({
      where: {
        visitedAt: {
          gte: today,
        },
      },
    })
    
    // Get visitors from this week
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const weekVisitors = await prisma.visitor.count({
      where: {
        visitedAt: {
          gte: weekAgo,
        },
      },
    })

    return NextResponse.json({
      totalVisitors,
      uniqueVisitors: uniqueVisitors.length,
      todayVisitors,
      weekVisitors,
    })
  } catch (error) {
    console.error('Visitor stats error:', error)
    return NextResponse.json({ 
      error: 'Failed to get visitor stats' 
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
