"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

interface DistrictData {
  id: string
  name: string
  status: 'good' | 'warning' | 'critical'
  availability: number
  anomalies: number
  medicines: string[]
}

const districtData: DistrictData[] = [
  { id: "IN-MH", name: "Maharashtra", status: "good", availability: 85, anomalies: 2, medicines: ["Paracetamol", "Insulin", "Amoxicillin"] },
  { id: "IN-DL", name: "Delhi", status: "warning", availability: 65, anomalies: 5, medicines: ["Insulin", "Metformin"] },
  { id: "IN-KA", name: "Karnataka", status: "good", availability: 90, anomalies: 1, medicines: ["Paracetamol", "Aspirin"] },
  { id: "IN-TN", name: "Tamil Nadu", status: "critical", availability: 45, anomalies: 8, medicines: ["Insulin", "Paracetamol", "Amoxicillin"] },
  { id: "IN-GJ", name: "Gujarat", status: "warning", availability: 70, anomalies: 4, medicines: ["Metformin", "Aspirin"] },
  { id: "IN-AP", name: "Andhra Pradesh", status: "good", availability: 88, anomalies: 2, medicines: ["Paracetamol"] },
  { id: "IN-TG", name: "Telangana", status: "good", availability: 82, anomalies: 3, medicines: ["Insulin", "Aspirin"] },
  { id: "IN-WB", name: "West Bengal", status: "warning", availability: 60, anomalies: 6, medicines: ["Paracetamol", "Metformin"] },
  { id: "IN-UP", name: "Uttar Pradesh", status: "critical", availability: 40, anomalies: 12, medicines: ["Insulin", "Paracetamol", "Amoxicillin", "Metformin"] },
  { id: "IN-BR", name: "Bihar", status: "warning", availability: 55, anomalies: 7, medicines: ["Paracetamol", "Aspirin"] },
  { id: "IN-MP", name: "Madhya Pradesh", status: "good", availability: 78, anomalies: 3, medicines: ["Paracetamol", "Metformin"] },
  { id: "IN-RJ", name: "Rajasthan", status: "warning", availability: 68, anomalies: 5, medicines: ["Insulin", "Aspirin"] },
  { id: "IN-OR", name: "Odisha", status: "good", availability: 85, anomalies: 2, medicines: ["Paracetamol"] },
  { id: "IN-KL", name: "Kerala", status: "good", availability: 92, anomalies: 1, medicines: ["Aspirin"] },
  { id: "IN-JH", name: "Jharkhand", status: "critical", availability: 35, anomalies: 10, medicines: ["Insulin", "Paracetamol", "Amoxicillin"] },
  { id: "IN-AS", name: "Assam", status: "warning", availability: 62, anomalies: 6, medicines: ["Paracetamol", "Metformin"] },
  { id: "IN-PB", name: "Punjab", status: "good", availability: 80, anomalies: 3, medicines: ["Aspirin", "Metformin"] },
  { id: "IN-HR", name: "Haryana", status: "good", availability: 75, anomalies: 4, medicines: ["Paracetamol", "Aspirin"] },
  { id: "IN-HP", name: "Himachal Pradesh", status: "good", availability: 88, anomalies: 2, medicines: ["Paracetamol"] },
  { id: "IN-UK", name: "Uttarakhand", status: "warning", availability: 65, anomalies: 5, medicines: ["Insulin", "Aspirin"] },
  { id: "IN-CT", name: "Chhattisgarh", status: "good", availability: 82, anomalies: 3, medicines: ["Paracetamol", "Metformin"] },
  { id: "IN-GA", name: "Goa", status: "good", availability: 90, anomalies: 1, medicines: ["Aspirin"] },
  { id: "IN-TR", name: "Tripura", status: "warning", availability: 58, anomalies: 7, medicines: ["Paracetamol", "Amoxicillin"] },
  { id: "IN-MN", name: "Manipur", status: "critical", availability: 42, anomalies: 9, medicines: ["Insulin", "Paracetamol"] },
  { id: "IN-ML", name: "Meghalaya", status: "warning", availability: 55, anomalies: 8, medicines: ["Paracetamol", "Metformin"] },
  { id: "IN-NL", name: "Nagaland", status: "critical", availability: 38, anomalies: 11, medicines: ["Insulin", "Paracetamol", "Amoxicillin"] },
  { id: "IN-AR", name: "Arunachal Pradesh", status: "warning", availability: 52, anomalies: 9, medicines: ["Paracetamol", "Aspirin"] },
  { id: "IN-MZ", name: "Mizoram", status: "warning", availability: 60, anomalies: 6, medicines: ["Paracetamol", "Metformin"] },
  { id: "IN-SK", name: "Sikkim", status: "good", availability: 85, anomalies: 2, medicines: ["Aspirin"] },
  { id: "IN-JK", name: "Jammu & Kashmir", status: "warning", availability: 65, anomalies: 5, medicines: ["Paracetamol", "Insulin"] },
  { id: "IN-LD", name: "Ladakh", status: "critical", availability: 30, anomalies: 15, medicines: ["Insulin", "Paracetamol", "Amoxicillin", "Metformin"] },
  { id: "IN-CH", name: "Chandigarh", status: "good", availability: 88, anomalies: 2, medicines: ["Paracetamol", "Aspirin"] },
  { id: "IN-DN", name: "Dadra & Nagar Haveli", status: "good", availability: 82, anomalies: 3, medicines: ["Paracetamol"] },
  { id: "IN-DD", name: "Daman & Diu", status: "good", availability: 85, anomalies: 2, medicines: ["Aspirin"] },
  { id: "IN-AN", name: "Andaman & Nicobar", status: "warning", availability: 58, anomalies: 7, medicines: ["Paracetamol", "Metformin"] },
  { id: "IN-LD", name: "Lakshadweep", status: "critical", availability: 25, anomalies: 18, medicines: ["Insulin", "Paracetamol", "Amoxicillin", "Metformin", "Aspirin"] },
]

export function IndiaMap() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null)
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'fill-green-400 hover:fill-green-300'
      case 'warning': return 'fill-yellow-400 hover:fill-yellow-300'
      case 'critical': return 'fill-red-400 hover:fill-red-300'
      default: return 'fill-gray-400 hover:fill-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <MapPin className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good': return 'Good Availability'
      case 'warning': return 'Low Stock'
      case 'critical': return 'Critical Shortage'
      default: return 'Unknown'
    }
  }

  const handleDistrictClick = (districtId: string) => {
    const district = districtData.find(d => d.id === districtId)
    setSelectedDistrict(district || null)
  }

  const summary = {
    good: districtData.filter(d => d.status === 'good').length,
    warning: districtData.filter(d => d.status === 'warning').length,
    critical: districtData.filter(d => d.status === 'critical').length,
  }

  return (
    <div className="space-y-4">
      {/* Interactive Map */}
      <div className="relative">
        <div className="h-64 glass-card rounded-lg flex items-center justify-center relative overflow-hidden">
          <svg
            viewBox="0 0 611.86 695.7"
            className="w-full h-full max-w-2xl"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
          >
            {/* Map background */}
            <rect width="100%" height="100%" fill="rgba(30, 41, 59, 0.1)" />
            
            {/* District paths - simplified for demo */}
            {districtData.map((district) => (
              <g key={district.id}>
                <path
                  id={district.id}
                  d={getDistrictPath(district.id)}
                  className={`${getStatusColor(district.status)} transition-all duration-200 cursor-pointer stroke-slate-800 stroke-1`}
                  onClick={() => handleDistrictClick(district.id)}
                  onMouseEnter={() => setHoveredDistrict(district.id)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                  style={{
                    filter: hoveredDistrict === district.id ? 'brightness(1.2)' : 'brightness(1)',
                    transform: hoveredDistrict === district.id ? 'scale(1.02)' : 'scale(1)',
                  }}
                />
                {hoveredDistrict === district.id && (
                  <text
                    x="50%"
                    y="50%"
                    className="text-xs font-medium fill-white pointer-events-none"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {district.name}
                  </text>
                )}
              </g>
            ))}
          </svg>
          
          {/* Map overlay info */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">Interactive District Map</span>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <span>Good availability</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                <span>Low stock</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span>Critical shortage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* District Summary */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="glass-card p-4">
          <div className="text-2xl font-bold text-green-400">{summary.good}</div>
          <p className="text-sm text-gray-400">Good Districts</p>
        </div>
        <div className="glass-card p-4">
          <div className="text-2xl font-bold text-yellow-400">{summary.warning}</div>
          <p className="text-sm text-gray-400">Warning Districts</p>
        </div>
        <div className="glass-card p-4">
          <div className="text-2xl font-bold text-red-400">{summary.critical}</div>
          <p className="text-sm text-gray-400">Critical Districts</p>
        </div>
      </div>

      {/* Selected District Details */}
      {selectedDistrict && (
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              {getStatusIcon(selectedDistrict.status)}
              <span className="ml-2">{selectedDistrict.name}</span>
              <Badge 
                variant={selectedDistrict.status === 'good' ? 'default' : selectedDistrict.status === 'warning' ? 'secondary' : 'destructive'}
                className="ml-auto glass-button border-0"
              >
                {getStatusText(selectedDistrict.status)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Availability</p>
                <p className="text-lg font-semibold text-white">{selectedDistrict.availability}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Anomalies</p>
                <p className="text-lg font-semibold text-white">{selectedDistrict.anomalies}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Affected Medicines</p>
              <div className="flex flex-wrap gap-2">
                {selectedDistrict.medicines.map((medicine, index) => (
                  <Badge key={index} variant="outline" className="glass-button border-0">
                    {medicine}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Simplified district paths - in a real implementation, you'd use the actual SVG paths
function getDistrictPath(districtId: string): string {
  // This is a simplified version - in reality, you'd use the actual SVG path data
  const paths: { [key: string]: string } = {
    "IN-MH": "M 124.757,365.773 L 200,400 L 180,450 L 100,420 Z",
    "IN-DL": "M 188.413,205.104 L 200,210 L 195,220 L 185,215 Z",
    "IN-KA": "M 124.338,505.460 L 150,520 L 140,550 L 120,530 Z",
    "IN-TN": "M 139.851,568.071 L 160,580 L 150,600 L 130,590 Z",
    "IN-GJ": "M 30.172,354.324 L 80,360 L 70,400 L 20,390 Z",
    "IN-AP": "M 295.438,482.237 L 320,490 L 310,520 L 285,510 Z",
    "IN-TG": "M 295.438,482.237 L 320,490 L 310,520 L 285,510 Z",
    "IN-WB": "M 416.975,260.261 L 450,270 L 440,300 L 410,290 Z",
    "IN-UP": "M 416.975,260.261 L 450,270 L 440,300 L 410,290 Z",
    "IN-BR": "M 416.975,260.261 L 450,270 L 440,300 L 410,290 Z",
    "IN-MP": "M 209.826,253.295 L 250,260 L 240,290 L 200,280 Z",
    "IN-RJ": "M 179.683,155.737 L 220,160 L 210,190 L 170,185 Z",
    "IN-OR": "M 316.874,316.840 L 350,320 L 340,350 L 310,345 Z",
    "IN-KL": "M 139.851,568.071 L 160,580 L 150,600 L 130,590 Z",
    "IN-JH": "M 320.53,307.043 L 360,310 L 350,340 L 310,335 Z",
    "IN-AS": "M 453.917,283.495 L 490,290 L 480,320 L 445,315 Z",
    "IN-PB": "M 179.683,155.737 L 220,160 L 210,190 L 170,185 Z",
    "IN-HR": "M 179.683,155.737 L 220,160 L 210,190 L 170,185 Z",
    "IN-HP": "M 160.899,114.525 L 200,120 L 190,150 L 150,145 Z",
    "IN-UK": "M 160.899,114.525 L 200,120 L 190,150 L 150,145 Z",
    "IN-CT": "M 316.874,316.840 L 350,320 L 340,350 L 310,345 Z",
    "IN-GA": "M 115.005,503.847 L 130,510 L 125,530 L 110,525 Z",
    "IN-TR": "M 453.917,283.495 L 490,290 L 480,320 L 445,315 Z",
    "IN-MN": "M 529.358,288.951 L 560,295 L 550,325 L 520,320 Z",
    "IN-ML": "M 453.917,283.495 L 490,290 L 480,320 L 445,315 Z",
    "IN-NL": "M 529.358,288.951 L 560,295 L 550,325 L 520,320 Z",
    "IN-AR": "M 585.539,192.704 L 620,200 L 610,230 L 575,225 Z",
    "IN-MZ": "M 529.358,288.951 L 560,295 L 550,325 L 520,320 Z",
    "IN-SK": "M 585.539,192.704 L 620,200 L 610,230 L 575,225 Z",
    "IN-JK": "M 139.801,1.203 L 180,10 L 170,40 L 130,35 Z",
    "IN-LD": "M 139.801,1.203 L 180,10 L 170,40 L 130,35 Z",
    "IN-CH": "M 180.729,161.125 L 190,165 L 185,175 L 175,170 Z",
    "IN-DN": "M 105.295,406.932 L 115,410 L 110,420 L 100,415 Z",
    "IN-DD": "M 52.071,392.578 L 60,395 L 55,405 L 45,400 Z",
    "IN-AN": "M 537.188,685.441 L 550,690 L 545,700 L 530,695 Z",
  }
  
  return paths[districtId] || "M 0,0 L 10,0 L 10,10 L 0,10 Z"
} 