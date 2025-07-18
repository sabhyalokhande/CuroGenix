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
        <div className="glass-card p-6 animate-liquid-flow">
          <h1 className="text-2xl font-bold mb-2 text-white">Government Command Center</h1>
          <p className="text-gray-300 mb-4">Monitor medicine availability and detect anomalies across all districts</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/government/anomalies">
              <Button className="glass-button border-0">
                <AlertTriangle className="mr-2 h-4 w-4" />
                View Anomalies
              </Button>
            </Link>
            <Link href="/government/map">
              <Button className="glass-button border-0">
                <MapPin className="mr-2 h-4 w-4" />
                District Map
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Pharmacies</CardTitle>
              <Building2 className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">1,247</div>
              <p className="text-xs text-gray-400">+23 this month</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Anomalies Today</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">12</div>
              <p className="text-xs text-gray-400">3 critical</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Price Spikes</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">8</div>
              <p className="text-xs text-gray-400">Across 5 districts</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Shortages Flagged</CardTitle>
              <Shield className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">15</div>
              <p className="text-xs text-gray-400">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Reported Medicines */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <AlertTriangle className="mr-2 h-5 w-5 text-orange-400" />
                Top Reported Medicines
              </CardTitle>
              <CardDescription className="text-gray-400">Most reported medicines across all districts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topReportedMedicines.map((medicine, index) => (
                  <div key={index} className="flex items-center justify-between p-3 glass-card rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-white">{medicine.name}</span>
                        <Badge
                          variant={
                            medicine.severity === "high"
                              ? "destructive"
                              : medicine.severity === "medium"
                                ? "secondary"
                                : "outline"
                          }
                          className="glass-button border-0"
                        >
                          {medicine.reports} reports
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>Severity: {medicine.severity}</span>
                        <span className={medicine.trend.startsWith("+") ? "text-red-400" : "text-green-400"}>
                          {medicine.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/government/reports">
                <Button className="w-full mt-4 glass-button border-0">View Detailed Reports</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Anomalies */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Brain className="mr-2 h-5 w-5 text-purple-400" />
                AI Detected Anomalies
              </CardTitle>
              <CardDescription className="text-gray-400">Recent anomalies detected by ML algorithms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAnomalies.map((anomaly, index) => (
                  <div key={index} className="p-3 glass-card rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{anomaly.district}</span>
                      <Badge
                        variant={
                          anomaly.severity === "Critical"
                            ? "destructive"
                            : anomaly.severity === "High"
                              ? "secondary"
                              : "outline"
                        }
                        className="glass-button border-0"
                      >
                        {anomaly.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">
                      {anomaly.medicine} - {anomaly.type}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center text-gray-400">
                        <Brain className="h-3 w-3 mr-1" />
                        {anomaly.confidence}% confidence
                      </span>
                      <span className="text-gray-400">{anomaly.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/government/anomalies">
                <Button className="w-full mt-4 glass-button border-0">View All Anomalies</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* District Overview Map */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <MapPin className="mr-2 h-5 w-5 text-blue-400" />
              District Availability Overview
            </CardTitle>
            <CardDescription className="text-gray-400">
              Real-time medicine availability across all districts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 glass-card rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-300">Interactive district map will be displayed here</p>
                <p className="text-sm text-gray-400 mt-1">
                  Green: Good availability | Yellow: Low stock | Red: Critical shortage
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">8</div>
                <p className="text-sm text-gray-400">Good Districts</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">4</div>
                <p className="text-sm text-gray-400">Warning Districts</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">2</div>
                <p className="text-sm text-gray-400">Critical Districts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/government/reports/generate">
                <Button className="h-20 flex flex-col space-y-2 glass-button border-0 w-full">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Generate Report</span>
                </Button>
              </Link>
              <Link href="/government/exports">
                <Button className="h-20 flex flex-col space-y-2 glass-button border-0 w-full">
                  <Download className="h-6 w-6" />
                  <span className="text-sm">Export Data</span>
                </Button>
              </Link>
              <Link href="/government/pharmacies">
                <Button className="h-20 flex flex-col space-y-2 glass-button border-0 w-full">
                  <Building2 className="h-6 w-6" />
                  <span className="text-sm">Pharmacy Data</span>
                </Button>
              </Link>
              <Link href="/government/analytics">
                <Button className="h-20 flex flex-col space-y-2 glass-button border-0 w-full">
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
