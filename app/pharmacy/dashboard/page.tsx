"use client"

import { useEffect, useState } from "react"
import { PharmacyLayout } from "@/components/layouts/pharmacy-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, TrendingUp, AlertTriangle, Star, Upload, BarChart3, MapPin, Bell, ShieldCheck, Clock, Award, MessageCircle } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"

export default function PharmacyDashboard() {
  const router = useRouter();
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

  const allAlerts = [
    { message: "Stock for Paracetamol is low across your district", time: "2 hours ago", type: "warning" },
    { message: "Insulin is unavailable in 5+ nearby pharmacies", time: "4 hours ago", type: "info" },
    { message: "Your pricing is competitive for Aspirin", time: "1 day ago", type: "success" },
    { message: "Ibuprofen stock is below minimum in your area", time: "2 days ago", type: "warning" },
    { message: "New government pricing update released", time: "3 days ago", type: "info" },
    { message: "Antibiotic sales spike detected", time: "4 days ago", type: "warning" },
  ];
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const alertsToShow = showAllAlerts ? allAlerts : allAlerts.slice(0, 3);

  return (
    <PharmacyLayout>
      <TooltipProvider>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="glass-card p-8 animate-liquid-flow rounded-2xl shadow-xl mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold mb-2 text-white">Welcome back, Apollo Pharmacy!</h1>
              <p className="text-gray-300 mb-4">Manage your inventory and stay competitive in your district</p>
              <div className="flex flex-wrap gap-3 mb-4">
                <Button className="glass-button border-0" onClick={() => router.push("/pharmacy/manage-inventory")}>Manage Inventory</Button>
                <Button className="glass-button border-0" onClick={() => router.push("/pharmacy/update-inventory")}>Update Inventory</Button>
              </div>
              <div className="flex flex-wrap gap-4 items-center text-sm mt-2">
                <span className="flex items-center gap-1 text-blue-300"><MapPin className="h-4 w-4" /> Mumbai, Maharashtra</span>
                <span className="flex items-center gap-1 text-green-400"><ShieldCheck className="h-4 w-4" /> Reliability Score: <span className="font-bold">92</span>/100</span>
                <span className="flex items-center gap-1 text-yellow-400"><Award className="h-4 w-4" /> Type: Retail Pharmacy</span>
                <span className="flex items-center gap-1 text-gray-400"><Clock className="h-4 w-4" /> Last Sync: 5 min ago</span>
                <span className="ml-2 px-2 py-1 rounded-full bg-green-500/20 text-green-400 font-semibold text-xs flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Verified Pharmacy</span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Total Items HoverCard */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <Card className="glass-card border-0 rounded-2xl shadow-xl p-4 transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl cursor-default group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold text-white tracking-wide">Total Items</CardTitle>
                    <Package className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-extrabold text-white mb-1">{totalItems}</div>
                    <p className="text-xs text-gray-400">Inventory count</p>
                  </CardContent>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent side="bottom" sideOffset={40} className="w-72 glass-card border-0 shadow-2xl p-4 rounded-2xl backdrop-blur-xl">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="h-4 w-4 text-blue-400" />
                    <span className="text-base font-bold text-white">Inventory Breakdown</span>
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-gray-200">
                    <div className="flex justify-between"><span>Tablets</span><span className="font-bold text-white">620</span></div>
                    <div className="flex justify-between"><span>Syrups</span><span className="font-bold text-white">210</span></div>
                    <div className="flex justify-between"><span>Injections</span><span className="font-bold text-white">150</span></div>
                    <div className="flex justify-between"><span>Ointments</span><span className="font-bold text-white">120</span></div>
                    <div className="flex justify-between"><span>Others</span><span className="font-bold text-white">147</span></div>
                  </div>
                  <div className="border-t border-white/10 my-2"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-300">Trend</span>
                    <div className="flex-1 h-2 rounded bg-green-500/20 relative">
                      <div className="absolute left-0 top-0 h-2 rounded bg-green-400" style={{width: '60%'}}></div>
                    </div>
                    <span className="text-xs text-green-400 font-bold ml-2">+12</span>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            {/* Price Score HoverCard (already present, but smaller) */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <Card className="glass-card border-0 rounded-2xl shadow-xl p-4 transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl cursor-default group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold text-white tracking-wide">Price Score</CardTitle>
                    <Star className="h-5 w-5 text-yellow-400 group-hover:scale-110 transition-transform" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-extrabold text-white mb-1">84%</div>
                    <p className="text-xs text-gray-400">Fair Pricing</p>
                  </CardContent>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent side="bottom" sideOffset={40} className="w-72 glass-card border-0 shadow-2xl p-4 rounded-2xl backdrop-blur-xl">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-400" />
                      <span className="text-base font-bold text-white">Overall Score</span>
                    </div>
                    <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 font-semibold text-xs flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400" /> Verified</span>
                  </div>
                  <div className="text-2xl font-extrabold text-yellow-400 mb-1">84% Fair Pricing</div>
                  <div className="text-xs text-gray-300 mb-2">Your prices are competitive and fair</div>
                  <div className="border-t border-white/10 my-2"></div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-xs text-gray-300">Below Avg</span>
                      <div className="flex-1 h-2 rounded bg-green-500/30 relative">
                        <div className="absolute left-0 top-0 h-2 rounded bg-green-400" style={{width: '67%'}}></div>
                      </div>
                      <span className="text-xs text-green-400 font-bold ml-2">67%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-xs text-gray-300">At Avg</span>
                      <div className="flex-1 h-2 rounded bg-blue-500/30 relative">
                        <div className="absolute left-0 top-0 h-2 rounded bg-blue-400" style={{width: '28%'}}></div>
                      </div>
                      <span className="text-xs text-blue-400 font-bold ml-2">28%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-xs text-gray-300">Above Avg</span>
                      <div className="flex-1 h-2 rounded bg-orange-500/30 relative">
                        <div className="absolute left-0 top-0 h-2 rounded bg-orange-400" style={{width: '5%'}}></div>
                      </div>
                      <span className="text-xs text-orange-400 font-bold ml-2">5%</span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            {/* Low Stock Items HoverCard */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <Card className="glass-card border-0 rounded-2xl shadow-xl p-4 transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl cursor-default group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold text-white tracking-wide">Low Stock Items</CardTitle>
                    <AlertTriangle className="h-5 w-5 text-orange-400 group-hover:scale-110 transition-transform" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-extrabold text-white mb-1">8</div>
                    <p className="text-xs text-gray-400">Need attention</p>
                  </CardContent>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent side="bottom" sideOffset={40} className="w-72 glass-card border-0 shadow-2xl p-4 rounded-2xl backdrop-blur-xl">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-orange-400" />
                    <span className="text-base font-bold text-white">Low Stock Medicines</span>
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-gray-200">
                    <div className="flex justify-between"><span>Paracetamol 500mg</span><span className="font-bold text-red-400">12 left</span></div>
                    <div className="flex justify-between"><span>Insulin Pen</span><span className="font-bold text-red-400">3 left</span></div>
                    <div className="flex justify-between"><span>Amoxicillin 250mg</span><span className="font-bold text-yellow-400">25 left</span></div>
                  </div>
                  <div className="border-t border-white/10 my-2"></div>
                  <div className="flex justify-end">
                    <Button size="sm" className="glass-button border-0 text-xs px-3 py-1" onClick={() => router.push("/pharmacy/update-inventory")}>Update Inventory</Button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* Low Stock Alert and Recent Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Low Stock Alert */}
            <Card className="glass-card border-0 rounded-2xl shadow-xl p-4 transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl cursor-default group">
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
                <Button className="w-full mt-4 glass-button border-0" onClick={() => router.push("/pharmacy/update-inventory")}>Update Inventory</Button>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card className="glass-card border-0 rounded-2xl shadow-xl p-4 transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl cursor-default group">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Bell className="mr-2 h-5 w-5 text-blue-400" />
                  Recent Alerts
                </CardTitle>
                <CardDescription className="text-gray-400">System notifications and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alertsToShow.map((alert, index) => (
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
                {(!showAllAlerts && allAlerts.length > 3) && (
                  <Button className="w-full mt-4 glass-button border-0" onClick={() => setShowAllAlerts(true)}>
                    View All Alerts
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Google Reviews & AI Insights Card */}
          <Card className="glass-card border-0 rounded-2xl shadow-xl p-6 mt-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-6 w-6 text-blue-400" />
                  <span className="text-lg font-bold text-white">Google Reviews</span>
                  <span className="ml-2 px-2 py-1 rounded-full bg-yellow-400/20 text-yellow-500 font-semibold text-xs flex items-center gap-1">4.3 <span className="text-yellow-500">★</span></span>
                  <span className="ml-2 text-xs text-gray-300">(128 reviews)</span>
                  <span className="ml-2 px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 font-semibold text-xs">Live</span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 h-2 rounded bg-green-500/20 relative">
                    <div className="absolute left-0 top-0 h-2 rounded bg-green-400" style={{width: '80%'}}></div>
                  </div>
                  <span className="text-xs text-green-400 font-bold ml-2">Positive</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {/* Review Card 1 */}
                  <div className="min-w-[200px] max-w-[220px] glass-card rounded-xl shadow p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-400">A</div>
                      <span className="text-xs text-gray-300">5 days ago</span>
                    </div>
                    <div className="text-sm text-white font-semibold">"Great service and friendly staff!"</div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">5★</span>
                      <span className="text-xs text-gray-400">by Priya S.</span>
                    </div>
                  </div>
                  {/* Review Card 2 */}
                  <div className="min-w-[200px] max-w-[220px] glass-card rounded-xl shadow p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center font-bold text-yellow-500">R</div>
                      <span className="text-xs text-gray-300">1 week ago</span>
                    </div>
                    <div className="text-sm text-white font-semibold">"Quick delivery but sometimes out of stock."</div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">3★</span>
                      <span className="text-xs text-gray-400">by Rahul M.</span>
                    </div>
                  </div>
                  {/* Review Card 3 */}
                  <div className="min-w-[200px] max-w-[220px] glass-card rounded-xl shadow p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center font-bold text-green-400">S</div>
                      <span className="text-xs text-gray-300">2 weeks ago</span>
                    </div>
                    <div className="text-sm text-white font-semibold">"Clean store, but waiting time can improve."</div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">4★</span>
                      <span className="text-xs text-gray-400">by Sneha T.</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 border-l border-white/10 pl-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base font-bold text-white flex items-center gap-2">
                    <span className="text-2xl">😊</span> Customer Sentiment
                  </span>
                  <span className="ml-2 px-2 py-1 rounded-full bg-green-500/20 text-green-400 font-semibold text-xs">Positive</span>
                </div>
                <div className="text-xs text-gray-300 mb-2">Most customers are happy with your service. Keep up the good work!</div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 h-2 rounded bg-green-500/20 relative">
                    <div className="absolute left-0 top-0 h-2 rounded bg-green-400" style={{width: '80%'}}></div>
                  </div>
                  <span className="text-xs text-green-400 font-bold ml-2">80% Positive</span>
                </div>
                <div className="border-t border-white/10 my-2"></div>
                <div className="mb-2 text-sm font-semibold text-white">AI Suggestions</div>
                <div className="flex flex-col gap-2 mb-4">
                  <div className="glass-card rounded-lg p-3 flex items-center gap-2 shadow">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-xs text-gray-200">Maintain high service quality to keep positive sentiment.</span>
                  </div>
                  <div className="glass-card rounded-lg p-3 flex items-center gap-2 shadow">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="text-xs text-gray-200">Reduce waiting time by optimizing staff schedules.</span>
                  </div>
                  <div className="glass-card rounded-lg p-3 flex items-center gap-2 shadow">
                    <Package className="h-4 w-4 text-green-400" />
                    <span className="text-xs text-gray-200">Improve stock management to avoid 'out of stock' issues.</span>
                  </div>
                </div>
                <div className="border-t border-white/10 my-2"></div>
                <div className="mb-2 text-sm font-semibold text-white">Recommended Actions</div>
                <div className="flex gap-2">
                  <div className="glass-card rounded-lg p-3 flex flex-col items-center gap-1 shadow min-w-[110px]">
                    <MessageCircle className="h-5 w-5 text-blue-400" />
                    <span className="text-xs text-gray-200 text-center">Reply to Reviews</span>
                  </div>
                  <div className="glass-card rounded-lg p-3 flex flex-col items-center gap-1 shadow min-w-[110px]">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="text-xs text-gray-200 text-center">Promote Offers</span>
                  </div>
                  <div className="glass-card rounded-lg p-3 flex flex-col items-center gap-1 shadow min-w-[110px]">
                    <Package className="h-5 w-5 text-green-400" />
                    <span className="text-xs text-gray-200 text-center">Improve Stock</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-blue-400">AI-powered insights based on customer sentiment.</div>
              </div>
            </div>
          </Card>
        {loading && <div className="text-center text-gray-400">Loading...</div>}
        {error && <div className="text-center text-red-400">{error}</div>}
        </div>
      </TooltipProvider>
    </PharmacyLayout>
  )
}
