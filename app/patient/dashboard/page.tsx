"use client"

import { useEffect, useState } from "react"
import { SheetDescription } from "@/components/ui/sheet"
import { SheetTitle } from "@/components/ui/sheet"
import { SheetHeader } from "@/components/ui/sheet"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  AlertTriangle,
  User,
  Home,
  Heart,
  Plus,
  Star,
  Navigation,
  FileText,
  ReceiptText,
  Award,
  Camera,
} from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("home")
  const [showUploadOptions, setShowUploadOptions] = useState(false)
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [receipts, setReceipts] = useState<any[]>([])
  const [rewards, setRewards] = useState<any[]>([])
  const [pharmacies, setPharmacies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const fetchData = async () => {
      setLoading(true)
      setError("")
      try {
        const [pres, rec, rew, pharms] = await Promise.all([
          fetch("/api/prescriptions", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          fetch("/api/receipts", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          fetch("/api/rewards", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          fetch("/api/pharmacies").then(r => r.json()), // Fetch pharmacies from MongoDB
        ])
        setPrescriptions(Array.isArray(pres) ? pres : [])
        setReceipts(Array.isArray(rec) ? rec : [])
        setRewards(Array.isArray(rew) ? rew : [])
        setPharmacies(Array.isArray(pharms) ? pharms : [])
      } catch (err: any) {
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const quickActions = [
    { icon: Search, label: "Find Medicine", href: "/patient/search-mobile", color: "bg-blue-500/20 text-blue-400" },
    { icon: AlertTriangle, label: "Report Issue", href: "/patient/report", color: "bg-orange-500/20 text-orange-400" },
    { icon: Award, label: "My Rewards", href: "/patient/rewards", color: "bg-yellow-500/20 text-yellow-400" },
  ]

  return (
    <div className="min-h-screen liquid-glass-bg text-white max-w-sm mx-auto relative flex flex-col">
      {/* SVG Filter for Liquid Distortion */}
      <svg style={{ display: "none" }}>
        <filter id="liquidGlass">
          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="turb" />
          <feDisplacementMap in2="turb" in="SourceGraphic" scale="15" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Header */}
      <div className="glass-card p-4 pt-6 m-4 mb-0 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Good Morning!</h1>
            <p className="text-gray-300 text-sm">Find medicines near you</p>
          </div>
          <div className="w-10 h-10 glass-card rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-green-400" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search medicines..."
            className="pl-10 glass-input border-0 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
        {/* Reward Points */}
        <div className="p-4">
          <Card className="glass-card border-0">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Award className="h-6 w-6 text-green-400" />
                <div>
                  <p className="text-sm text-gray-300">Your Reward Points</p>
                  <h2 className="text-xl font-bold text-white">{rewards.reduce((acc, r) => acc + (r.points || 0), 0)}</h2>
                </div>
              </div>
              <Link href="/patient/rewards">
                <Button className="glass-button border-0 text-green-400">Redeem</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mb-4">
          <h2 className="font-semibold mb-3 text-white">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="glass-card border-0 hover:bg-white/10 transition-all">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                    >
                      <action.icon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-white">{action.label}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Nearby Pharmacies (showing medicines as a placeholder) */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white">Nearby Pharmacies</h2>
            <Link href="/patient/search-mobile" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {pharmacies.length === 0 && <div className="text-gray-400">No nearby pharmacies found.</div>}
            {pharmacies.map((pharmacy, index) => (
              <Card key={pharmacy._id || index} className="glass-card border-0">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-white">{pharmacy.name}</h3>
                        <Badge
                          variant={"default"}
                          className="text-xs glass-button border-0"
                        >
                          {pharmacy.isOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Navigation className="h-3 w-3 mr-1" />
                          {pharmacy.distance} km
                        </span>
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {pharmacy.rating}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        pharmacy.isOpen ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {loading && <div className="text-center text-gray-400">Loading...</div>}
        {error && <div className="text-center text-red-400">{error}</div>}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm glass-nav border-t border-white/10 z-20">
        <div className="grid grid-cols-4 py-2">
          {[
            { icon: Home, label: "Home", id: "home", href: "/patient/dashboard" },
            { icon: Search, label: "Search", id: "search", href: "/patient/search-mobile" },
            { icon: Heart, label: "Saved", id: "saved", href: "/patient/saved" },
            { icon: User, label: "Profile", id: "profile", href: "/patient/profile" },
          ].map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex flex-col items-center py-2 px-1 ${
                activeTab === tab.id ? "text-green-400" : "text-gray-400"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Central Floating Action Button */}
      <Sheet open={showUploadOptions} onOpenChange={setShowUploadOptions}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-2xl z-30 border-0"
          >
            <Plus className="h-8 w-8 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-w-sm mx-auto rounded-t-xl dark-glass-card border-white/10">
          <SheetHeader className="text-center">
            <SheetTitle className="text-white">Upload Options</SheetTitle>
            <SheetDescription className="text-gray-400">Choose what you want to upload</SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-4 py-6">
            <Link href="/patient/upload-flow/prescription">
              <Button
                className="h-24 flex flex-col space-y-2 w-full glass-button border-0"
                onClick={() => setShowUploadOptions(false)}
              >
                <FileText className="h-8 w-8 text-blue-400" />
                <span className="text-sm text-white">Prescription</span>
              </Button>
            </Link>
            <Link href="/patient/upload-flow/receipt">
              <Button
                className="h-24 flex flex-col space-y-2 w-full glass-button border-0"
                onClick={() => setShowUploadOptions(false)}
              >
                <ReceiptText className="h-8 w-8 text-purple-400" />
                <span className="text-sm text-white">Receipt</span>
              </Button>
            </Link>
            <Link href="/patient/scan">
              <Button
                className="h-24 flex flex-col space-y-2 w-full glass-button border-0"
                onClick={() => setShowUploadOptions(false)}
              >
                <Camera className="h-8 w-8 text-green-400" />
                <span className="text-sm text-white">Medicine Checker</span>
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
