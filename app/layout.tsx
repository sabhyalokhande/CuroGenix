import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MediPulse - Medical Supply Tracking",
  description: "Track medicine availability, report issues, and manage pharmacy inventory",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className + ' ai-bg-dark min-h-screen relative'}>
        {/* AI Theme Background Glows */}
        <div className="ai-bg-glow ai-bg-blue"></div>
        <div className="ai-bg-glow ai-bg-purple"></div>
        <div className="relative z-10">
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  )
}
