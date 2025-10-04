import { Inter } from 'next/font/google'
import './globals.css'
import ConditionalNavBar from '@/components/ConditionalNavBar'
import ParallaxBackground from '@/components/ParallaxBackground'
import ToastContainer from '@/components/ToastContainer'
import { ToastProvider } from '@/contexts/ToastContext'
import JsonLd from '@/components/JsonLd'
import VisitorTracker from '@/components/VisitorTracker'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Jason Bahil - Web Developer / ICT Unit Head',
  description: 'Results-driven Web Application Developer with extensive experience in designing, developing, and deploying enterprise-level systems for government agencies.',
  keywords: 'web developer, full-stack developer, ICT, government systems, React, Next.js, database management',
  authors: [{ name: 'Jason Bahil' }],
  creator: 'Jason Bahil',
  publisher: 'Jason Bahil',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://jasonbahil.dev',
    siteName: 'Jason Bahil Portfolio',
    title: 'Jason Bahil - Web Developer / ICT Unit Head',
    description: 'Results-driven Web Application Developer with extensive experience in designing, developing, and deploying enterprise-level systems for government agencies.',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Jason Bahil - Web Developer / ICT Unit Head',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jason Bahil - Web Developer / ICT Unit Head',
    description: 'Results-driven Web Application Developer with extensive experience in designing, developing, and deploying enterprise-level systems for government agencies.',
    images: ['/api/og'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jason Bahil',
  jobTitle: 'Web Developer / ICT Unit Head',
  email: 'jbahil47@gmail.com',
  telephone: '+639120799370',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'B2 L8, Pantabangan St., NIA Village, Sauyo',
    addressLocality: 'Quezon City',
    addressCountry: 'Philippines',
  },
  sameAs: [
    'https://github.com/yourhandle',
    'https://linkedin.com/in/yourhandle',
  ],
  knowsAbout: [
    'Web Development',
    'Full-Stack Development',
    'Database Management',
    'ICT Project Management',
    'Government Systems',
    'React',
    'Next.js',
    'Node.js',
    'MySQL',
    'PostgreSQL',
  ],
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'STI Fairview',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'UniFAST Secretariat',
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Jason Bahil Portfolio',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://jasonbahil.dev',
  description: 'Portfolio website of Jason Bahil, Web Developer and ICT Unit Head',
  author: {
    '@type': 'Person',
    name: 'Jason Bahil',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jasonbahil.dev'}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <JsonLd data={personSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <VisitorTracker />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
          >
            Skip to main content
          </a>
          <ParallaxBackground />
          <ConditionalNavBar />
          <main id="main-content">{children}</main>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  )
}
