"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, ArrowLeft, ShoppingCart, Heart, Star } from "lucide-react"
import Link from "next/link"

export default function PatientMarketplace() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({ category: "All", priceRange: "All" })

  const medicines = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      description: "Effective for pain relief and fever reduction.",
      price: "₹48",
      category: "Pain Relief",
      rating: 4.5,
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Amoxicillin 250mg",
      description: "Antibiotic used to treat a wide variety of bacterial infections.",
      price: "₹110",
      category: "Antibiotics",
      rating: 4.2,
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Omeprazole 20mg",
      description: "Reduces the amount of acid your stomach makes.",
      price: "₹40",
      category: "Digestive Health",
      rating: 4.7,
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      name: "Insulin Glargine",
      description: "Long-acting insulin used to treat type 1 and type 2 diabetes.",
      price: "₹850",
      category: "Diabetes",
      rating: 4.8,
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 5,
      name: "Aspirin 75mg",
      description: "Used for pain, fever, and inflammation. Also a blood thinner.",
      price: "₹25",
      category: "Pain Relief",
      rating: 4.0,
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
  ]

  const filteredMedicines = medicines.filter((med) => med.name.toLowerCase().includes(searchQuery.toLowerCase()))

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
            <h1 className="font-semibold text-gray-900">Medicine Marketplace</h1>
            <p className="text-sm text-gray-600">Browse and discover medicines</p>
          </div>
          <Button variant="ghost" size="sm" className="p-2">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="px-4 pb-4">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search medicines..."
                className="pl-10 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="px-3 bg-transparent">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Medicine List */}
      <div className="p-4">
        <h2 className="font-semibold text-gray-900 mb-4">All Medicines ({filteredMedicines.length})</h2>
        <div className="grid grid-cols-1 gap-4">
          {filteredMedicines.map((med) => (
            <Card key={med.id} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center space-x-4">
                <img
                  src={med.imageUrl || "/placeholder.svg"}
                  alt={med.name}
                  className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{med.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{med.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-green-600">{med.price}</span>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{med.rating}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" className="flex-1">
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
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
