"use client"

import { useState } from "react"
import { PatientLayout } from "@/components/layouts/patient-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { MapPin, Search, Filter, Star, Phone, Navigation, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function PatientSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [distanceRange, setDistanceRange] = useState([5])
  const [selectedPharmacy, setSelectedPharmacy] = useState(null)

  const pharmacies = [
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
      verified: true,
      coordinates: { lat: 12.9716, lng: 77.5946 },
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
      verified: true,
      coordinates: { lat: 12.9716, lng: 77.5946 },
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
      verified: false,
      coordinates: { lat: 12.9716, lng: 77.5946 },
    },
  ]

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
    <PatientLayout>
      <div className="space-y-6">
        {/* Search Header */}
        <div className="bg-white rounded-lg border p-6">
          <h1 className="text-2xl font-bold mb-4">Search Medicines</h1>

          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select or type medicine name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paracetamol">Paracetamol</SelectItem>
                  <SelectItem value="insulin">Insulin</SelectItem>
                  <SelectItem value="amoxicillin">Amoxicillin</SelectItem>
                  <SelectItem value="aspirin">Aspirin</SelectItem>
                  <SelectItem value="metformin">Metformin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm">Distance:</span>
              <div className="w-32">
                <Slider value={distanceRange} onValueChange={setDistanceRange} max={10} min={1} step={0.5} />
              </div>
              <span className="text-sm text-muted-foreground">{distanceRange[0]} km</span>
            </div>

            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low to High</SelectItem>
                <SelectItem value="high">High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Results List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Results ({pharmacies.length})</h2>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {pharmacies.map((pharmacy) => (
              <Card key={pharmacy.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold flex items-center">
                        {pharmacy.name}
                        {pharmacy.verified && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Verified
                          </Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">{pharmacy.address}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(pharmacy.status)}`} />
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Navigation className="h-3 w-3 mr-1" />
                        {pharmacy.distance}
                      </span>
                      <span className="flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {pharmacy.rating}
                      </span>
                    </div>
                    <Badge
                      variant={
                        pharmacy.status === "available"
                          ? "default"
                          : pharmacy.status === "low"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {getStatusText(pharmacy.status)}
                    </Badge>
                  </div>

                  {pharmacy.status !== "unavailable" && (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-green-600">{pharmacy.price}</span>
                        <span className="text-sm text-muted-foreground ml-2">Avg: {pharmacy.avgPrice}</span>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">View Details</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{pharmacy.name}</DialogTitle>
                            <DialogDescription>{pharmacy.address}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span>Status:</span>
                              <Badge variant={pharmacy.status === "available" ? "default" : "secondary"}>
                                {getStatusText(pharmacy.status)}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Price:</span>
                              <span className="font-semibold">{pharmacy.price}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>District Average:</span>
                              <span>{pharmacy.avgPrice}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Hours:</span>
                              <span>{pharmacy.hours}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Contact:</span>
                              <span>{pharmacy.phone}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button className="flex-1">
                                <Phone className="mr-2 h-4 w-4" />
                                Call
                              </Button>
                              <Button variant="outline" className="flex-1 bg-transparent">
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Report Issue
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map View */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Map View
                </CardTitle>
                <CardDescription>Pharmacies near you with real-time availability</CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Interactive map will be displayed here</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Green markers: Available | Yellow: Low Stock | Red: Unavailable
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PatientLayout>
  )
}
