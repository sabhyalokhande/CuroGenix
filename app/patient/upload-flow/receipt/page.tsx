"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Upload, ArrowLeft, Check, X, Edit, ReceiptText, Award, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function ReceiptUploadFlow() {
  const [step, setStep] = useState("capture") // capture, processing, review, success
  const [receiptData, setReceiptData] = useState({
    pharmacyName: "City Pharmacy",
    totalAmount: "₹250",
    items: [
      { name: "Paracetamol 500mg", price: "₹50", usualPrice: "₹45" },
      { name: "Cough Syrup", price: "₹120", usualPrice: "₹100" },
      { name: "Band-Aid (10 pcs)", price: "₹80", usualPrice: "₹80" },
    ],
  })
  const [pointsEarned, setPointsEarned] = useState(0)
  const [showAlert, setShowAlert] = useState(false)

  const handleCapture = () => {
    setStep("processing")
    // Simulate OCR and price comparison
    setTimeout(() => {
      const newPoints = receiptData.items.reduce((acc, item) => {
        const itemPrice = Number.parseFloat(item.price.replace("₹", ""))
        const itemUsualPrice = Number.parseFloat(item.usualPrice.replace("₹", ""))
        if (itemPrice > itemUsualPrice) {
          setShowAlert(true)
          return acc + 20 // Award points for overpriced items
        }
        return acc + 5 // Award base points for any item
      }, 0)
      setPointsEarned(newPoints)
      setStep("review")
    }, 3000)
  }

  const handleConfirm = () => {
    setStep("success")
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
            <h1 className="font-semibold text-gray-900">Upload Receipt</h1>
            <p className="text-sm text-gray-600">Scan or upload your bill</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {step === "capture" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="text-white text-center">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm opacity-75">Position your receipt clearly</p>
                  </div>
                  <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg"></div>
                  <div className="absolute top-6 left-6 w-6 h-6 border-l-4 border-t-4 border-purple-400"></div>
                  <div className="absolute top-6 right-6 w-6 h-6 border-r-4 border-t-4 border-purple-400"></div>
                  <div className="absolute bottom-6 left-6 w-6 h-6 border-l-4 border-b-4 border-purple-400"></div>
                  <div className="absolute bottom-6 right-6 w-6 h-6 border-r-4 border-b-4 border-purple-400"></div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button onClick={handleCapture} className="w-full bg-purple-600 hover:bg-purple-700 h-12">
                <Camera className="mr-2 h-5 w-5" />
                Capture Photo
              </Button>
              <Button variant="outline" className="w-full h-12 bg-transparent">
                <Upload className="mr-2 h-5 w-5" />
                Upload from Gallery
              </Button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="text-center space-y-6 py-12">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <ReceiptText className="h-10 w-10 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Analyzing Receipt...</h2>
            <p className="text-gray-600">Comparing prices and calculating rewards.</p>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-6">
            {showAlert && (
              <Card className="border-0 shadow-sm bg-orange-50">
                <CardContent className="p-4 flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                  <div>
                    <h3 className="font-medium text-orange-900">Price Alert!</h3>
                    <p className="text-sm text-orange-800">Some items cost more than usual. An alert has been sent.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Edit className="mr-2 h-5 w-5" />
                  Extracted Bill Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pharmacyName">Pharmacy Name</Label>
                  <Input
                    id="pharmacyName"
                    value={receiptData.pharmacyName}
                    onChange={(e) => setReceiptData({ ...receiptData, pharmacyName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="totalAmount">Total Amount</Label>
                  <Input
                    id="totalAmount"
                    value={receiptData.totalAmount}
                    onChange={(e) => setReceiptData({ ...receiptData, totalAmount: e.target.value })}
                  />
                </div>
                <h3 className="font-medium text-gray-900 mt-4">Items:</h3>
                {receiptData.items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-white">
                    <Label htmlFor={`item-name-${index}`}>Item Name</Label>
                    <Input
                      id={`item-name-${index}`}
                      value={item.name}
                      onChange={(e) => {
                        const newItems = [...receiptData.items]
                        newItems[index].name = e.target.value
                        setReceiptData({ ...receiptData, items: newItems })
                      }}
                      className="mb-2"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor={`item-price-${index}`}>Your Price</Label>
                        <Input
                          id={`item-price-${index}`}
                          value={item.price}
                          onChange={(e) => {
                            const newItems = [...receiptData.items]
                            newItems[index].price = e.target.value
                            setReceiptData({ ...receiptData, items: newItems })
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`item-usual-price-${index}`}>Expected Price</Label>
                        <Input
                          id={`item-usual-price-${index}`}
                          value={item.usualPrice}
                          onChange={(e) => {
                            const newItems = [...receiptData.items]
                            newItems[index].usualPrice = e.target.value
                            setReceiptData({ ...receiptData, items: newItems })
                          }}
                          disabled
                          className="bg-gray-100"
                        />
                      </div>
                    </div>
                    {Number.parseFloat(item.price.replace("₹", "")) >
                      Number.parseFloat(item.usualPrice.replace("₹", "")) && (
                      <p className="text-sm text-red-600 mt-2">
                        Difference: ₹
                        {Number.parseFloat(item.price.replace("₹", "")) -
                          Number.parseFloat(item.usualPrice.replace("₹", ""))}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button onClick={handleConfirm} className="w-full bg-green-600 hover:bg-green-700 h-12">
              Confirm & Submit
            </Button>
            <Button variant="outline" className="w-full h-12 bg-transparent" onClick={() => setStep("capture")}>
              <X className="mr-2 h-5 w-5" />
              Retake Photo
            </Button>
          </div>
        )}

        {step === "success" && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-600" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Receipt Uploaded!</h2>
              <p className="text-gray-600">Your receipt has been processed.</p>
            </div>

            <Card className="border-0 shadow-sm bg-green-50">
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-900">+{pointsEarned} Reward Points Earned!</p>
                <p className="text-sm text-green-700">Thank you for contributing to the community</p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Link href="/patient/dashboard">
                <Button className="w-full bg-green-600 hover:bg-green-700">Back to Dashboard</Button>
              </Link>
              <Link href="/patient/rewards">
                <Button variant="outline" className="w-full bg-transparent">
                  View My Rewards
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
