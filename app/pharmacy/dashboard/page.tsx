"use client"

import { PharmacyLayout } from "@/components/layouts/pharmacy-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, TrendingUp, AlertTriangle, Star, Upload, BarChart3, MapPin, Bell } from "lucide-react"
import Link from "next/link"

export default function PharmacyDashboard() {
  const lowStockItems = [
    { name: "Paracetamol 500mg", current: 12, minimum: 50, status: "critical" },
    { name: "Insulin Pen", current: 3, minimum: 10, status: "critical" },
    { name: "Amoxicillin 250mg", current: 25, minimum: 30, status: "low" },
  ]

  const recentAlerts = [
    { message: "Stock for Paracetamol is low across your district", time: "2 hours ago", type: "warning" },
    { message: "Insulin is unavailable in 5+ nearby pharmacies", time: "4 hours ago", type: "info" },
    { message: "Your pricing is competitive for Aspirin", time: "1 day ago", type: "success" },
  ]

  return (
    <PharmacyLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-2">Welcome back, Apollo Pharmacy!</h1>
          <p className="text-blue-100 mb-4">Manage your inventory and stay competitive in your district</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/pharmacy/inventory">
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                <Package className="mr-2 h-4 w-4" />
                Manage Inventory
              </Button>
            </Link>
            <Link href="/pharmacy/upload">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload CSV
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+12 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Price Score</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">84%</div>
              <p className="text-xs text-muted-foreground">Fair Pricing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹2.4L</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-orange-600" />
                Low Stock Alert
              </CardTitle>
              <CardDescription>Items that need immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.name}</span>
                      <Badge variant={item.status === "critical" ? "destructive" : "secondary"}>
                        {item.current} left
                      </Badge>
                    </div>
                    <Progress value={(item.current / item.minimum) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">Minimum required: {item.minimum}</p>
                  </div>
                ))}
              </div>
              <Link href="/pharmacy/inventory">
                <Button className="w-full mt-4">Update Inventory</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Recent Alerts
              </CardTitle>
              <CardDescription>System notifications and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
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
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/pharmacy/alerts">
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All Alerts
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for pharmacy management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/pharmacy/inventory/add">
                <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                  <Package className="h-6 w-6" />
                  <span className="text-sm">Add Medicine</span>
                </Button>
              </Link>
              <Link href="/pharmacy/price-check">
                <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">Price Check</span>
                </Button>
              </Link>
              <Link href="/pharmacy/demand-map">
                <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                  <MapPin className="h-6 w-6" />
                  <span className="text-sm">Demand Map</span>
                </Button>
              </Link>
              <Link href="/pharmacy/upload">
                <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                  <Upload className="h-6 w-6" />
                  <span className="text-sm">Upload CSV</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Price Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-yellow-600" />
              Price Performance
            </CardTitle>
            <CardDescription>How your pricing compares to district average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Overall Score: 84% Fair Pricing</p>
                  <p className="text-sm text-muted-foreground">Your prices are competitive and fair</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Verified Pricing</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">67%</p>
                  <p className="text-sm text-muted-foreground">Below Average</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">28%</p>
                  <p className="text-sm text-muted-foreground">At Average</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">5%</p>
                  <p className="text-sm text-muted-foreground">Above Average</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PharmacyLayout>
  )
}
