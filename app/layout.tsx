import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './mobile.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AK Suite Mobile - Password & Budget Manager',
  description: 'Versione mobile ottimizzata per gestione password e bilancio familiare',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
