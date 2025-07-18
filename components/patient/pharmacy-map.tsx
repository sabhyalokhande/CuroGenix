"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Phone, Clock, Star } from "lucide-react"

interface Pharmacy {
  id: string
  name: string
  address: string
  distance: string
  availability: number
  maxAvailability: number
  rating: number
  phone: string
  hours: string
  lat: number
  lng: number
}

export function PharmacyMap() {
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null)

  const mockPharmacies: Pharmacy[] = [
    {
      id: "1",
      name: "HealthPlus Pharmacy",
      address: "123 Main St, Downtown",
      distance: "0.5 km",
      availability: 4,
      maxAvailability: 4,
      rating: 4.8,
      phone: "+91 98765 43210",
      hours: "8:00 AM - 10:00 PM",
      lat: 28.6139,
      lng: 77.209,
    },
    {
      id: "2",
      name: "MediCare Center",
      address: "456 Park Ave, Central",
      distance: "1.2 km",
      availability: 2,
      maxAvailability: 4,
      rating: 4.5,
      phone: "+91 98765 43211",
      hours: "9:00 AM - 9:00 PM",
      lat: 28.6129,
      lng: 77.2095,
    },
    {
      id: "3",
      name: "Quick Meds",
      address: "789 Oak St, Suburb",
      distance: "2.1 km",
      availability: 3,
      maxAvailability: 4,
      rating: 4.2,
      phone: "+91 98765 43212",
      hours: "24/7",
      lat: 28.6149,
      lng: 77.2085,
    },
  ]

  const getAvailabilityColor = (availability: number, max: number) => {
    const ratio = availability / max
    if (ratio >= 0.75) return "bg-green-500"
    if (ratio >= 0.5) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <div className="map-container bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Interactive Map Integration</p>
          <p className="text-sm text-gray-500">Google Maps would be integrated here</p>
        </div>
      </div>

      {/* Pharmacy Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Nearby Pharmacies</h3>
        <div className="grid gap-4">
          {mockPharmacies.map((pharmacy, index) => (
            <motion.div
              key={pharmacy.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-200 ${
                  selectedPharmacy === pharmacy.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedPharmacy(pharmacy.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{pharmacy.name}</CardTitle>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {pharmacy.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="flex items-center space-x-1 mb-1">
                        <div
                          className={`w-2 h-2 rounded-full ${getAvailabilityColor(
                            pharmacy.availability,
                            pharmacy.maxAvailability,
                          )}`}
                        />
                        <span>
                          {pharmacy.availability}/{pharmacy.maxAvailability}
                        </span>
                      </Badge>
                      <p className="text-sm text-gray-600">{pharmacy.distance}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{pharmacy.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{pharmacy.hours}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Navigation className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
