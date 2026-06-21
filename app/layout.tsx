import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'HireBoost - AI-Powered Resume Optimizer',
  description: 'Optimize your resume with AI and land more interviews. Get instant analysis, missing keywords, and improvement suggestions.',
  
  icons: {
    icon: [
      {
        url: '/iconfav.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/iconfav.svg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/iconfav.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* 💡 Tip: You imported Geist fonts above, but if you're using DM Sans via Google Fonts, "font-sans" works perfectly assuming it's configured in your tailwind.config.js */}
      <body className="font-sans antialiased min-h-screen bg-[#080808] text-white overflow-x-hidden">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}