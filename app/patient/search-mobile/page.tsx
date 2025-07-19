"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Filter, ArrowLeft, Star, Navigation, Phone, Clock } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useSearchParams } from "next/navigation"

export default function MobileSearch() {
  const [showMap, setShowMap] = useState(false)
  const searchParams = useSearchParams()
  const medicinesFromPrescription = searchParams.get("medicines")?.split(",") || []

  const [pharmacies, setPharmacies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    setError("")
    fetch('/api/pharmacies')
      .then((r) => r.json())
      .then((data) => {
        let filtered = Array.isArray(data) ? data : []
        if (medicinesFromPrescription.length > 0) {
          // For pharmacies, we'll show all pharmacies since they might have the medicines
          // In a real app, you'd query medicines by pharmacy and filter accordingly
          filtered = filtered
        }
        setPharmacies(filtered)
      })
      .catch((err) => {
        console.error("Error fetching pharmacies:", err)
        setError("Failed to load pharmacies")
      })
      .finally(() => setLoading(false))
  }, [medicinesFromPrescription])



  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "low":
        return "bg-yellow-500"
      case "unavailable":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "In Stock"
      case "low":
        return "Low Stock"
      case "unavailable":
        return "Out of Stock"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="min-h-screen liquid-glass-bg text-white max-w-sm mx-auto">
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
            <h1 className="font-semibold text-white">Find Pharmacies</h1>
            {medicinesFromPrescription.length > 0 ? (
              <p className="text-sm text-gray-400">Pharmacies near you</p>
            ) : (
              <p className="text-sm text-gray-400">Search all pharmacies</p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowMap(!showMap)} className="p-2 glass-button border-0">
            <MapPin className="h-5 w-5" />
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="px-4 pb-4">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search pharmacies..."
                className="pl-10 glass-input border-0"
                defaultValue={medicinesFromPrescription.join(", ")}
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" className="px-3 glass-button border-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-w-sm mx-auto dark-glass-card border-white/10">
                <SheetHeader>
                  <SheetTitle className="text-white">Filter Results</SheetTitle>
                  <SheetDescription className="text-gray-400">Refine your search results</SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white">Distance</label>
                    <div className="flex space-x-2 mt-2">
                      {["1 km", "2 km", "5 km", "10 km"].map((dist) => (
                        <Button key={dist} size="sm" className="flex-1 glass-button border-0">
                          {dist}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white">Availability</label>
                    <div className="flex space-x-2 mt-2">
                      {["All", "In Stock", "Low Stock"].map((status) => (
                        <Button key={status} size="sm" className="flex-1 glass-button border-0">
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Map/List Toggle */}
      {showMap ? (
        <div className="h-64 glass-card m-4 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-300">Interactive map</p>
            <p className="text-sm text-gray-400">Green: Open | Red: Closed</p>
            {medicinesFromPrescription.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Showing pharmacies near you
              </p>
            )}
            <div className="mt-4 text-xs text-gray-400">
              <p>Found {pharmacies.length} pharmacies</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Results */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-white">Nearby Pharmacies ({pharmacies.length})</h2>
          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 transition-colors">
            Sort by distance
          </Button>
        </div>
        {loading && <div className="text-gray-400">Loading...</div>}
        {error && <div className="text-red-400">{error}</div>}
        {!loading && !error && pharmacies.length === 0 && (
          <div className="text-gray-400">No pharmacies found.</div>
        )}
        <div className="space-y-3">
          {pharmacies.map((pharmacy, index) => (
            <Card key={pharmacy._id || index} className="glass-card border-0">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{pharmacy.name || 'Unknown Pharmacy'}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Navigation className="h-3 w-3 mr-1" />
                        {pharmacy.distance || 'N/A'} km
                      </span>
                      <span className="flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {pharmacy.rating || 'N/A'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {pharmacy.address || 'Address not available'}
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${pharmacy.isOpen ? "bg-green-500" : "bg-red-500"}`}></div>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" className="flex-1 glass-button border-0">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" className="flex-1 glass-button border-0">
                    <Navigation className="h-3 w-3 mr-1" />
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20"></div>
    </div>
  )
}
