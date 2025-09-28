export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jasonbahil.dev'
  
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
