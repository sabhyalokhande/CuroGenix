"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CuroGenixLogo } from "@/components/ui/curogenix-logo"
import {
  User,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface GovernmentLayoutProps {
  children: React.ReactNode
  user?: any
}

export function GovernmentLayout({ children, user }: GovernmentLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = () => {
    localStorage.removeItem('token')
    router.push('/government/login')
  }

  return (
    <div className="min-h-screen liquid-glass-bg text-white">
      {/* SVG Filter for Liquid Distortion */}
      <svg style={{ display: "none" }}>
        <filter id="liquidGlass">
          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="turb" />
          <feDisplacementMap in2="turb" in="SourceGraphic" scale="15" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Top Navigation */}
      <header className="glass-nav shadow-sm border-b border-white/10 relative z-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/government/dashboard" className="flex items-center">
                <CuroGenixLogo size="md" />
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 glass-button border-0 bg-white/5 hover:bg-white/10 text-white">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-purple-400" />
                    </div>
                    <span className="hidden sm:block text-white">
                      {user?.governmentInfo?.department || "Health Ministry"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border-0">
                  <DropdownMenuItem className="text-white hover:bg-white/10">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="text-white hover:bg-white/10" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-8 relative z-10">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
