"use client"

import { GovernmentLayout } from "@/components/layouts/government-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, Building2, TrendingUp, MapPin, FileText, Brain, Download } from "lucide-react"
import Link from "next/link"

export default function GovernmentDashboard() {
  const topReportedMedicines = [
    { name: "Insulin", reports: 45, severity: "high", trend: "+12%" },
    { name: "Paracetamol", reports: 32, severity: "medium", trend: "+5%" },
    { name: "Amoxicillin", reports: 28, severity: "medium", trend: "-2%" },
    { name: "Aspirin", reports: 19, severity: "low", trend: "+8%" },
    { name: "Metformin", reports: 15, severity: "low", trend: "+3%" },
  ]

  const recentAnomalies = [
    {
      district: "Central District",
      medicine: "Insulin",
      type: "Stock Shortage",
      severity: "Critical",
      confidence: 94,
      time: "2 hours ago",
    },
    {
      district: "North District",
      medicine: "Paracetamol",
      type: "Price Spike",
      severity: "High",
      confidence: 87,
      time: "4 hours ago",
    },
    {
      district: "South District",
      medicine: "Amoxicillin",
      type: "Availability Drop",
      severity: "Medium",
      confidence: 76,
      time: "6 hours ago",
    },
  ]

  return (
    <GovernmentLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-2">Government Command Center</h1>
          <p className="text-purple-100 mb-4">
            Monitor medicine availability and detect anomalies across all districts
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/government/anomalies">
              <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                <AlertTriangle className="mr-2 h-4 w-4" />
                View Anomalies
              </Button>
            </Link>
            <Link href="/government/map">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
              >
                <MapPin className="mr-2 h-4 w-4" />
                District Map
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Pharmacies</CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+23 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anomalies Today</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 critical</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Price Spikes</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Across 5 districts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shortages Flagged</CardTitle>
              <Shield className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Reported Medicines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-orange-600" />
                Top Reported Medicines
              </CardTitle>
              <CardDescription>Most reported medicines across all districts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topReportedMedicines.map((medicine, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{medicine.name}</span>
                        <Badge
                          variant={
                            medicine.severity === "high"
                              ? "destructive"
                              : medicine.severity === "medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {medicine.reports} reports
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Severity: {medicine.severity}</span>
                        <span className={medicine.trend.startsWith("+") ? "text-red-600" : "text-green-600"}>
                          {medicine.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/government/reports">
                <Button className="w-full mt-4">View Detailed Reports</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Anomalies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-purple-600" />
                AI Detected Anomalies
              </CardTitle>
              <CardDescription>Recent anomalies detected by ML algorithms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAnomalies.map((anomaly, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{anomaly.district}</span>
                      <Badge
                        variant={
                          anomaly.severity === "Critical"
                            ? "destructive"
                            : anomaly.severity === "High"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {anomaly.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {anomaly.medicine} - {anomaly.type}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center">
                        <Brain className="h-3 w-3 mr-1" />
                        {anomaly.confidence}% confidence
                      </span>
                      <span>{anomaly.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/government/anomalies">
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All Anomalies
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* District Overview Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              District Availability Overview
            </CardTitle>
            <CardDescription>Real-time medicine availability across all districts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Interactive district map will be displayed here</p>
                <p className="text-sm text-gray-400 mt-1">
                  Green: Good availability | Yellow: Low stock | Red: Critical shortage
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">8</div>
                <p className="text-sm text-muted-foreground">Good Districts</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">4</div>
                <p className="text-sm text-muted-foreground">Warning Districts</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">2</div>
                <p className="text-sm text-muted-foreground">Critical Districts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/government/reports/generate">
                <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Generate Report</span>
                </Button>
              </Link>
              <Link href="/government/exports">
                <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                  <Download className="h-6 w-6" />
                  <span className="text-sm">Export Data</span>
                </Button>
              </Link>
              <Link href="/government/pharmacies">
                <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                  <Building2 className="h-6 w-6" />
                  <span className="text-sm">Pharmacy Data</span>
                </Button>
              </Link>
              <Link href="/government/analytics">
                <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                  <Brain className="h-6 w-6" />
                  <span className="text-sm">ML Analytics</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </GovernmentLayout>
  )
}
