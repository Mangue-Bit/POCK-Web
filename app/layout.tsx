import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Header } from '@/components/header'
import { NotificationToast } from '@/components/notification-toast'
import { NotificationProvider } from '@/lib/notification-context'
import { UserProvider } from '@/lib/user-context'
import { QteProvider } from '@/lib/qte-context'
import { BettingQte } from '@/components/betting-qte'
import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bundesliga Insights - Apostas Inteligentes em Tempo Real',
  description:
    'Receba insights em tempo real para apostas na Bundesliga. Análises baseadas em machine learning e estatísticas avançadas.',
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <UserProvider>
          <NotificationProvider>
            <QteProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
              </div>
              <NotificationToast />
              <BettingQte />
            </QteProvider>
          </NotificationProvider>
        </UserProvider>
        <Analytics />
      </body>
    </html>
  )
}
