"use client"

import { useEffect, useState } from "react"
import { GovernmentLayout } from "@/components/layouts/government-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, Building2, TrendingUp, MapPin, FileText, Brain, Download } from "lucide-react"
import Link from "next/link"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import InteractiveIndiaMapMaplibre from "@/components/ui/interactive-india-map-maplibre"

export default function GovernmentDashboard() {
  const [medicines, setMedicines] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)
  const [hoveredState, setHoveredState] = useState<string | null>(null)

  // Global state elements storage
  const stateElementsMap = new WeakMap()
  
  // Mock data for medicine availability across states with stock numbers
  const availabilityData: { [key: string]: { status: string; stock: number; pharmacies: number } } = {
    "Maharashtra": { status: "good", stock: 1247, pharmacies: 89 },
    "Delhi": { status: "low", stock: 156, pharmacies: 12 },
    "Karnataka": { status: "good", stock: 892, pharmacies: 67 },
    "Uttar Pradesh": { status: "low", stock: 234, pharmacies: 18 },
    "Tamil Nadu": { status: "good", stock: 756, pharmacies: 54 },
    "Gujarat": { status: "low", stock: 189, pharmacies: 15 },
    "Punjab": { status: "good", stock: 445, pharmacies: 32 },
    "Andhra Pradesh": { status: "low", stock: 267, pharmacies: 21 },
    "Telangana": { status: "good", stock: 523, pharmacies: 38 },
    "Madhya Pradesh": { status: "low", stock: 198, pharmacies: 16 },
    "West Bengal": { status: "good", stock: 678, pharmacies: 48 },
    "Kerala": { status: "low", stock: 145, pharmacies: 11 },
    "Bihar": { status: "good", stock: 389, pharmacies: 28 },
    "Chhattisgarh": { status: "low", stock: 123, pharmacies: 9 },
    "Himachal Pradesh": { status: "good", stock: 234, pharmacies: 17 },
    "Jharkhand": { status: "low", stock: 167, pharmacies: 13 },
    "Manipur": { status: "good", stock: 89, pharmacies: 6 },
    "Meghalaya": { status: "low", stock: 67, pharmacies: 5 },
    "Mizoram": { status: "good", stock: 78, pharmacies: 5 },
    "Nagaland": { status: "low", stock: 45, pharmacies: 3 },
    "Odisha": { status: "good", stock: 345, pharmacies: 25 },
    "Puducherry": { status: "low", stock: 34, pharmacies: 2 },
    "Rajasthan": { status: "good", stock: 456, pharmacies: 33 },
    "Sikkim": { status: "low", stock: 23, pharmacies: 2 },
    "Tripura": { status: "good", stock: 67, pharmacies: 5 },
    "Uttarakhand": { status: "low", stock: 89, pharmacies: 7 },
    "Goa": { status: "good", stock: 123, pharmacies: 9 },
    "Haryana": { status: "low", stock: 156, pharmacies: 12 },
    "Jammu and Kashmir": { status: "good", stock: 234, pharmacies: 17 },
    "Lakshadweep": { status: "low", stock: 12, pharmacies: 1 },
    "Daman and Diu": { status: "good", stock: 45, pharmacies: 3 },
    "Dadra and Nagar Haveli": { status: "low", stock: 23, pharmacies: 2 },
    "Andaman and Nicobar Islands": { status: "good", stock: 67, pharmacies: 4 },
  }

  // Get current user info
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        // Check if user has government role
        if (data.role !== 'government') {
          // Redirect to appropriate dashboard based on role
          if (data.role === 'pharmacy') {
            window.location.href = '/pharmacy/dashboard';
          } else if (data.role === 'patient') {
            window.location.href = '/patient/dashboard';
          } else {
            window.location.href = '/government/login';
          }
        }
      })
      .catch(err => {
        console.error('Failed to fetch user:', err);
        setUser(null);
        // Redirect to login if authentication fails
        window.location.href = '/government/login';
      });
    } else {
      // No token, redirect to login
      window.location.href = '/government/login';
    }
  }, []);

  useEffect(() => {
    setLoading(true)
    setError("")
    Promise.all([
      fetch("/api/medicines").then(r => r.json()),
      fetch("/api/prescriptions").then(r => r.json()),
    ])
      .then(([meds, pres]) => {
        setMedicines(Array.isArray(meds) ? meds : [])
        setPrescriptions(Array.isArray(pres) ? pres : [])
      })
      .catch(() => setError("Failed to load dashboard data"))
      .finally(() => setLoading(false))
  }, [])



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
    <GovernmentLayout user={user}>

      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="glass-card p-8 animate-liquid-flow">
          <h1 className="text-4xl font-bold mb-3 text-white">Government Command Center</h1>
          <p className="text-xl text-gray-300">Monitor medicine availability and detect anomalies across all districts</p>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Card className="glass-card border-0 transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl cursor-default group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Active Pharmacies</CardTitle>
                  <Building2 className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">1,247</div>
                  <p className="text-xs text-gray-400">+23 this month</p>
                </CardContent>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent side="bottom" sideOffset={40} className="w-72 glass-card border-0 shadow-2xl p-4 rounded-2xl backdrop-blur-xl">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-4 w-4 text-blue-400" />
                  <span className="text-base font-bold text-white">Pharmacy Network</span>
                </div>
                <div className="text-2xl font-extrabold text-blue-400 mb-1">1,247 Active</div>
                <div className="text-xs text-gray-300 mb-2">Registered pharmacies across all districts</div>
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex flex-col gap-1 text-xs text-gray-200">
                  <div className="flex justify-between"><span>Verified</span><span className="font-bold text-white">1,180</span></div>
                  <div className="flex justify-between"><span>Pending</span><span className="font-bold text-white">67</span></div>
                  <div className="flex justify-between"><span>New This Month</span><span className="font-bold text-green-400">+23</span></div>
                </div>
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-300">Growth</span>
                  <div className="flex-1 h-2 rounded bg-green-500/20 relative">
                    <div className="absolute left-0 top-0 h-2 rounded bg-green-400" style={{width: '85%'}}></div>
                  </div>
                  <span className="text-xs text-green-400 font-bold ml-2">+1.9%</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Card className="glass-card border-0 transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl cursor-default group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Anomalies Today</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-400 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">12</div>
                  <p className="text-xs text-gray-400">3 critical</p>
                </CardContent>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent side="bottom" sideOffset={40} className="w-72 glass-card border-0 shadow-2xl p-4 rounded-2xl backdrop-blur-xl">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-orange-400" />
                  <span className="text-base font-bold text-white">Today's Anomalies</span>
                </div>
                <div className="text-2xl font-extrabold text-orange-400 mb-1">12 Detected</div>
                <div className="text-xs text-gray-300 mb-2">AI-powered anomaly detection</div>
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex flex-col gap-1 text-xs text-gray-200">
                  <div className="flex justify-between"><span>Critical</span><span className="font-bold text-red-400">3</span></div>
                  <div className="flex justify-between"><span>High Priority</span><span className="font-bold text-orange-400">5</span></div>
                  <div className="flex justify-between"><span>Medium</span><span className="font-bold text-yellow-400">3</span></div>
                  <div className="flex justify-between"><span>Low</span><span className="font-bold text-green-400">1</span></div>
                </div>
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-300">Response Time</span>
                  <div className="flex-1 h-2 rounded bg-blue-500/20 relative">
                    <div className="absolute left-0 top-0 h-2 rounded bg-blue-400" style={{width: '92%'}}></div>
                  </div>
                  <span className="text-xs text-blue-400 font-bold ml-2">2.3min</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Card className="glass-card border-0 transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl cursor-default group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Price Spikes</CardTitle>
                  <TrendingUp className="h-4 w-4 text-red-400 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">8</div>
                  <p className="text-xs text-gray-400">Across 5 districts</p>
                </CardContent>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent side="bottom" sideOffset={40} className="w-72 glass-card border-0 shadow-2xl p-4 rounded-2xl backdrop-blur-xl">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-red-400" />
                  <span className="text-base font-bold text-white">Price Monitoring</span>
                </div>
                <div className="text-2xl font-extrabold text-red-400 mb-1">8 Spikes</div>
                <div className="text-xs text-gray-300 mb-2">Unusual price increases detected</div>
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex flex-col gap-1 text-xs text-gray-200">
                  <div className="flex justify-between"><span>Mumbai</span><span className="font-bold text-red-400">+45%</span></div>
                  <div className="flex justify-between"><span>Delhi</span><span className="font-bold text-red-400">+32%</span></div>
                  <div className="flex justify-between"><span>Bangalore</span><span className="font-bold text-orange-400">+28%</span></div>
                  <div className="flex justify-between"><span>Chennai</span><span className="font-bold text-orange-400">+22%</span></div>
                  <div className="flex justify-between"><span>Kolkata</span><span className="font-bold text-yellow-400">+18%</span></div>
                </div>
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-300">Avg Increase</span>
                  <div className="flex-1 h-2 rounded bg-red-500/20 relative">
                    <div className="absolute left-0 top-0 h-2 rounded bg-red-400" style={{width: '29%'}}></div>
                  </div>
                  <span className="text-xs text-red-400 font-bold ml-2">+29%</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Card className="glass-card border-0 transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl cursor-default group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Shortages Flagged</CardTitle>
                  <Shield className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">15</div>
                  <p className="text-xs text-gray-400">Requires attention</p>
                </CardContent>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent side="bottom" sideOffset={40} className="w-72 glass-card border-0 shadow-2xl p-4 rounded-2xl backdrop-blur-xl">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <span className="text-base font-bold text-white">Stock Shortages</span>
                </div>
                <div className="text-2xl font-extrabold text-purple-400 mb-1">15 Flagged</div>
                <div className="text-xs text-gray-300 mb-2">Medicines requiring immediate action</div>
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex flex-col gap-1 text-xs text-gray-200">
                  <div className="flex justify-between"><span>Critical</span><span className="font-bold text-red-400">8</span></div>
                  <div className="flex justify-between"><span>High Priority</span><span className="font-bold text-orange-400">4</span></div>
                  <div className="flex justify-between"><span>Medium</span><span className="font-bold text-yellow-400">2</span></div>
                  <div className="flex justify-between"><span>Low</span><span className="font-bold text-green-400">1</span></div>
                </div>
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-300">Resolution Rate</span>
                  <div className="flex-1 h-2 rounded bg-purple-500/20 relative">
                    <div className="absolute left-0 top-0 h-2 rounded bg-purple-400" style={{width: '78%'}}></div>
                  </div>
                  <span className="text-xs text-purple-400 font-bold ml-2">78%</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Reported Medicines */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <Card className="glass-card border-0 transition-transform duration-200 hover:scale-[1.02] hover:shadow-2xl cursor-default group">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <AlertTriangle className="mr-2 h-5 w-5 text-orange-400 group-hover:scale-110 transition-transform" />
                    Top Reported Medicines
                  </CardTitle>
                  <CardDescription className="text-gray-400">Most reported medicines across all districts</CardDescription>
                </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicines.length === 0 && <div className="text-gray-400">No medicines found.</div>}
                {medicines.slice(0, 5).map((medicine, index) => (
                  <div key={medicine._id || index} className="flex items-center justify-between p-3 glass-card rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-white">{medicine.name}</span>
                        <Badge
                          variant={medicine.stock < 10 ? "destructive" : medicine.stock < 30 ? "secondary" : "outline"}
                          className="glass-button border-0"
                        >
                          {medicine.stock} in stock
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>Stock: {medicine.stock}</span>
                        <span className="text-green-400">{medicine.price ? `₹${medicine.price}` : "N/A"}</span>
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
            </HoverCardTrigger>
            <HoverCardContent side="bottom" sideOffset={40} className="w-80 glass-card border-0 shadow-2xl p-4 rounded-2xl backdrop-blur-xl">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-orange-400" />
                  <span className="text-base font-bold text-white">Medicine Reports</span>
                </div>
                <div className="text-lg font-extrabold text-orange-400 mb-1">Top 5 Reported</div>
                <div className="text-xs text-gray-300 mb-2">Most frequently reported medicines</div>
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex flex-col gap-1 text-xs text-gray-200">
                  <div className="flex justify-between"><span>Insulin</span><span className="font-bold text-red-400">45 reports</span></div>
                  <div className="flex justify-between"><span>Paracetamol</span><span className="font-bold text-orange-400">32 reports</span></div>
                  <div className="flex justify-between"><span>Amoxicillin</span><span className="font-bold text-yellow-400">28 reports</span></div>
                  <div className="flex justify-between"><span>Aspirin</span><span className="font-bold text-green-400">19 reports</span></div>
                  <div className="flex justify-between"><span>Metformin</span><span className="font-bold text-green-400">15 reports</span></div>
                </div>
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-300">Total Reports</span>
                  <div className="flex-1 h-2 rounded bg-orange-500/20 relative">
                    <div className="absolute left-0 top-0 h-2 rounded bg-orange-400" style={{width: '67%'}}></div>
                  </div>
                  <span className="text-xs text-orange-400 font-bold ml-2">139</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          {/* Recent Anomalies */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <Card className="glass-card border-0 transition-transform duration-200 hover:scale-[1.02] hover:shadow-2xl cursor-default group">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Brain className="mr-2 h-5 w-5 text-purple-400 group-hover:scale-110 transition-transform" />
                    AI Detected Anomalies
                  </CardTitle>
                  <CardDescription className="text-gray-400">Recent anomalies detected by ML algorithms</CardDescription>
                </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prescriptions.length === 0 && <div className="text-gray-400">No anomalies found.</div>}
                {prescriptions.slice(0, 3).map((pres, index) => (
                  <div key={pres._id || index} className="p-3 glass-card rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">Prescription</span>
                      <Badge variant="secondary" className="glass-button border-0">Detected</Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">Image: {pres.imageUrl}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center text-gray-400">Uploaded: {new Date(pres.uploadedAt).toLocaleString()}</span>
                      <span className="text-gray-400">ID: {pres._id}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/government/anomalies">
                <Button className="w-full mt-4 glass-button border-0">View All Anomalies</Button>
              </Link>
            </CardContent>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent side="bottom" sideOffset={40} className="w-80 glass-card border-0 shadow-2xl p-4 rounded-2xl backdrop-blur-xl">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="h-4 w-4 text-purple-400" />
                  <span className="text-base font-bold text-white">AI Anomaly Detection</span>
                </div>
                <div className="text-lg font-extrabold text-purple-400 mb-1">ML-Powered Analysis</div>
                <div className="text-xs text-gray-300 mb-2">Advanced pattern recognition</div>
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex flex-col gap-1 text-xs text-gray-200">
                  <div className="flex justify-between"><span>Prescription Fraud</span><span className="font-bold text-red-400">High</span></div>
                  <div className="flex justify-between"><span>Price Manipulation</span><span className="font-bold text-orange-400">Medium</span></div>
                  <div className="flex justify-between"><span>Stock Discrepancies</span><span className="font-bold text-yellow-400">Low</span></div>
                  <div className="flex justify-between"><span>Quality Issues</span><span className="font-bold text-green-400">Minimal</span></div>
                </div>
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-300">Accuracy</span>
                  <div className="flex-1 h-2 rounded bg-purple-500/20 relative">
                    <div className="absolute left-0 top-0 h-2 rounded bg-purple-400" style={{width: '94%'}}></div>
                  </div>
                  <span className="text-xs text-purple-400 font-bold ml-2">94%</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        {/* District Overview Map */}
        <Card className="glass-card border-0 transition-transform duration-200 hover:scale-[1.01] hover:shadow-2xl cursor-default group">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <MapPin className="mr-2 h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
              District Availability Overview
            </CardTitle>
            <CardDescription className="text-gray-400">
              Real-time medicine availability across all districts
            </CardDescription>
            
            {/* State Data Display */}
            {hoveredState && (
              <div className="mt-4 p-4 glass-card rounded-lg border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-white">{hoveredState}</h3>
                  <span className="text-sm font-medium px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                    Interactive Map
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">Real-time</div>
                    <div className="text-gray-400">Data</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">Zoom</div>
                    <div className="text-gray-400">Enabled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">Cities</div>
                    <div className="text-gray-400">Visible</div>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>

            
            <div className="flex gap-4 h-[700px]">
              {/* Left Panel */}
              <div className="w-64 space-y-3">
                <div className="glass-card p-3 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Map Legend</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Good Stock Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Low Stock Alert</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                      <span className="text-sm text-gray-300">Default State</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-3 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-300">Total States:</span>
                      <span className="text-sm text-white font-medium">33</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-300">Good Stock:</span>
                      <span className="text-sm text-green-400 font-medium">{Object.values(availabilityData).filter(state => state.status === 'good').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-300">Low Stock:</span>
                      <span className="text-sm text-red-400 font-medium">{Object.values(availabilityData).filter(state => state.status === 'low').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-300">Coverage:</span>
                      <span className="text-sm text-blue-400 font-medium">100%</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-3 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Stock Distribution</h3>
                  <div className="space-y-3">
                    {/* Pie Chart */}
                    <div className="flex items-center justify-center h-32">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#374151"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="3"
                            strokeDasharray={`${(Object.values(availabilityData).filter(state => state.status === 'good').length/Object.keys(availabilityData).length)*100}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-white">{Math.round((Object.values(availabilityData).filter(state => state.status === 'good').length/Object.keys(availabilityData).length)*100)}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-400">Good Stock</span>
                      <span className="text-gray-400">{Object.values(availabilityData).filter(state => state.status === 'good').length}/{Object.keys(availabilityData).length}</span>
                    </div>
                  </div>
                </div>


              </div>

              {/* Interactive Map Container */}
              <div className="flex-1 bg-black rounded-xl overflow-hidden relative">
                <div className="text-white text-center font-bold py-2 bg-gray-900/80">District Availability Overview</div>
                <InteractiveIndiaMapMaplibre />
              </div>

              {/* Right Panel */}
              <div className="w-64 space-y-3">
                <div className="glass-card p-3 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Monthly Trends</h3>
                  <div className="space-y-2">
                    {/* Mini Bar Chart */}
                    <div className="flex items-end justify-between h-20 space-x-1">
                      {[65, 72, 68, 85, 78, 82, 79, 88, 85, 90, 87, 92].map((value, index) => (
                        <div key={index} className="flex-1 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t" 
                             style={{ height: `${value}%` }}>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Jan</span>
                      <span>Dec</span>
                    </div>
                    <div className="text-center text-sm text-green-400 font-medium">
                      +27% this year
                    </div>
                  </div>
                </div>

                <div className="glass-card p-3 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Critical Alerts</h3>
                  <div className="space-y-3">
                    {/* Alert Bars */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">High Priority</span>
                        <div className="w-16 bg-red-500 rounded-full h-2">
                          <div className="bg-red-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-sm text-red-400">8</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Medium</span>
                        <div className="w-16 bg-yellow-500 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-sm text-yellow-400">5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Low</span>
                        <div className="w-16 bg-green-500 rounded-full h-2">
                          <div className="bg-green-400 h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                        <span className="text-sm text-green-400">2</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-3 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Top Medicines</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Insulin</span>
                      <span className="text-sm text-red-400">Critical</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Paracetamol</span>
                      <span className="text-sm text-yellow-400">Low</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Amoxicillin</span>
                      <span className="text-sm text-green-400">Good</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Aspirin</span>
                      <span className="text-sm text-green-400">Good</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-3 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Recent Activity</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Stock updated - Maharashtra</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span>Alert triggered - Delhi</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Report generated</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Price spike detected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Enhanced Map Info */}
            <div className="flex justify-center mt-6">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Interactive India Medicine Availability Map</p>
                <p className="text-xs text-gray-500">Zoom in to see cities • Hover over markers for details • Real-time data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <HoverCard>
          <HoverCardTrigger asChild>
            <Card className="glass-card border-0 transition-transform duration-200 hover:scale-[1.01] hover:shadow-2xl cursor-default group">
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
            </HoverCardTrigger>
            <HoverCardContent side="bottom" sideOffset={40} className="w-80 glass-card border-0 shadow-2xl p-4 rounded-2xl backdrop-blur-xl">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-blue-400" />
                  <span className="text-base font-bold text-white">Administrative Tools</span>
                </div>
                <div className="text-lg font-extrabold text-blue-400 mb-1">Quick Access</div>
                <div className="text-xs text-gray-300 mb-2">Essential government functions</div>
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex flex-col gap-1 text-xs text-gray-200">
                  <div className="flex justify-between"><span>Report Generation</span><span className="font-bold text-green-400">Available</span></div>
                  <div className="flex justify-between"><span>Data Export</span><span className="font-bold text-green-400">Available</span></div>
                  <div className="flex justify-between"><span>Pharmacy Management</span><span className="font-bold text-green-400">Available</span></div>
                  <div className="flex justify-between"><span>ML Analytics</span><span className="font-bold text-green-400">Available</span></div>
                </div>
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-300">System Status</span>
                  <div className="flex-1 h-2 rounded bg-green-500/20 relative">
                    <div className="absolute left-0 top-0 h-2 rounded bg-green-400" style={{width: '100%'}}></div>
                  </div>
                  <span className="text-xs text-green-400 font-bold ml-2">Online</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        {loading && <div className="text-center text-gray-400">Loading...</div>}
        {error && <div className="text-center text-red-400">{error}</div>}
      </div>
    </GovernmentLayout>
  )
}
