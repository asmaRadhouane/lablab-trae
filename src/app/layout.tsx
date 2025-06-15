import type { Metadata, Viewport } from 'next';
import { GeistSans, GeistMono } from 'geist/font';
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import LayoutProvider from '@/components/providers/LayoutProvider';

const geistSans = GeistSans;
const geistMono = GeistMono;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  title: 'Business Idea Finder',
  description: 'Discover and analyze business opportunities from Reddit discussions',
  keywords: 'business ideas, reddit, automation, startup, entrepreneurship',
  authors: [{ name: 'Business Idea Finder Team' }],
  manifest: '/manifest.json',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: 'Business Idea Finder',
    description: 'Discover and analyze business opportunities from Reddit discussions',
    siteName: 'Business Idea Finder'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <LayoutProvider>
            {children}
          </LayoutProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
