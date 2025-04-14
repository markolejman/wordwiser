import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Word Wiser | AI Dictionary',
  description: 'Word Wiser | AI Dictionary ',
  generator: 'v0.dev',
  icons: {
    icon: '/wisewords.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
