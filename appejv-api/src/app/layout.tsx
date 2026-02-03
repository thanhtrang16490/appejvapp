import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'APPE JV Admin Panel',
  description: 'Admin panel for APPE JV animal feed management system',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        {children}
      </body>
    </html>
  )
}