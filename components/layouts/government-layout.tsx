"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Shield,
  BarChart3,
  AlertTriangle,
  Building2,
  MapPin,
  FileText,
  Settings,
  Menu,
  User,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navigation = [
  { name: "Overview", href: "/government/dashboard", icon: BarChart3 },
  { name: "Anomaly Reports", href: "/government/anomalies", icon: AlertTriangle },
  { name: "Pharmacy Data", href: "/government/pharmacies", icon: Building2 },
  { name: "District Map", href: "/government/map", icon: MapPin },
  { name: "Reports & Exports", href: "/government/reports", icon: FileText },
  { name: "Settings", href: "/government/settings", icon: Settings },
]

interface GovernmentLayoutProps {
  children: React.ReactNode
}

export function GovernmentLayout({ children }: GovernmentLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const NavItems = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors glass-button border-0",
              pathname === item.href
                ? "bg-purple-500/20 text-purple-400"
                : "text-gray-300 hover:text-white hover:bg-white/10",
            )}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        )
      })}
    </>
  )

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
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden glass-button border-0">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 glass-card border-0">
                  <div className="flex items-center space-x-2 mb-6">
                    <Shield className="h-8 w-8 text-purple-400" />
                    <span className="text-xl font-bold gradient-text">CuroGenix</span>
                  </div>
                  <nav className="space-y-1">
                    <NavItems />
                  </nav>
                </SheetContent>
              </Sheet>

              <Link href="/government/dashboard" className="flex items-center space-x-2 ml-4 md:ml-0">
                <Shield className="h-8 w-8 text-purple-400" />
                <span className="text-xl font-bold hidden sm:block gradient-text">CuroGenix</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 glass-button border-0">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-purple-400" />
                    </div>
                    <span className="hidden sm:block text-white">Health Ministry</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border-0">
                  <DropdownMenuItem className="text-white hover:bg-white/10">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="text-white hover:bg-white/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <nav className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16 z-10">
          <div className="flex-1 flex flex-col min-h-0 glass-nav border-r border-white/10">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto custom-scrollbar">
              <div className="flex-1 px-3 space-y-1">
                <NavItems />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 md:pl-64 pt-16 relative z-10">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
