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
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              pathname === item.href
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
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
    <div className="ai-bg-dark min-h-screen relative">
      {/* AI Theme Background Glows */}
      <div className="ai-bg-glow ai-bg-blue"></div>
      <div className="ai-bg-glow ai-bg-purple"></div>
      {/* Top Navigation */}
      <header className="bg-transparent shadow-none border-b-0 relative z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <div className="flex items-center space-x-2 mb-6">
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <span className="text-xl font-bold">MediPulse</span>
                  </div>
                  <nav className="space-y-1">
                    <NavItems />
                  </nav>
                </SheetContent>
              </Sheet>

              <Link href="/pharmacy/dashboard" className="flex items-center space-x-2 ml-4 md:ml-0">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold hidden sm:block">MediPulse</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="hidden sm:block">Apollo Pharmacy</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
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
        <nav className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16">
          <div className="flex-1 flex flex-col min-h-0 bg-white border-r">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex-1 px-3 space-y-1">
                <NavItems />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 md:pl-64 pt-16">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
