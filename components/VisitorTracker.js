'use client'

import { useEffect } from 'react'

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Get visitor information
        const ipResponse = await fetch('https://api.ipify.org?format=json')
        const ipData = await ipResponse.json()
        
        const visitorData = {
          ipAddress: ipData.ip || 'unknown',
          userAgent: navigator.userAgent,
          referer: document.referrer || null,
        }

        // Send to our API
        await fetch('/api/visitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitorData),
        })
      } catch (error) {
        // Silently fail - visitor tracking shouldn't break the site
        console.log('Visitor tracking failed:', error)
      }
    }

    // Only track on the main page, not admin pages
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin')) {
      trackVisitor()
    }
  }, [])

  // This component doesn't render anything
  return null
}
