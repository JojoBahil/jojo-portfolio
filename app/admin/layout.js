export const metadata = {
  title: 'Admin Dashboard - Jason Bahil Portfolio',
}

import Script from 'next/script'

export default function AdminLayout({ children }) {
  return (
    <>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="beforeInteractive"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
    </>
  )
}
