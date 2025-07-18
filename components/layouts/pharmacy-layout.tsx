"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Building2, Package, Upload, BarChart3, MapPin, Bell, Settings, Menu, User, LogOut } from "lucide-react"
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
  { name: "Dashboard", href: "/pharmacy/dashboard", icon: Building2 },
  { name: "Inventory Manager", href: "/pharmacy/inventory", icon: Package },
  { name: "Upload CSV", href: "/pharmacy/upload", icon: Upload },
  { name: "Price Check Score", href: "/pharmacy/price-check", icon: BarChart3 },
  { name: "District Demand Map", href: "/pharmacy/demand-map", icon: MapPin },
  { name: "Alerts & Messages", href: "/pharmacy/alerts", icon: Bell },
  { name: "Profile & Settings", href: "/pharmacy/settings", icon: Settings },
]

interface PharmacyLayoutProps {
  children: React.ReactNode
}

export function PharmacyLayout({ children }: PharmacyLayoutProps) {
  const pathname = usePathname()
  // Remove sidebar state

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
          <div className="flex flex-col">
            <div className="flex justify-between h-16 items-center">
              <Link href="/pharmacy/dashboard" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold gradient-text">CuroGenix</span>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 glass-button border-0 bg-white/5 hover:bg-white/10 text-white">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="hidden sm:block text-white">Apollo Pharmacy</span>
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
            {/* Tab Navigation removed */}
          </div>
        </div>
      </header>

      {/* Main Content - full width, no sidebar or tabs */}
      <main className="flex-1 pt-8 relative z-10">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
