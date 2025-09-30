import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function POST() {
  try {
    await requireAuth()

    // Get all experiences
    const experiences = await prisma.experience.findMany()

    let fixedCount = 0
    const results = []

    for (const experience of experiences) {
      let needsUpdate = false
      let newHighlights = experience.highlights

      // Check if highlights are corrupted
      try {
        JSON.parse(experience.highlights)
      } catch (error) {
        // Try to fix the JSON
        let fixedString = experience.highlights

        // Fix unterminated strings
        if (fixedString.includes('"') && !fixedString.endsWith('"')) {
          const lastQuoteIndex = fixedString.lastIndexOf('"')
          if (lastQuoteIndex > 0) {
            fixedString = fixedString.substring(0, lastQuoteIndex + 1)
          }
        }

        // Ensure proper JSON array format
        if (!fixedString.startsWith('[')) {
          fixedString = '[' + fixedString
        }
        if (!fixedString.endsWith(']')) {
          fixedString = fixedString + ']'
        }

        // Try to parse the fixed string
        try {
          const parsed = JSON.parse(fixedString)
          if (Array.isArray(parsed)) {
            newHighlights = JSON.stringify(parsed)
            needsUpdate = true
          }
        } catch (secondError) {
          newHighlights = '[]'
          needsUpdate = true
        }
      }

      // Update if needed
      if (needsUpdate) {
        await prisma.experience.update({
          where: { id: experience.id },
          data: { highlights: newHighlights },
        })
        fixedCount++
        results.push({
          id: experience.id,
          role: experience.role,
          oldHighlights: experience.highlights,
          newHighlights: newHighlights,
        })
      }
    }

    return NextResponse.json({
      message: `Fixed ${fixedCount} corrupted experience entries`,
      fixedCount,
      results,
    })
  } catch (error) {
    console.error('Error cleaning up experience data:', error)
    return NextResponse.json(
      { error: 'Failed to cleanup experience data' },
      { status: 500 }
    )
  }
}
