import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TemanHire',
  description: 'Solusi AI dari 4Kings FinalProject Rakamin Academy',
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <body className={inter.className}>
      <Navbar />
      {children}
      <Footer />
    </body>
  )
}
