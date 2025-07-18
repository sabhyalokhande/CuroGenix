"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Heart, MapPin, Star, Phone, Navigation, Trash2 } from "lucide-react"
import Link from "next/link"

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState("medicines")
  const [searchQuery, setSearchQuery] = useState("")

  const savedMedicines = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      category: "Pain Relief",
      lastPrice: "₹45",
      avgPrice: "₹48",
      availability: "high",
      savedDate: "2 days ago",
    },
    {
      id: 2,
      name: "Amoxicillin 250mg",
      category: "Antibiotic",
      lastPrice: "₹120",
      avgPrice: "₹115",
      availability: "medium",
      savedDate: "1 week ago",
    },
    {
      id: 3,
      name: "Omeprazole 20mg",
      category: "Acid Reducer",
      lastPrice: "₹85",
      avgPrice: "₹90",
      availability: "low",
      savedDate: "3 days ago",
    },
  ]

  const savedPharmacies = [
    {
      id: 1,
      name: "Apollo Pharmacy",
      address: "123 Main Street, Downtown",
      distance: "0.5 km",
      rating: 4.5,
      status: "Open",
      phone: "+91 98765 43210",
      savedDate: "1 week ago",
    },
    {
      id: 2,
      name: "MedPlus",
      address: "456 Park Avenue, Central",
      distance: "1.2 km",
      rating: 4.2,
      status: "Open",
      phone: "+91 98765 43211",
      savedDate: "3 days ago",
    },
    {
      id: 3,
      name: "Wellness Pharmacy",
      address: "789 Health Street, Suburb",
      distance: "2.1 km",
      rating: 4.8,
      status: "Closed",
      phone: "+91 98765 43212",
      savedDate: "5 days ago",
    },
  ]

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "high":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredMedicines = savedMedicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredPharmacies = savedPharmacies.filter((pharmacy) =>
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen liquid-glass-bg text-white w-full max-w-md mx-auto px-4">
      {/* SVG Filter for Liquid Distortion */}
      <svg style={{ display: "none" }}>
        <filter id="liquidGlass">
          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="turb" />
          <feDisplacementMap in2="turb" in="SourceGraphic" scale="15" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Header */}
      <div className="glass-nav border-b border-white/10 sticky top-0 z-10">
        <div className="flex items-center p-4">
          <Link href="/patient/dashboard">
            <Button variant="ghost" size="sm" className="mr-2 p-2 glass-button border-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold text-white">Saved Items</h1>
            <p className="text-sm text-gray-400">Your bookmarked medicines and pharmacies</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search saved items..."
              className="pl-10 glass-input border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Tab Navigation */}
        <div className="flex glass-card rounded-lg p-1 mb-6">
          {[
            { id: "medicines", label: "Medicines", count: savedMedicines.length },
            { id: "pharmacies", label: "Pharmacies", count: savedPharmacies.length },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`flex-1 ${activeTab === tab.id ? "glass-button border-0" : "text-gray-400 hover:text-white"}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} ({tab.count})
            </Button>
          ))}
        </div>

        {/* Medicines Tab */}
        {activeTab === "medicines" && (
          <div className="space-y-4">
            {filteredMedicines.length === 0 ? (
              <Card className="glass-card border-0">
                <CardContent className="p-8 text-center">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Saved Medicines</h3>
                  <p className="text-gray-400 mb-4">Start saving medicines to track prices and availability</p>
                  <Link href="/patient/search-mobile">
                    <Button className="glass-button border-0">Browse Medicines</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              filteredMedicines.map((medicine) => (
                <Card key={medicine.id} className="glass-card border-0">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-white">{medicine.name}</h3>
                          <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(medicine.availability)}`} />
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{medicine.category}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-green-400 font-semibold">{medicine.lastPrice}</span>
                          <span className="text-gray-400">Avg: {medicine.avgPrice}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Saved {medicine.savedDate}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="p-2 text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Link href="/patient/search-mobile" className="flex-1">
                        <Button size="sm" className="w-full glass-button border-0">
                          <Search className="h-3 w-3 mr-1" />
                          Find Now
                        </Button>
                      </Link>
                      <Button size="sm" className="glass-button border-0">
                        <Heart className="h-3 w-3 fill-red-400 text-red-400" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Pharmacies Tab */}
        {activeTab === "pharmacies" && (
          <div className="space-y-4">
            {filteredPharmacies.length === 0 ? (
              <Card className="glass-card border-0">
                <CardContent className="p-8 text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Saved Pharmacies</h3>
                  <p className="text-gray-400 mb-4">Save your favorite pharmacies for quick access</p>
                  <Link href="/patient/search-mobile">
                    <Button className="glass-button border-0">Find Pharmacies</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              filteredPharmacies.map((pharmacy) => (
                <Card key={pharmacy.id} className="glass-card border-0">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-white">{pharmacy.name}</h3>
                          <Badge
                            variant={pharmacy.status === "Open" ? "default" : "secondary"}
                            className="text-xs glass-button border-0"
                          >
                            {pharmacy.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{pharmacy.address}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-1">
                          <span className="flex items-center">
                            <Navigation className="h-3 w-3 mr-1" />
                            {pharmacy.distance}
                          </span>
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                            {pharmacy.rating}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Saved {pharmacy.savedDate}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="p-2 text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1 glass-button border-0">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Link
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(pharmacy.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button size="sm" className="w-full glass-button border-0">
                          <Navigation className="h-3 w-3 mr-1" />
                          Directions
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20"></div>
    </div>
  )
}
