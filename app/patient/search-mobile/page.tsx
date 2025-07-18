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

  const allPharmacies = [
    {
      id: 1,
      name: "Apollo Pharmacy",
      address: "123 Main Street, Downtown",
      distance: "0.5 km",
      rating: 4.5,
      status: "available",
      price: "₹45",
      avgPrice: "₹48",
      phone: "+91 98765 43210",
      hours: "8:00 AM - 10:00 PM",
      medicinesStock: {
        "Paracetamol 500mg": "high",
        "Amoxicillin 250mg": "high",
        "Omeprazole 20mg": "high",
        Insulin: "low",
      },
    },
    {
      id: 2,
      name: "MedPlus",
      address: "456 Park Avenue, Central",
      distance: "1.2 km",
      rating: 4.2,
      status: "low",
      price: "₹52",
      avgPrice: "₹48",
      phone: "+91 98765 43211",
      hours: "9:00 AM - 9:00 PM",
      medicinesStock: {
        "Paracetamol 500mg": "high",
        "Amoxicillin 250mg": "low",
        "Omeprazole 20mg": "unavailable",
        Aspirin: "high",
      },
    },
    {
      id: 3,
      name: "Wellness Pharmacy",
      address: "789 Health Street, Suburb",
      distance: "2.1 km",
      rating: 4.8,
      status: "unavailable",
      price: "N/A",
      avgPrice: "₹48",
      phone: "+91 98765 43212",
      hours: "Closed",
      medicinesStock: {
        "Paracetamol 500mg": "unavailable",
        Insulin: "unavailable",
      },
    },
  ]

  const [filteredPharmacies, setFilteredPharmacies] = useState(allPharmacies)

  useEffect(() => {
    if (medicinesFromPrescription.length > 0) {
      const filtered = allPharmacies
        .map((pharmacy) => {
          let availableCount = 0
          const totalCount = medicinesFromPrescription.length
          let hasUnavailable = false

          medicinesFromPrescription.forEach((med) => {
            const stockStatus = pharmacy.medicinesStock[med]
            if (stockStatus === "high" || stockStatus === "low") {
              availableCount++
            } else if (stockStatus === "unavailable") {
              hasUnavailable = true
            }
          })

          return {
            ...pharmacy,
            availableCount,
            totalCount,
            sortScore: availableCount * 1000 - Number.parseFloat(pharmacy.distance),
            displayStatus: `${availableCount}/${totalCount} available`,
            overallStatus:
              availableCount === totalCount
                ? "available"
                : availableCount > 0 && !hasUnavailable
                  ? "low"
                  : "unavailable",
          }
        })
        .sort((a, b) => b.sortScore - a.sortScore)
      setFilteredPharmacies(filtered)
    } else {
      setFilteredPharmacies(allPharmacies)
    }
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
            <h1 className="font-semibold text-white">Find Medicine</h1>
            {medicinesFromPrescription.length > 0 ? (
              <p className="text-sm text-gray-400">Searching for: {medicinesFromPrescription.join(", ")}</p>
            ) : (
              <p className="text-sm text-gray-400">Search all medicines</p>
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
                placeholder="Search medicine..."
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
              <SheetContent side="bottom" className="max-w-md mx-auto dark-glass-card border-white/10">
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
            <p className="text-sm text-gray-400">Green: Available | Yellow: Low | Red: Out</p>
            {medicinesFromPrescription.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Showing availability for: {medicinesFromPrescription.join(", ")}
              </p>
            )}
          </div>
        </div>
      ) : null}

      {/* Results */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-white">Results ({filteredPharmacies.length})</h2>
          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 transition-colors">
            Sort by distance
          </Button>
        </div>

        <div className="space-y-3">
          {filteredPharmacies.map((pharmacy) => (
            <Card key={pharmacy.id} className="glass-card border-0">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-white">{pharmacy.name}</h3>
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(pharmacy.overallStatus || pharmacy.status)}`}
                      />
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{pharmacy.address}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                      <span className="flex items-center">
                        <Navigation className="h-3 w-3 mr-1" />
                        {pharmacy.distance}
                      </span>
                      <span className="flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {pharmacy.rating}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {pharmacy.status !== "unavailable" ? "Open" : "Closed"}
                      </span>
                    </div>

                    {medicinesFromPrescription.length > 0 && (
                      <div className="mb-2">
                        <Badge
                          variant={
                            pharmacy.overallStatus === "available"
                              ? "default"
                              : pharmacy.overallStatus === "low"
                                ? "secondary"
                                : "destructive"
                          }
                          className="glass-button border-0"
                        >
                          {pharmacy.displayStatus}
                        </Badge>
                      </div>
                    )}

                    {pharmacy.status !== "unavailable" && (
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-green-400">{pharmacy.price}</span>
                          <span className="text-sm text-gray-400 ml-2">Avg: {pharmacy.avgPrice}</span>
                        </div>
                        <Badge
                          variant={pharmacy.status === "available" ? "default" : "secondary"}
                          className="glass-button border-0"
                        >
                          {getStatusText(pharmacy.status)}
                        </Badge>
                      </div>
                    )}
                  </div>
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
          ))}
        </div>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20"></div>
    </div>
  )
}
