"use client"

import { useEffect, useState } from "react"
import { PharmacyLayout } from "@/components/layouts/pharmacy-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, TrendingUp, AlertTriangle, Star, Upload, BarChart3, MapPin, Bell } from "lucide-react"
import Link from "next/link"

export default function PharmacyDashboard() {
  const [medicines, setMedicines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    setError("")
    fetch("/api/medicines")
      .then((r) => r.json())
      .then((data) => setMedicines(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load inventory"))
      .finally(() => setLoading(false))
  }, [])

  const lowStockItems = medicines.filter((m) => m.stock < 30)
  const totalItems = medicines.length

  const recentAlerts = [
    { message: "Stock for Paracetamol is low across your district", time: "2 hours ago", type: "warning" },
    { message: "Insulin is unavailable in 5+ nearby pharmacies", time: "4 hours ago", type: "info" },
    { message: "Your pricing is competitive for Aspirin", time: "1 day ago", type: "success" },
  ]

  return (
    <PharmacyLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="glass-card p-6 animate-liquid-flow">
          <h1 className="text-2xl font-bold mb-2 text-white">Welcome back, Apollo Pharmacy!</h1>
          <p className="text-gray-300 mb-4">Manage your inventory and stay competitive in your district</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/pharmacy/inventory">
              <Button className="glass-button border-0">
                <Package className="mr-2 h-4 w-4" />
                Manage Inventory
              </Button>
            </Link>
            <Link href="/pharmacy/upload">
              <Button className="glass-button border-0">
                <Upload className="mr-2 h-4 w-4" />
                Upload CSV
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Items</CardTitle>
              <Package className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalItems}</div>
              <p className="text-xs text-gray-400">Inventory count</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Price Score</CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">84%</div>
              <p className="text-xs text-gray-400">Fair Pricing</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">8</div>
              <p className="text-xs text-gray-400">Need attention</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹2.4L</div>
              <p className="text-xs text-gray-400">+8% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alert */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <AlertTriangle className="mr-2 h-5 w-5 text-orange-400" />
                Low Stock Alert
              </CardTitle>
              <CardDescription className="text-gray-400">Items that need immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.length === 0 && <div className="text-gray-400">No low stock items.</div>}
                {lowStockItems.map((item, index) => (
                  <div key={item._id || index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{item.name}</span>
                      <Badge
                        variant={item.stock < 10 ? "destructive" : "secondary"}
                        className="glass-button border-0"
                      >
                        {item.stock} left
                      </Badge>
                    </div>
                    <Progress value={(item.stock / 30) * 100} className="h-2" />
                    <p className="text-xs text-gray-400">Minimum required: 30</p>
                  </div>
                ))}
              </div>
              <Link href="/pharmacy/inventory">
                <Button className="w-full mt-4 glass-button border-0">Update Inventory</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Bell className="mr-2 h-5 w-5 text-blue-400" />
                Recent Alerts
              </CardTitle>
              <CardDescription className="text-gray-400">System notifications and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 glass-card rounded-lg">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        alert.type === "warning"
                          ? "bg-orange-500"
                          : alert.type === "info"
                            ? "bg-blue-500"
                            : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-white">{alert.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/pharmacy/alerts">
                <Button className="w-full mt-4 glass-button border-0">View All Alerts</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">Common tasks for pharmacy management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/pharmacy/inventory/add">
                <Button className="h-20 flex flex-col space-y-2 glass-button border-0 w-full">
                  <Package className="h-6 w-6" />
                  <span className="text-sm">Add Medicine</span>
                </Button>
              </Link>
              <Link href="/pharmacy/price-check">
                <Button className="h-20 flex flex-col space-y-2 glass-button border-0 w-full">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">Price Check</span>
                </Button>
              </Link>
              <Link href="/pharmacy/demand-map">
                <Button className="h-20 flex flex-col space-y-2 glass-button border-0 w-full">
                  <MapPin className="h-6 w-6" />
                  <span className="text-sm">Demand Map</span>
                </Button>
              </Link>
              <Link href="/pharmacy/upload">
                <Button className="h-20 flex flex-col space-y-2 glass-button border-0 w-full">
                  <Upload className="h-6 w-6" />
                  <span className="text-sm">Upload CSV</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Price Performance */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Star className="mr-2 h-5 w-5 text-yellow-400" />
              Price Performance
            </CardTitle>
            <CardDescription className="text-gray-400">How your pricing compares to district average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                <div>
                  <p className="font-medium text-white">Overall Score: 84% Fair Pricing</p>
                  <p className="text-sm text-gray-400">Your prices are competitive and fair</p>
                </div>
                <Badge className="glass-button border-0 bg-green-500/20 text-green-400">Verified Pricing</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">67%</p>
                  <p className="text-sm text-gray-400">Below Average</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">28%</p>
                  <p className="text-sm text-gray-400">At Average</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-400">5%</p>
                  <p className="text-sm text-gray-400">Above Average</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {loading && <div className="text-center text-gray-400">Loading...</div>}
        {error && <div className="text-center text-red-400">{error}</div>}
      </div>
    </PharmacyLayout>
  )
}
