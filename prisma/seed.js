const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clear existing data
  await prisma.link.deleteMany()
  await prisma.media.deleteMany()
  await prisma.tech.deleteMany()
  await prisma.experience.deleteMany()
  await prisma.project.deleteMany()

  // Seed Projects
  const projects = [
    {
      title: 'Regional Coordinator Portal V2',
      slug: 'regional-coordinator-portal-v2',
      summary: 'Enables UniFAST Regional Coordinators to update/manage validation and disbursement status of TES grantees.',
      description: 'A comprehensive portal system that allows regional coordinators to efficiently manage TES (Tertiary Education Subsidy) grantees. Features include real-time status updates, validation workflows, and disbursement tracking with detailed reporting capabilities.',
      tags: JSON.stringify(['Next.js', 'React', 'Tailwind', 'Node.js', 'Prisma', 'MySQL']),
      repoUrl: null,
      liveUrl: null,
      coverId: null,
    },
    {
      title: 'LMPC Application Portal',
      slug: 'lmpc-application-portal',
      summary: 'Lets TES students apply for LANDBANK Mastercard Prepaid Card.',
      description: 'Streamlined application portal for TES students to apply for LANDBANK Mastercard Prepaid Cards. Includes document upload, status tracking, and automated validation processes.',
      tags: JSON.stringify(['Next.js', 'React', 'Tailwind', 'Node.js', 'Prisma', 'MySQL']),
      repoUrl: null,
      liveUrl: null,
      coverId: null,
    },
    {
      title: 'LMPC Admin Portal',
      slug: 'lmpc-admin-portal',
      summary: 'Streamlines LMPC application processing for admins.',
      description: 'Administrative interface for processing LMPC applications with advanced filtering, bulk operations, and comprehensive reporting tools.',
      tags: JSON.stringify(['React', 'Next.js', 'Tailwind']),
      repoUrl: null,
      liveUrl: null,
      coverId: null,
    },
    {
      title: 'Monitoring Tool Admin Portal',
      slug: 'monitoring-tool-admin-portal',
      summary: 'For PMED staff to visualize data from Digitized HEI Monitoring Tool; includes account management and submission tracking.',
      description: 'Advanced analytics dashboard for PMED staff featuring data visualization, account management, and comprehensive submission tracking with interactive charts and reports.',
      tags: JSON.stringify(['Next.js', 'React', 'Tailwind', 'Chart.js']),
      repoUrl: null,
      liveUrl: null,
      coverId: null,
    },
    {
      title: 'FHE Automated Billing System',
      slug: 'fhe-automated-billing-system',
      summary: 'Automates tuition/fee computations for LUCs based on certified data.',
      description: 'Automated billing system that processes tuition and fee computations for Local Universities and Colleges (LUCs) using certified data sources with real-time calculations and reporting.',
      tags: JSON.stringify(['Next.js', 'React', 'Tailwind', 'Node.js', 'Prisma']),
      repoUrl: null,
      liveUrl: null,
      coverId: null,
    },
    {
      title: 'Digitized HEI Monitoring Tool',
      slug: 'digitized-hei-monitoring-tool',
      summary: 'Web app for SUCs/LUCs/private HEIs for monitoring and data management.',
      description: 'Comprehensive monitoring tool for State Universities and Colleges (SUCs), Local Universities and Colleges (LUCs), and private Higher Education Institutions (HEIs) with advanced data management capabilities.',
      tags: JSON.stringify(['React', 'Next.js', 'Tailwind']),
      repoUrl: null,
      liveUrl: null,
      coverId: null,
    },
    {
      title: 'Admin Portal V2 (Field Operations Unit)',
      slug: 'admin-portal-v2-field-operations',
      summary: 'Manages reporting for TES/TDP.',
      description: 'Enhanced administrative portal for the Field Operations Unit managing comprehensive reporting for TES (Tertiary Education Subsidy) and TDP (Tulong Dunong Program) with advanced analytics.',
      tags: JSON.stringify(['React', 'Next.js', 'Tailwind']),
      repoUrl: null,
      liveUrl: null,
      coverId: null,
    },
    {
      title: 'Inventory Management System',
      slug: 'inventory-management-system',
      summary: 'Records/monitors procured items for the Administrative Unit.',
      description: 'Complete inventory management solution for tracking and monitoring procured items within the Administrative Unit, featuring real-time updates, reporting, and automated alerts.',
      tags: JSON.stringify(['React', 'Next.js', 'Tailwind']),
      repoUrl: null,
      liveUrl: null,
      coverId: null,
    },
  ]

  for (const project of projects) {
    await prisma.project.create({
      data: project,
    })
  }

  // Seed Experience
  const experiences = [
    {
      role: 'ICT Unit Head',
      company: 'UniFAST Secretariat',
      startDate: new Date('2022-01-01'),
      endDate: null,
      summary: 'Leadership of end-to-end ICT projects; stakeholder orientations; agency coordination; design of mockups/flowcharts/swimlanes; DB optimization; procurement oversight; reporting; Ubuntu server ops (availability, stability, security, performance).',
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
      summary: 'Built LMPC Application & Admin Portals. Built FHE Billing Submission Tracker. Generated/processed critical database reports.',
      highlights: JSON.stringify([
        'Built LMPC Application & Admin Portals.',
        'Built FHE Billing Submission Tracker.',
        'Generated/processed critical database reports.',
      ]),
    },
  ]

  for (const experience of experiences) {
    await prisma.experience.create({
      data: experience,
    })
  }

  // Seed Tech Stack
  const techItems = [
    // Programming
    { label: 'JavaScript', group: 'Programming', level: 'Expert' },
    { label: 'PHP', group: 'Programming', level: 'Advanced' },
    { label: 'C#', group: 'Programming', level: 'Intermediate' },
    
    // Frameworks/Libraries/Plugins
    { label: 'React', group: 'Frameworks/Libraries', level: 'Expert' },
    { label: 'Next.js', group: 'Frameworks/Libraries', level: 'Expert' },
    { label: 'jQuery', group: 'Frameworks/Libraries', level: 'Advanced' },
    { label: 'Node.js', group: 'Frameworks/Libraries', level: 'Advanced' },
    { label: 'FPDF', group: 'Frameworks/Libraries', level: 'Intermediate' },
    { label: 'Bootstrap', group: 'Frameworks/Libraries', level: 'Advanced' },
    { label: 'Tailwind', group: 'Frameworks/Libraries', level: 'Expert' },
    { label: 'Prisma', group: 'Frameworks/Libraries', level: 'Advanced' },
    { label: 'Chart.js', group: 'Frameworks/Libraries', level: 'Intermediate' },
    
    // Databases
    { label: 'MySQL', group: 'Databases', level: 'Expert' },
    { label: 'PostgreSQL', group: 'Databases', level: 'Advanced' },
    { label: 'SQLite', group: 'Databases', level: 'Advanced' },
    { label: 'MSSQL', group: 'Databases', level: 'Intermediate' },
    
    // Tools/Platforms
    { label: 'Linux', group: 'Tools/Platforms', level: 'Advanced' },
    { label: 'HTML', group: 'Tools/Platforms', level: 'Expert' },
    { label: 'CSS', group: 'Tools/Platforms', level: 'Expert' },
    { label: 'GitHub', group: 'Tools/Platforms', level: 'Advanced' },
    { label: 'Postman', group: 'Tools/Platforms', level: 'Advanced' },
  ]

  for (const tech of techItems) {
    await prisma.tech.create({
      data: tech,
    })
  }

  // Seed Links
  const links = [
    { label: 'GitHub', url: 'https://github.com/yourhandle' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/yourhandle' },
    { label: 'Email', url: 'mailto:jbahil47@gmail.com' },
  ]

  for (const link of links) {
    await prisma.link.create({
      data: link,
    })
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
