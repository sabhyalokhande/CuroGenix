"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, AlertTriangle, CheckCircle, Upload, Camera } from "lucide-react"
import Link from "next/link"

export default function PatientReport() {
  const [reportSubmitted, setReportSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate submission
    setTimeout(() => {
      setIsLoading(false)
      setReportSubmitted(true)
    }, 2000)
  }

  if (reportSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-sm mx-auto flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Report Submitted Successfully!</h2>
        <p className="text-gray-600 mb-6">Thank you for helping us monitor medicine availability and pricing.</p>
        <Link href="/patient/dashboard">
          <Button className="w-full bg-green-600 hover:bg-green-700">Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center p-4">
          <Link href="/patient/dashboard">
            <Button variant="ghost" size="sm" className="mr-2 p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold text-gray-900">Report a Problem</h1>
            <p className="text-sm text-gray-600">Help us detect anomalies</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-orange-600" />
              Report Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="reason">Reason for Report</Label>
                <Select name="reason" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-available">Medicine Not Available</SelectItem>
                    <SelectItem value="overpriced">Medicine Overpriced</SelectItem>
                    <SelectItem value="pharmacy-closed">Pharmacy Closed Unexpectedly</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="medicineName">Medicine Name (Optional)</Label>
                <Input id="medicineName" placeholder="e.g., Paracetamol 500mg" />
              </div>

              <div>
                <Label htmlFor="pharmacyName">Pharmacy Name (Optional)</Label>
                <Input id="pharmacyName" placeholder="e.g., Apollo Pharmacy" />
              </div>

              <div>
                <Label htmlFor="comment">Additional Comments</Label>
                <Textarea id="comment" placeholder="Describe the issue in detail..." rows={4} />
              </div>

              <div>
                <Label htmlFor="screenshot">Upload Screenshot (Optional)</Label>
                <div className="flex space-x-2 mt-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Camera className="mr-2 h-4 w-4" />
                    Take Photo
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20"></div>
    </div>
  )
}
