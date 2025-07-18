"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { EnhancedFloatingActionButton } from "./enhanced-floating-action-button"
import { EnhancedPrescriptionModal } from "./enhanced-prescription-modal"
import { ReceiptUploadModal } from "./receipt-upload-modal"
import { PharmacyMap } from "./pharmacy-map"
import { Search, AlertTriangle, ShoppingCart, Award, TrendingUp } from "lucide-react"

export function PatientDashboard() {
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false)
  const [receiptModalOpen, setReceiptModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  const stats = [
    {
      title: "Total Savings",
      value: "₹1,245",
      change: "+12%",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Reward Points",
      value: "2,450",
      change: "+25 today",
      icon: Award,
      color: "text-blue-600",
    },
    {
      title: "Prescriptions",
      value: "8",
      change: "2 active",
      icon: ShoppingCart,
      color: "text-purple-600",
    },
  ]

  const recentActivity = [
    {
      id: "1",
      type: "prescription",
      title: "Prescription uploaded",
      description: "3 medicines detected",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: "2",
      type: "receipt",
      title: "Receipt analyzed",
      description: "Saved ₹15.50",
      time: "1 day ago",
      status: "completed",
    },
    {
      id: "3",
      type: "anomaly",
      title: "Price anomaly reported",
      description: "Under review",
      time: "3 days ago",
      status: "pending",
    },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "map":
        return <PharmacyMap />
      case "marketplace":
        return <MarketplaceView />
      case "anomaly":
        return <AnomalyReportView />
      default:
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="card-hover"
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                        </div>
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <Badge variant={activity.status === "completed" ? "default" : "secondary"}>
                        {activity.status}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">CuroGeniX</h1>
              <Badge variant="outline">Patient</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search medicines..." className="pl-10 w-64" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "map", label: "Find Pharma" },
              { id: "marketplace", label: "Marketplace" },
              { id: "anomaly", label: "Report Anomaly" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderContent()}</div>

      {/* Floating Action Button */}
      <EnhancedFloatingActionButton
        onPrescriptionUpload={() => setPrescriptionModalOpen(true)}
        onReceiptUpload={() => setReceiptModalOpen(true)}
      />

      {/* Modals */}
      <EnhancedPrescriptionModal isOpen={prescriptionModalOpen} onClose={() => setPrescriptionModalOpen(false)} />
      <ReceiptUploadModal isOpen={receiptModalOpen} onClose={() => setReceiptModalOpen(false)} />
    </div>
  )
}

function MarketplaceView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const medicines = [
    {
      id: "1",
      name: "Paracetamol 500mg",
      category: "Pain Relief",
      price: 45.5,
      availability: "In Stock",
      rating: 4.5,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      name: "Amoxicillin 250mg",
      category: "Antibiotics",
      price: 120.75,
      availability: "Limited",
      rating: 4.2,
      image: "/placeholder.svg?height=100&width=100",
    },
    // Add more medicines...
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Medicine Marketplace</h2>
        <div className="flex space-x-4">
          <Input
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Categories</option>
            <option value="pain-relief">Pain Relief</option>
            <option value="antibiotics">Antibiotics</option>
            <option value="vitamins">Vitamins</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {medicines.map((medicine, index) => (
          <motion.div
            key={medicine.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="cursor-pointer">
              <CardContent className="p-4">
                <img
                  src={medicine.image || "/placeholder.svg"}
                  alt={medicine.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold mb-1">{medicine.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{medicine.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">₹{medicine.price}</span>
                  <Badge variant={medicine.availability === "In Stock" ? "default" : "secondary"}>
                    {medicine.availability}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function AnomalyReportView() {
  const [formData, setFormData] = useState({
    pharmacy: "",
    medicine: "",
    reportedPrice: "",
    marketPrice: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Anomaly reported:", formData)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>Report Price Anomaly</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pharmacy Name</label>
              <Input
                value={formData.pharmacy}
                onChange={(e) => setFormData({ ...formData, pharmacy: e.target.value })}
                placeholder="Enter pharmacy name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Medicine Name</label>
              <Input
                value={formData.medicine}
                onChange={(e) => setFormData({ ...formData, medicine: e.target.value })}
                placeholder="Enter medicine name"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Reported Price (₹)</label>
                <Input
                  type="number"
                  value={formData.reportedPrice}
                  onChange={(e) => setFormData({ ...formData, reportedPrice: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expected Market Price (₹)</label>
                <Input
                  type="number"
                  value={formData.marketPrice}
                  onChange={(e) => setFormData({ ...formData, marketPrice: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide additional details about the anomaly..."
                className="w-full px-3 py-2 border rounded-md h-24 resize-none"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Report
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
