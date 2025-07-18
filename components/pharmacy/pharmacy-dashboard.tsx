"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, Package, AlertTriangle, Star } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  stock: number
  minStock: number
  price: number
  lastUpdated: string
}

export function PharmacyDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Paracetamol 500mg",
      stock: 150,
      minStock: 50,
      price: 45.5,
      lastUpdated: "2024-01-15",
    },
    {
      id: "2",
      name: "Amoxicillin 250mg",
      stock: 25,
      minStock: 30,
      price: 120.75,
      lastUpdated: "2024-01-14",
    },
    {
      id: "3",
      name: "Ibuprofen 400mg",
      stock: 80,
      minStock: 40,
      price: 65.25,
      lastUpdated: "2024-01-15",
    },
  ])

  const reliabilityScore = 87
  const lowStockItems = inventory.filter((item) => item.stock <= item.minStock)

  const stats = [
    {
      title: "Total Inventory",
      value: inventory.length.toString(),
      change: "+5 this week",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Low Stock Items",
      value: lowStockItems.length.toString(),
      change: "Needs attention",
      icon: AlertTriangle,
      color: "text-orange-600",
    },
    {
      title: "Reliability Score",
      value: `${reliabilityScore}%`,
      change: "+2% this month",
      icon: Star,
      color: "text-green-600",
    },
  ]

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Simulate CSV processing
      console.log("Processing CSV:", file.name)
      // In real implementation, parse CSV and update inventory
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "inventory":
        return <InventoryView inventory={inventory} onCSVUpload={handleCSVUpload} />
      case "analytics":
        return <AnalyticsView reliabilityScore={reliabilityScore} />
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

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-800">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Low Stock Alert</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStockItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            Current: {item.stock} | Minimum: {item.minStock}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          Reorder
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reliability Score */}
            <Card>
              <CardHeader>
                <CardTitle>Reliability Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{reliabilityScore}%</span>
                    <Badge variant="default">Excellent</Badge>
                  </div>
                  <Progress value={reliabilityScore} className="h-3" />
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium">Stock Accuracy</p>
                      <p className="text-gray-600">92%</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Price Compliance</p>
                      <p className="text-gray-600">85%</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Update Frequency</p>
                      <p className="text-gray-600">95%</p>
                    </div>
                  </div>
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
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Pharmacy
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">HealthPlus Pharmacy</span>
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
              { id: "inventory", label: "Inventory" },
              { id: "analytics", label: "Analytics" },
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
    </div>
  )
}

function InventoryView({
  inventory,
  onCSVUpload,
}: { inventory: InventoryItem[]; onCSVUpload: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <div className="flex space-x-3">
          <label className="cursor-pointer">
            <input type="file" accept=".csv" onChange={onCSVUpload} className="hidden" />
            <Button className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload CSV</span>
            </Button>
          </label>
          <Button variant="outline">Add Medicine</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {inventory.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={item.stock <= item.minStock ? "border-orange-200" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.stock <= item.minStock && <Badge variant="destructive">Low Stock</Badge>}
                    </div>
                    <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                      <span>Stock: {item.stock}</span>
                      <span>Min: {item.minStock}</span>
                      <span>Price: ₹{item.price}</span>
                      <span>Updated: {item.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    {item.stock <= item.minStock && <Button size="sm">Reorder</Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsView({ reliabilityScore }: { reliabilityScore: number }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics & Performance</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reliability Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-32 h-32 mx-auto mb-4"
                >
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <motion.path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray={`${reliabilityScore}, 100`}
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${reliabilityScore}, 100` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{reliabilityScore}%</span>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Stock Accuracy</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={92} className="w-20 h-2" />
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Price Compliance</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={85} className="w-20 h-2" />
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Update Frequency</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={95} className="w-20 h-2" />
                    <span className="text-sm font-medium">95%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Orders Fulfilled</span>
                <span className="font-semibold">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Response Time</span>
                <span className="font-semibold">2.3 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <span className="font-semibold">4.7/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Stock Turnover</span>
                <span className="font-semibold">12.5x</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
