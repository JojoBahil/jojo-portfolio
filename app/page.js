import { prisma } from '@/lib/prisma'
import Section from '@/components/Section'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Trainings from '@/components/Trainings'
import Projects from '@/components/Projects'
import TechStack from '@/components/TechStack'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'

export const revalidate = 60 // Revalidate every minute

async function getData() {
  try {
    const [projects, experiences, trainings, techItems, links] = await Promise.all([
      prisma.project.findMany({
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' }
        ],
      }),
      prisma.experience.findMany({
        orderBy: { startDate: 'desc' },
      }),
      prisma.training.findMany({
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' }
        ],
      }),
      prisma.tech.findMany({
        orderBy: { label: 'asc' },
      }),
      prisma.link.findMany({
        orderBy: { label: 'asc' },
      }),
    ])

    return { projects, experiences, trainings, techItems, links }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { projects: [], experiences: [], trainings: [], techItems: [], links: [] }
  }
}

export default async function HomePage() {
  const { projects, experiences, trainings, techItems, links } = await getData()

  // Create breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: process.env.NEXT_PUBLIC_SITE_URL || 'https://jasonbahil.dev',
      },
    ],
  }

  // Create projects schema
  const projectsSchema = projects.map((project) => {
    let tags = []
    try {
      tags = JSON.parse(project.tags || '[]')
    } catch (error) {
      console.error('Error parsing project tags:', error)
      tags = []
    }
    
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: project.title,
      description: project.summary,
      url: project.liveUrl || project.repoUrl,
      author: {
        '@type': 'Person',
        name: 'Jason Bahil',
      },
      programmingLanguage: tags,
      dateCreated: project.createdAt,
      dateModified: project.updatedAt,
    }
  })

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {projectsSchema.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}
      
      <Hero />
      
      <Section id="about" title="About Me" subtitle="Get to know me">
        <About />
      </Section>
      
      <Section id="experience" title="Experience" subtitle="My professional journey">
        <Experience experiences={experiences} />
      </Section>
      
      <Section id="trainings" title="Trainings & Certifications" subtitle="My learning journey">
        <Trainings trainings={trainings} />
      </Section>
      
      <Section id="projects" title="Projects" subtitle="Some of my recent work">
        <Projects projects={projects} />
      </Section>
      
      <Section id="tech" title="Tech Stack" subtitle="Technologies I work with">
        <TechStack techItems={techItems} />
      </Section>
      
      <Section id="contact" title="Contact" subtitle="Let's work together">
        <Contact links={links} />
      </Section>
      
      <Footer />
    </>
  )
}
