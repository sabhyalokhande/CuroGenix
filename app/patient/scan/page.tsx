"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Upload, ArrowLeft, Check, X, Edit, Award, FileText } from "lucide-react"
import Link from "next/link"

export default function MobileScan() {
  const [scanStep, setScanStep] = useState("capture") // capture, review, confirm, success
  const [scannedData, setScannedData] = useState({
    medicine: "Paracetamol 500mg",
    price: "₹45",
    pharmacy: "Apollo Pharmacy",
    date: "2024-01-15",
  })

  const handleScan = () => {
    // Simulate scanning
    setTimeout(() => {
      setScanStep("review")
    }, 2000)
  }

  const handleConfirm = () => {
    setScanStep("success")
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
            <h1 className="font-semibold text-gray-900">Scan Prescription</h1>
            <p className="text-sm text-gray-600">Upload receipt or prescription</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {scanStep === "capture" && (
          <div className="space-y-6">
            {/* Camera View */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="text-white text-center">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm opacity-75">Position your prescription or receipt</p>
                  </div>

                  {/* Scan Frame */}
                  <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg"></div>

                  {/* Corner guides */}
                  <div className="absolute top-6 left-6 w-6 h-6 border-l-4 border-t-4 border-green-400"></div>
                  <div className="absolute top-6 right-6 w-6 h-6 border-r-4 border-t-4 border-green-400"></div>
                  <div className="absolute bottom-6 left-6 w-6 h-6 border-l-4 border-b-4 border-green-400"></div>
                  <div className="absolute bottom-6 right-6 w-6 h-6 border-r-4 border-b-4 border-green-400"></div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={handleScan} className="w-full bg-green-600 hover:bg-green-700 h-12">
                <Camera className="mr-2 h-5 w-5" />
                Capture Photo
              </Button>

              <Button variant="outline" className="w-full h-12 bg-transparent">
                <Upload className="mr-2 h-5 w-5" />
                Upload from Gallery
              </Button>
            </div>

            {/* Tips */}
            <Card className="border-0 shadow-sm bg-blue-50">
              <CardContent className="p-4">
                <h3 className="font-medium text-blue-900 mb-2">Tips for better scanning:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Ensure good lighting</li>
                  <li>• Keep the document flat</li>
                  <li>• Include all text clearly</li>
                  <li>• Avoid shadows and glare</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {scanStep === "review" && (
          <div className="space-y-6">
            {/* Scanned Image Preview */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <X className="h-4 w-4 mr-1" />
                    Retake
                  </Button>
                  <Button size="sm">
                    <Check className="h-4 w-4 mr-1" />
                    Use This
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Extracted Information */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Edit className="mr-2 h-5 w-5" />
                  Extracted Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="medicine">Medicine Name</Label>
                  <Input
                    id="medicine"
                    value={scannedData.medicine}
                    onChange={(e) => setScannedData({ ...scannedData, medicine: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={scannedData.price}
                    onChange={(e) => setScannedData({ ...scannedData, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="pharmacy">Pharmacy Name</Label>
                  <Input
                    id="pharmacy"
                    value={scannedData.pharmacy}
                    onChange={(e) => setScannedData({ ...scannedData, pharmacy: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={scannedData.date}
                    onChange={(e) => setScannedData({ ...scannedData, date: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleConfirm} className="w-full bg-green-600 hover:bg-green-700 h-12">
              Confirm & Submit
            </Button>
          </div>
        )}

        {scanStep === "success" && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-600" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Successful!</h2>
              <p className="text-gray-600">Your prescription has been processed and added to the database.</p>
            </div>

            <Card className="border-0 shadow-sm bg-green-50">
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-900">+50 Reward Points Earned!</p>
                <p className="text-sm text-green-700">Thank you for contributing to the community</p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Link href="/patient/dashboard">
                <Button className="w-full bg-green-600 hover:bg-green-700">Back to Dashboard</Button>
              </Link>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setScanStep("capture")}>
                Scan Another
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
