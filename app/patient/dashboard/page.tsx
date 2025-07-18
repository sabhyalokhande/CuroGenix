"use client"

import { SheetDescription } from "@/components/ui/sheet"

import { SheetTitle } from "@/components/ui/sheet"

import { SheetHeader } from "@/components/ui/sheet"

import { useState } from "react"
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
  Filter,
  Star,
  Navigation,
  FileText,
  ReceiptText,
  Award,
} from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("home")
  const [showUploadOptions, setShowUploadOptions] = useState(false)

  const quickActions = [
    { icon: Search, label: "Find Medicine", href: "/patient/search-mobile", color: "bg-blue-500" },
    { icon: AlertTriangle, label: "Report Issue", href: "/patient/report", color: "bg-orange-500" },
    { icon: Award, label: "My Rewards", href: "/patient/rewards", color: "bg-yellow-500" },
  ]

  const nearbyPharmacies = [
    { name: "Apollo Pharmacy", distance: "0.5 km", status: "Open", rating: 4.5, availability: "high" },
    { name: "MedPlus", distance: "1.2 km", status: "Open", rating: 4.2, availability: "medium" },
    { name: "Wellness", distance: "2.1 km", status: "Closed", rating: 4.8, availability: "low" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 max-w-sm mx-auto relative flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">Good Morning!</h1>
            <p className="text-green-100 text-sm">Find medicines near you</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search medicines..."
            className="pl-10 bg-white/90 border-0 text-gray-900 placeholder-gray-500"
          />
          <Button
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700"
          >
            <Filter className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Reward Points */}
        <div className="p-4">
          <Card className="border-0 shadow-sm bg-green-100">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Award className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm text-green-800">Your Reward Points</p>
                  <h2 className="text-xl font-bold text-green-900">1,247</h2>
                </div>
              </div>
              <Link href="/patient/rewards">
                <Button variant="outline" size="sm" className="bg-white text-green-600">
                  Redeem
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mb-4">
          <h2 className="font-semibold mb-3 text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                    >
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{action.label}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Nearby Pharmacies */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Nearby Pharmacies</h2>
            <Link href="/patient/search-mobile" className="text-sm text-blue-600">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {nearbyPharmacies.map((pharmacy, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{pharmacy.name}</h3>
                        <Badge variant={pharmacy.status === "Open" ? "default" : "secondary"} className="text-xs">
                          {pharmacy.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Navigation className="h-3 w-3 mr-1" />
                          {pharmacy.distance}
                        </span>
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {pharmacy.rating}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        pharmacy.availability === "high"
                          ? "bg-green-500"
                          : pharmacy.availability === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 z-20">
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
                activeTab === tab.id ? "text-green-600" : "text-gray-400"
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
            className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-30"
          >
            <Plus className="h-8 w-8" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-w-sm mx-auto rounded-t-xl">
          <SheetHeader className="text-center">
            <SheetTitle>Upload Options</SheetTitle>
            <SheetDescription>Choose what you want to upload</SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-4 py-6">
            <Link href="/patient/upload-flow/prescription">
              <Button
                variant="outline"
                className="h-24 flex flex-col space-y-2 w-full bg-transparent"
                onClick={() => setShowUploadOptions(false)}
              >
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="text-sm">Prescription</span>
              </Button>
            </Link>
            <Link href="/patient/upload-flow/receipt">
              <Button
                variant="outline"
                className="h-24 flex flex-col space-y-2 w-full bg-transparent"
                onClick={() => setShowUploadOptions(false)}
              >
                <ReceiptText className="h-8 w-8 text-purple-600" />
                <span className="text-sm">Receipt</span>
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
