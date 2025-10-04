import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function POST() {
  try {
    await requireAuth()

    console.log('Starting comprehensive database fix...')

    // First, let's clear all existing experience data
    await prisma.experience.deleteMany()
    console.log('Cleared existing experience data')

    // Now let's recreate the experience data with proper highlights
    const experiences = [
      {
        role: 'ICT Unit Head',
        company: 'UniFAST Secretariat',
        startDate: new Date('2022-01-01'),
        endDate: null,
        summary:
          'Leadership of end-to-end ICT projects; stakeholder orientations; agency coordination; design of mockups/flowcharts/swimlanes; DB optimization; procurement oversight; reporting; Ubuntu server ops (availability, stability, security, performance).',
        highlights: JSON.stringify([
          'Led end-to-end development and implementation of ICT projects.',
          'Conducted stakeholder orientations and partner agency coordination.',
          'Designed mockups/flowcharts/swimlanes for process streamlining.',
          'Managed/optimized UniFAST databases.',
          'Oversaw ICT procurement and executive reporting.',
          'Maintained Ubuntu servers for availability, security, performance.',
        ]),
      },
      {
        role: 'Web Developer / Data Processor',
        company: 'UniFAST Secretariat',
        startDate: new Date('2017-01-01'),
        endDate: new Date('2021-12-31'),
        summary:
          'Built LMPC Application & Admin Portals. Built FHE Billing Submission Tracker. Generated/processed critical database reports.',
        highlights: JSON.stringify([
          'Built LMPC Application & Admin Portals.',
          'Built FHE Billing Submission Tracker.',
          'Generated/processed critical database reports.',
        ]),
      },
      {
        role: 'Full Stack Software Engineer',
        company: 'UniFAST Secretariat',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2022-12-31'),
        summary:
          'As a Full Stack Software Engineer at UniFAST Secretariat, I contributed to the design, development, and maintenance of various web applications and systems. I worked on both frontend and backend technologies, ensuring seamless user experiences and robust system performance.',
        highlights: JSON.stringify([
          'Developed responsive web applications using React and Next.js',
          'Implemented RESTful APIs using Node.js and Express',
          'Optimized database queries and improved system performance',
          'Collaborated with cross-functional teams on project delivery',
          'Maintained and updated existing legacy systems',
        ]),
      },
    ]

    // Create all experiences
    for (const experience of experiences) {
      await prisma.experience.create({
        data: experience,
      })
      console.log(`Created experience: ${experience.role}`)
    }

    // Verify the data
    const createdExperiences = await prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
    })

    const results = createdExperiences.map((exp) => ({
      id: exp.id,
      role: exp.role,
      company: exp.company,
      summaryLength: exp.summary?.length,
      highlightsCount: JSON.parse(exp.highlights || '[]').length,
      highlightsPreview: JSON.parse(exp.highlights || '[]').slice(0, 2),
    }))

    console.log('Database fix completed successfully!')
    console.log('Results:', results)

    return NextResponse.json({
      message: 'Database fixed successfully!',
      createdCount: createdExperiences.length,
      results,
    })
  } catch (error) {
    console.error('Error fixing database:', error)
    return NextResponse.json(
      {
        error: 'Failed to fix database',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
