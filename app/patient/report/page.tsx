"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, AlertTriangle, Camera, Upload, MapPin, Check } from "lucide-react"
import Link from "next/link"

export default function ReportPage() {
  const [step, setStep] = useState("form") // form, success
  const [reportData, setReportData] = useState({
    type: "price",
    pharmacyName: "",
    medicineName: "",
    reportedPrice: "",
    expectedPrice: "",
    location: "",
    description: "",
  })

  const reportTypes = [
    { id: "price", label: "Price Issue", description: "Report overpricing or incorrect prices" },
    { id: "availability", label: "Stock Issue", description: "Medicine not available when listed as in stock" },
    { id: "quality", label: "Quality Issue", description: "Expired or damaged medicines" },
    { id: "service", label: "Service Issue", description: "Poor customer service or other issues" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setTimeout(() => {
      setStep("success")
    }, 1000)
  }

  return (
    <div className="min-h-screen liquid-glass-bg text-white w-full max-w-md mx-auto px-4">
      {/* SVG Filter for Liquid Distortion */}
      <svg style={{ display: "none" }}>
        <filter id="liquidGlass">
          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="turb" />
          <feDisplacementMap in2="turb" in="SourceGraphic" scale="15" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Header */}
      <div className="glass-nav border-b border-white/10 sticky top-0 z-10">
        <div className="flex items-center p-4">
          <Link href="/patient/dashboard">
            <Button variant="ghost" size="sm" className="mr-2 p-2 glass-button border-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold text-white">Report Issue</h1>
            <p className="text-sm text-gray-400">Help improve medicine accessibility</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Report Type Selection */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-orange-400" />
                  What type of issue are you reporting?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reportTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      reportData.type === type.id ? "glass-card border border-blue-400" : "glass-card hover:bg-white/10"
                    }`}
                    onClick={() => setReportData({ ...reportData, type: type.id })}
                  >
                    <h3 className="font-medium text-white">{type.label}</h3>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Report Details */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-white">Report Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pharmacyName" className="text-white">
                    Pharmacy Name *
                  </Label>
                  <Input
                    id="pharmacyName"
                    value={reportData.pharmacyName}
                    onChange={(e) => setReportData({ ...reportData, pharmacyName: e.target.value })}
                    placeholder="Enter pharmacy name"
                    className="glass-input border-0"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="medicineName" className="text-white">
                    Medicine Name *
                  </Label>
                  <Input
                    id="medicineName"
                    value={reportData.medicineName}
                    onChange={(e) => setReportData({ ...reportData, medicineName: e.target.value })}
                    placeholder="Enter medicine name"
                    className="glass-input border-0"
                    required
                  />
                </div>

                {reportData.type === "price" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="reportedPrice" className="text-white">
                          Reported Price *
                        </Label>
                        <Input
                          id="reportedPrice"
                          value={reportData.reportedPrice}
                          onChange={(e) => setReportData({ ...reportData, reportedPrice: e.target.value })}
                          placeholder="₹0"
                          className="glass-input border-0"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="expectedPrice" className="text-white">
                          Expected Price
                        </Label>
                        <Input
                          id="expectedPrice"
                          value={reportData.expectedPrice}
                          onChange={(e) => setReportData({ ...reportData, expectedPrice: e.target.value })}
                          placeholder="₹0"
                          className="glass-input border-0"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="location" className="text-white">
                    Location
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="location"
                      value={reportData.location}
                      onChange={(e) => setReportData({ ...reportData, location: e.target.value })}
                      placeholder="Enter location or address"
                      className="flex-1 glass-input border-0"
                    />
                    <Button type="button" className="glass-button border-0">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={reportData.description}
                    onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                    placeholder="Provide additional details about the issue..."
                    className="glass-input border-0 min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Photo Evidence */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-white">Photo Evidence (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" className="h-20 flex flex-col space-y-2 glass-button border-0">
                    <Camera className="h-6 w-6 text-blue-400" />
                    <span className="text-sm">Take Photo</span>
                  </Button>
                  <Button type="button" className="h-20 flex flex-col space-y-2 glass-button border-0">
                    <Upload className="h-6 w-6 text-purple-400" />
                    <span className="text-sm">Upload Photo</span>
                  </Button>
                </div>
                <p className="text-xs text-gray-400 text-center">Photos help us verify and resolve issues faster</p>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button type="submit" className="w-full h-12 glass-button border-0">
              Submit Report
            </Button>
          </form>
        )}

        {step === "success" && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-2">Report Submitted!</h2>
              <p className="text-gray-400">Thank you for helping improve our community.</p>
            </div>

            <Card className="glass-card border-0 bg-green-500/10">
              <CardContent className="p-4 text-center">
                <p className="font-medium text-green-400">+20 Reward Points Earned!</p>
                <p className="text-sm text-green-300">Your report helps keep prices fair for everyone</p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Link href="/patient/dashboard">
                <Button className="w-full glass-button border-0">Back to Dashboard</Button>
              </Link>
              <Button
                variant="outline"
                className="w-full glass-button border-0 bg-transparent"
                onClick={() => {
                  setStep("form")
                  setReportData({
                    type: "price",
                    pharmacyName: "",
                    medicineName: "",
                    reportedPrice: "",
                    expectedPrice: "",
                    location: "",
                    description: "",
                  })
                }}
              >
                Report Another Issue
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20"></div>
    </div>
  )
}
