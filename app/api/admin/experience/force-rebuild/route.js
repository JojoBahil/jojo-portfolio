import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function POST() {
  try {
    await requireAuth()

    // Force delete all experience data
    await prisma.experience.deleteMany({})

    // Wait a moment to ensure deletion is complete
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create new experience data with longer summaries and proper highlights
    const experiences = [
      {
        role: 'ICT Unit Head',
        company: 'UniFAST Secretariat',
        startDate: new Date('2022-01-01'),
        endDate: null,
        summary:
          'Leadership of end-to-end ICT projects; stakeholder orientations; agency coordination; design of mockups/flowcharts/swimlanes; DB optimization; procurement oversight; reporting; Ubuntu server ops (availability, stability, security, performance). Led comprehensive digital transformation initiatives that enhanced operational efficiency across all departments.',
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
          'Built LMPC Application & Admin Portals. Built FHE Billing Submission Tracker. Generated/processed critical database reports. Developed and maintained web applications that streamlined administrative processes and improved data management efficiency.',
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
          'As a Full Stack Software Engineer at UniFAST Secretariat, I contributed to the design, development, and maintenance of various web applications and systems. I worked on both frontend and backend technologies, ensuring seamless user experiences and robust system performance. Collaborated with cross-functional teams to deliver high-quality software solutions.',
        highlights: JSON.stringify([
          'Developed responsive web applications using React and Next.js',
          'Implemented RESTful APIs using Node.js and Express',
          'Optimized database queries and improved system performance',
          'Collaborated with cross-functional teams on project delivery',
          'Maintained and updated existing legacy systems',
        ]),
      },
    ]

    // Create all experiences with explicit data
    const createdExperiences = []
    for (const experience of experiences) {
      const created = await prisma.experience.create({
        data: {
          role: experience.role,
          company: experience.company,
          startDate: experience.startDate,
          endDate: experience.endDate,
          summary: experience.summary,
          highlights: experience.highlights,
        },
      })
      createdExperiences.push(created)
    }

    // Verify the data was created correctly
    const verification = await prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
    })

    const results = verification.map((exp) => ({
      id: exp.id,
      role: exp.role,
      company: exp.company,
      summaryLength: exp.summary?.length,
      summaryPreview: exp.summary?.substring(0, 100) + '...',
      highlightsRaw: exp.highlights,
      highlightsCount: JSON.parse(exp.highlights || '[]').length,
    }))

    return NextResponse.json({
      message: 'FORCE database rebuild completed successfully!',
      createdCount: createdExperiences.length,
      verification: results,
    })
  } catch (error) {
    console.error('Error in FORCE rebuild:', error)
    return NextResponse.json(
      {
        error: 'Failed to force rebuild database',
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    )
  }
}
