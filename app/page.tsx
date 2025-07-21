"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CuroGenixLogo } from "@/components/ui/curogenix-logo"
import {
  Heart,
  Shield,
  AlertTriangle,
  ChevronRight,
  CalendarDays,
  LocateFixed,
  Pill,
  Activity,
  FlaskConical,
  BellRing,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link" // Import Link for navigation buttons

type ShortageLevels = 'high' | 'medium' | 'low' | 'normal';
type StateShortageData = { [state: string]: ShortageLevels };
type ShortageData = { [drug: string]: StateShortageData };

export default function HomePage() {
  // State to manage selected drug for map visualization
  const [selectedDrug, setSelectedDrug] = useState("Amoxicillin")
  // State to hold the fetched SVG content
  const [svgContent, setSvgContent] = useState<string | null>(null)

  // Mock data for drug shortages across Indian states
  const shortageData: ShortageData = {
    Amoxicillin: {
      Maharashtra: "high",
      Delhi: "medium",
      Karnataka: "low",
      "Uttar Pradesh": "high",
      "Tamil Nadu": "normal", // Example of normal stock
      Gujarat: "normal",
      Punjab: "low",
      "Andhra Pradesh": "high",
      Telangana: "normal",
      "Madhya Pradesh": "medium",
      "West Bengal": "high",
      Kerala: "normal",
      Bihar: "high",
      Chhattisgarh: "low",
      "Himachal Pradesh": "normal",
      Jharkhand: "medium",
      Manipur: "high",
      Meghalaya: "normal",
      Mizoram: "low",
      Nagaland: "high",
      Odisha: "normal",
      Puducherry: "low",
      Rajasthan: "high",
      Sikkim: "normal",
      Tripura: "medium",
      Uttarakhand: "high",
      Goa: "normal",
      Haryana: "low",
      "Jammu and Kashmir": "high",
      Lakshadweep: "normal",
      "Daman and Diu": "low",
      "Dadra and Nagar Haveli": "normal",
      "Andaman and Nicobar Islands": "low",
    },
    Insulin: {
      Gujarat: "high",
      Rajasthan: "medium",
      Kerala: "low",
      "West Bengal": "high",
      Maharashtra: "normal",
      Delhi: "normal",
      Karnataka: "high",
      "Uttar Pradesh": "low",
      "Tamil Nadu": "medium",
      "Andhra Pradesh": "normal",
      Telangana: "high",
      "Madhya Pradesh": "low",
      Bihar: "normal",
      Chhattisgarh: "high",
      "Himachal Pradesh": "medium",
      Jharkhand: "low",
      Manipur: "normal",
      Meghalaya: "high",
      Mizoram: "medium",
      Nagaland: "normal",
      Odisha: "low",
      Puducherry: "high",
      Sikkim: "medium",
      Tripura: "normal",
      Uttarakhand: "low",
      Goa: "high",
      Haryana: "normal",
      "Jammu and Kashmir": "low",
      Lakshadweep: "high",
      "Daman and Diu": "medium",
      "Dadra and Nagar Haveli": "low",
      "Andaman and Nicobar Islands": "normal",
    },
    Paracetamol: {
      "Andhra Pradesh": "low",
      Telangana: "low",
      "Madhya Pradesh": "medium",
      Delhi: "normal",
      Karnataka: "normal",
      Maharashtra: "high",
      Gujarat: "medium",
      Punjab: "high",
      "Uttar Pradesh": "normal",
      "Tamil Nadu": "low",
      Kerala: "high",
      "West Bengal": "medium",
      Bihar: "low",
      Chhattisgarh: "normal",
      "Himachal Pradesh": "high",
      Jharkhand: "normal",
      Manipur: "low",
      Meghalaya: "medium",
      Mizoram: "high",
      Nagaland: "low",
      Odisha: "medium",
      Puducherry: "normal",
      Rajasthan: "low",
      Sikkim: "high",
      Tripura: "medium",
      Uttarakhand: "normal",
      Goa: "low",
      Haryana: "high",
      "Jammu and Kashmir": "normal",
      Lakshadweep: "medium",
      "Daman and Diu": "high",
      "Dadra and Nagar Haveli": "normal",
      "Andaman and Nicobar Islands": "high",
    },
  }

  // Function to get color based on shortage level
  const getShortageColor = (stateName: string) => {
    return "#000000" // All states default to black
  }

  // Effect to fetch SVG content once on component mount
  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch("/india.svg")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const text = await response.text()
        setSvgContent(text)
      } catch (error) {
        console.error("Failed to fetch SVG:", error)
        setSvgContent(null) // Set to null on error
      }
    }
    fetchSvg()
  }, []) // Empty dependency array means this runs once on mount

  // Effect to apply colors to SVG paths whenever svgContent or selectedDrug changes
  useEffect(() => {
    if (svgContent) {
      const svgContainer = document.querySelector(".india-map-svg-container")
      if (svgContainer) {
        const svgElement = svgContainer.querySelector("svg")
        if (svgElement) {
          const getHoverHighlightColor = (level: string) => {
            switch (level) {
              case "high":
                return "#ef4444" // Tailwind red-500
              case "medium":
              case "low":
              case "normal":
                return "#22c55e" // Tailwind green-500
              default:
                return "#007bff" // Default blue if level is unknown
            }
          }

          const paths = svgElement.querySelectorAll("path")
          paths.forEach((path) => {
            const stateName = path.getAttribute("title")
            // Set default fill to black
            path.setAttribute("fill", "#000000")
            path.style.transition = "fill 0.3s ease, filter 0.3s ease" // Ensure smooth transition

            // Remove any previous event listeners to prevent duplicates
            path.onmouseover = null
            path.onmouseout = null

            if (stateName) {
              const drugShortageLevel = shortageData[selectedDrug]?.[stateName]

              path.onmouseover = () => {
                const hoverColor = getHoverHighlightColor(drugShortageLevel)
                path.style.fill = hoverColor
                path.style.filter = `drop-shadow(0 0 8px ${hoverColor})`
              }

              path.onmouseout = () => {
                path.style.fill = "#000000" // Reset to black
                path.style.filter = "none" // Remove glow
              }
            }
          })
        }
      }
    }
  }, [svgContent, selectedDrug]) // Re-run when SVG content or selected drug changes

  return (
    // Main container with dark background and subtle gradient/glow effects
    <div className="min-h-screen bg-black text-white font-inter antialiased overflow-hidden relative">
      {/* Background glowing elements (mimicking the image's subtle light sources) */}
      {/* Adjusted opacity and size for a more prominent blue gradient effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500 opacity-15 rounded-full filter blur-3xl animate-pulse-slow z-0"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500 opacity-10 rounded-full filter blur-3xl animate-pulse-slow-reverse z-0"></div>

      {/* Custom styles for animations and specific fonts */}
      <style>
        {`
         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
         @import url('https://fonts.googleapis.com/css2?family=Lobster+Two:ital,wght@0,400;0,700;1,400;1,700&display=swap');
         @import url('https://fonts.googleapis.com/css2?family=Freestyle+Script&display=swap'); /* Keeping this in case user wants it later */

         .font-lobster-two {
           font-family: 'Lobster Two', cursive;
         }
         .font-freestyle-script {
           font-family: 'Freestyle Script', cursive;
         }

         @keyframes pulse-slow {
           0%, 100% { transform: scale(1) translate(-50%, -50%); opacity: 0.15; }
           50% { transform: scale(1.1) translate(-50%, -50%); opacity: 0.2; }
         }
         @keyframes pulse-slow-reverse {
           0%, 100% { transform: scale(1); opacity: 0.1; }
           50% { transform: scale(1.1); opacity: 0.15; }
         }
         .animate-pulse-slow {
           animation: pulse-slow 15s infinite ease-in-out;
         }
         .animate-pulse-slow-reverse {
           animation: pulse-slow-reverse 18s infinite ease-in-out;
         }

         /* Glass effect button styling */
         .glass-button {
           background-color: rgba(255, 255, 255, 0.08); /* Subtle white transparency */
           backdrop-filter: blur(15px); /* Stronger blur for glass effect */
           border: 1px solid rgba(255, 255, 255, 0.2); /* Defined border */
           box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2); /* Soft shadow */
           color: white; /* Ensure text is white */
           transition: all 0.3s ease;
         }
         .glass-button:hover {
           background-color: rgba(255, 255, 255, 0.15); /* More opaque on hover */
           border-color: rgba(255, 255, 255, 0.4);
           box-shadow: 0 4px 40px rgba(0, 0, 0, 0.3);
         }

         /* Dark card styling */
         .dark-card {
           background-color: #1a1a1a;
           border: 1px solid rgba(255, 255, 255, 0.1);
           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
         }

         /* Map specific styles */
         .india-map-svg-container svg {
           width: 100%;
           height: 100%;
           display: flex;
           max-width: 100%;
           max-height: 100%;
           object-fit: contain;
           transform: scale(0.9);
           transform-origin: center;
         }
        .india-map-svg-container svg path {
          fill: #000000; /* Black fill for states */
          stroke: #007bff; /* Blue stroke for distinct outlines */
          stroke-width: 1px; /* Make stroke more visible */
          transition: fill 0.3s ease, filter 0.3s ease; /* Smooth transition for fill and filter */
        }
        .india-map-svg-container svg path:hover {
          cursor: pointer;
        }
       `}
      </style>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-8 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CuroGenixLogo size="lg" />
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" className="glass-button text-lg px-4 py-2">
              Home
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" className="glass-button text-lg px-4 py-2">
              About
            </Button>
          </Link>
          <Link href="/technology">
            <Button variant="ghost" className="glass-button text-lg px-4 py-2">
              Technology
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="ghost" className="glass-button text-lg px-4 py-2">
              Services
            </Button>
          </Link>
          <Link href="/book-a-call">
            <Button className="glass-button px-6 py-3 rounded-full font-semibold">Book a call</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-8 py-12 text-center">
        <p className="text-lg text-blue-400 font-medium mb-4">World's Most Adopted Healthcare AI</p>
        <h1 className="text-7xl md:text-8xl font-extrabold text-white mb-12 leading-tight">
          Revolutionizing <br /> Healthcare with AI
        </h1>

        {/* Login Options with Glass Effect Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
          <Link href="/patient/login" className="flex-1 max-w-xs">
            <Button size="lg" className="w-full h-16 text-xl font-semibold rounded-2xl glass-button">
              <LocateFixed className="mr-3 h-7 w-7" />
              Login as Patient
            </Button>
          </Link>
          <Link href="/pharmacy/login" className="flex-1 max-w-xs">
            <Button size="lg" className="w-full h-16 text-xl font-semibold rounded-2xl glass-button">
              <CalendarDays className="mr-3 h-7 w-7" />
              Login as Pharmacy
            </Button>
          </Link>
          <Link href="/government/login" className="flex-1 max-w-xs">
            <Button size="lg" className="w-full h-16 text-xl font-semibold rounded-2xl glass-button">
              <Shield className="mr-3 h-7 w-7" />
              Login as Government
            </Button>
          </Link>
        </div>
      </section>

      {/* Medicine Shortage Elimination Portal with Map */}
      <section className="relative z-10 container mx-auto px-8 py-16">
        <div className="dark-card p-8 rounded-3xl shadow-lg w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-12">
          {/* Left Column: Map and Controls */}
          <div className="flex flex-col lg:col-span-1">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Medicine Shortage Map (India)</h2>
            <div className="mb-6 w-full max-w-md">
              <label htmlFor="drug-select" className="block text-gray-400 text-sm font-medium mb-2">
                Select Drug:
              </label>
              <select
                id="drug-select"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                value={selectedDrug}
                onChange={(e) => setSelectedDrug(e.target.value)}
              >
                {Object.keys(shortageData).map((drug) => (
                  <option key={drug} value={drug}>
                    {drug}
                  </option>
                ))}
              </select>
            </div>
            {/* India Map SVG */}
            <div className="flex-1 bg-black rounded-xl overflow-hidden flex items-center justify-center p-4 min-h-[400px] max-h-[700px]" style={{ minWidth: '350px' }}>
              {svgContent ? (
                <div
                  className="india-map-svg-container w-full h-full flex items-center justify-center"
                  style={{ width: '100%', height: '100%' }}
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              ) : (
                <div className="text-gray-500">Loading map...</div>
              )}
            </div>
            {/* Map Legend */}
            <div className="flex justify-center space-x-6 mt-6 text-sm">
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-black mr-2 border border-gray-700"></span>
                <span>Default State</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-red-500 mr-2"></span>
                <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                <span>Hover Highlight (Red/Green)</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400">Hover over states for details</span>
              </div>
            </div>
          </div>

          {/* Right Column: Shortage List / Data Display */}
          <div className="flex flex-col lg:col-span-1 min-w-[240px] max-w-[340px]">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Shortage Details</h2>

            {/* Shortage List */}
            <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(shortageData[selectedDrug] || {})
                .slice(0, 7) // Limit to top 7 states
                .map(([state, level]) => (
                  <div key={state} className="flex items-center justify-between dark-card p-4 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle
                        className={`h-6 w-6 ${level === "high" ? "text-red-400" : level === "normal" ? "text-green-400" : "text-gray-400"}`}
                      />
                      <div>
                        <p className="text-lg font-medium text-white">
                          {selectedDrug} ({state})
                        </p>
                        <p className="text-xs text-gray-400">
                          Shortage level: {(level as string).charAt(0).toUpperCase() + (level as string).slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm ${level === "high" ? "text-red-400" : level === "normal" ? "text-green-400" : "text-gray-400"}`}
                      >
                        {(level as string).toUpperCase()} IMPACT
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                ))}

              {/* Static examples for other types of alerts */}
              <div className="flex items-center justify-between dark-card p-4 rounded-xl">
                <div className="flex items-center space-x-3">
                  <FlaskConical className="h-6 w-6 text-green-400" />
                  <div>
                    <p className="text-lg font-medium text-white">Paracetamol (500mg)</p>
                    <p className="text-xs text-gray-400">Availability improved in Bangalore</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400 text-sm">RESOLVED</span>
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              <div className="flex items-center justify-between dark-card p-4 rounded-xl">
                <div className="flex items-center space-x-3">
                  <BellRing className="h-6 w-6 text-blue-400" />
                  <div>
                    <p className="text-lg font-medium text-white">COVID-19 Vaccine (Booster)</p>
                    <p className="text-xs text-gray-400">New stock alert in Chennai</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400 text-sm">NEW ALERT</span>
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Diagnosis Overview & Medication Section (Placeholder to match screenshot) */}
      <section className="relative z-10 container mx-auto px-8 py-16">
        <div className="dark-card p-8 rounded-3xl shadow-lg w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Health Diagnosis Overview */}
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Health Diagnosis Overview</h2>
            <Card className="dark-card flex-grow">
              <CardHeader>
                <CardTitle className="text-white">Summary</CardTitle>
                <CardDescription className="text-gray-400">Quick insights into your health.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
                  <div className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-red-400" />
                    <span className="text-lg font-medium text-white">120 bpm</span>
                  </div>
                  <span className="text-sm text-gray-400">Heartbeat Monitor</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
                  <div className="flex items-center gap-2">
                    <Activity className="h-6 w-6 text-blue-400" />
                    <span className="text-lg font-medium text-white">Normal Blood Pressure</span>
                  </div>
                  <span className="text-sm text-gray-400">Last Checked: Today</span>
                </div>
                {/* Added 3 more placeholder items for symmetry */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-6 w-6 text-purple-400" />
                    <span className="text-lg font-medium text-white">Blood Sugar: 90 mg/dL</span>
                  </div>
                  <span className="text-sm text-gray-400">Fasting</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
                  <div className="flex items-center gap-2">
                    <Pill className="h-6 w-6 text-yellow-400" />
                    <span className="text-lg font-medium text-white">Cholesterol: 180 mg/dL</span>
                  </div>
                  <span className="text-sm text-gray-400">Healthy Range</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
                  <div className="flex items-center gap-2">
                    <BellRing className="h-6 w-6 text-green-400" />
                    <span className="text-lg font-medium text-white">Sleep: 7.5 hours</span>
                  </div>
                  <span className="text-sm text-gray-400">Last Night</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Medication List */}
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Medication</h2>
            <div className="flex space-x-4 mb-6 justify-center">
              <Button className="glass-button px-5 py-2">Overview</Button>
              <Button variant="ghost" className="glass-button px-5 py-2">
                Analytics
              </Button>
              <Button variant="ghost" className="glass-button px-5 py-2">
                Patients
              </Button>
            </div>
            <Card className="dark-card flex-grow">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Mon 20</span>
                  <span className="text-gray-400">Tue 21</span>
                  <span className="text-gray-400">Wed 22</span>
                  <span className="text-gray-400">Thu 23</span>
                  <span className="text-gray-400">Fri 24</span>
                  <span className="text-gray-400">Sat 25</span>
                  <span className="text-gray-400">Sun 26</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800">
                    <div className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-purple-400" />
                      <span className="text-white">
                        Albumin <span className="text-gray-400 text-sm">20mg</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">💊 1</span>
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800">
                    <div className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-yellow-400" />
                      <span className="text-white">
                        Vitamin D <span className="text-gray-400 text-sm">100mg</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">💊 2</span>
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800">
                    <div className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-green-400" />
                      <span className="text-white">
                        Omega 3 <span className="text-gray-400 text-sm">Design by Fluttertop</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">💊 2</span>
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800">
                    <div className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-orange-400" />
                      <span className="text-white">
                        Ibuprofen <span className="text-gray-400 text-sm">75mg</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">💊 2</span>
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800">
                    <div className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-red-400" />
                      <span className="text-white">
                        Aspirin <span className="text-gray-400 text-sm">Fluttertop</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">💊 2</span>
                      <span className="text-green-400">💊 1</span>
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
