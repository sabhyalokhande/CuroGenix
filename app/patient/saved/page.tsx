"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft, Trash2, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export default function PatientSaved() {
  const [searchQuery, setSearchQuery] = useState("")

  const savedItems = [
    {
      id: 1,
      type: "medicine",
      name: "Insulin Glargine",
      description: "Long-acting insulin",
      pharmacy: "Apollo Pharmacy",
      price: "₹850",
      status: "In Stock",
      imageUrl: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      type: "pharmacy",
      name: "MedPlus Central",
      address: "456 Park Avenue",
      distance: "1.2 km",
      status: "Open",
      imageUrl: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      type: "medicine",
      name: "Thyroxine 50mcg",
      description: "Thyroid hormone replacement",
      pharmacy: "Wellness Pharmacy",
      price: "₹120",
      status: "Low Stock",
      imageUrl: "/placeholder.svg?height=80&width=80",
    },
  ]

  const filteredItems = savedItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-50 max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center p-4">
          <Link href="/patient/dashboard">
            <Button variant="ghost" size="sm" className="mr-2 p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold text-gray-900">My Saved Items</h1>
            <p className="text-sm text-gray-600">Medicines and pharmacies you've saved</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search saved items..."
            className="pl-10 border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <h2 className="font-semibold text-gray-900 mb-4">Saved Items ({filteredItems.length})</h2>
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center space-x-4">
                <img
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  {item.type === "medicine" ? (
                    <>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm text-gray-600">
                        {item.pharmacy} - <span className="font-semibold">{item.price}</span>
                      </p>
                      <p className="text-sm text-green-600">{item.status}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600">{item.address}</p>
                      <p className="text-sm text-gray-600">
                        {item.distance} - <span className="font-semibold">{item.status}</span>
                      </p>
                    </>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="p-2">
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </CardContent>
              <div className="flex justify-end p-4 pt-0 space-x-2">
                {item.type === "pharmacy" && (
                  <>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button size="sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      Directions
                    </Button>
                  </>
                )}
                {item.type === "medicine" && (
                  <Button size="sm">
                    <Search className="h-4 w-4 mr-1" />
                    Find Now
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20"></div>
    </div>
  )
}
