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
            <h1 className="font-semibold text-white">Upload Receipt</h1>
            <p className="text-sm text-gray-400">Scan or upload your bill</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {step === "capture" && (
          <div className="space-y-6">
            <Card className="glass-card border-0">
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
              <Button onClick={handleCapture} className="w-full h-12 glass-button border-0">
                <Camera className="mr-2 h-5 w-5" />
                Capture Photo
              </Button>
              <Button className="w-full h-12 glass-button border-0">
                <Upload className="mr-2 h-5 w-5" />
                Upload from Gallery
              </Button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="text-center space-y-6 py-12">
            <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto animate-pulse">
              <ReceiptText className="h-10 w-10 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Analyzing Receipt...</h2>
            <p className="text-gray-400">Comparing prices and calculating rewards.</p>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-6">
            {showAlert && (
              <Card className="glass-card border-0 bg-orange-500/10">
                <CardContent className="p-4 flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-orange-400" />
                  <div>
                    <h3 className="font-medium text-orange-400">Price Alert!</h3>
                    <p className="text-sm text-orange-300">Some items cost more than usual. An alert has been sent.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-white">
                  <Edit className="mr-2 h-5 w-5 text-purple-400" />
                  Extracted Bill Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pharmacyName" className="text-white">
                    Pharmacy Name
                  </Label>
                  <Input
                    id="pharmacyName"
                    value={receiptData.pharmacyName}
                    onChange={(e) => setReceiptData({ ...receiptData, pharmacyName: e.target.value })}
                    className="glass-input border-0"
                  />
                </div>
                <div>
                  <Label htmlFor="totalAmount" className="text-white">
                    Total Amount
                  </Label>
                  <Input
                    id="totalAmount"
                    value={receiptData.totalAmount}
                    onChange={(e) => setReceiptData({ ...receiptData, totalAmount: e.target.value })}
                    className="glass-input border-0"
                  />
                </div>
                <h3 className="font-medium text-white mt-4">Items:</h3>
                {receiptData.items.map((item, index) => (
                  <div key={index} className="glass-card rounded-lg p-3">
                    <Label htmlFor={`item-name-${index}`} className="text-white">
                      Item Name
                    </Label>
                    <Input
                      id={`item-name-${index}`}
                      value={item.name}
                      onChange={(e) => {
                        const newItems = [...receiptData.items]
                        newItems[index].name = e.target.value
                        setReceiptData({ ...receiptData, items: newItems })
                      }}
                      className="mb-2 glass-input border-0"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor={`item-price-${index}`} className="text-white">
                          Your Price
                        </Label>
                        <Input
                          id={`item-price-${index}`}
                          value={item.price}
                          onChange={(e) => {
                            const newItems = [...receiptData.items]
                            newItems[index].price = e.target.value
                            setReceiptData({ ...receiptData, items: newItems })
                          }}
                          className="glass-input border-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`item-usual-price-${index}`} className="text-white">
                          Expected Price
                        </Label>
                        <Input
                          id={`item-usual-price-${index}`}
                          value={item.usualPrice}
                          onChange={(e) => {
                            const newItems = [...receiptData.items]
                            newItems[index].usualPrice = e.target.value
                            setReceiptData({ ...receiptData, items: newItems })
                          }}
                          disabled
                          className="glass-input border-0 opacity-60"
                        />
                      </div>
                    </div>
                    {Number.parseFloat(item.price.replace("₹", "")) >
                      Number.parseFloat(item.usualPrice.replace("₹", "")) && (
                      <p className="text-sm text-red-400 mt-2">
                        Difference: ₹
                        {Number.parseFloat(item.price.replace("₹", "")) -
                          Number.parseFloat(item.usualPrice.replace("₹", ""))}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button onClick={handleConfirm} className="w-full h-12 glass-button border-0">
              Confirm & Submit
            </Button>
            <Button className="w-full h-12 glass-button border-0" onClick={() => setStep("capture")}>
              <X className="mr-2 h-5 w-5" />
              Retake Photo
            </Button>
          </div>
        )}

        {step === "success" && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-2">Receipt Uploaded!</h2>
              <p className="text-gray-400">Your receipt has been processed.</p>
            </div>

            <Card className="glass-card border-0 bg-green-500/10">
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="font-medium text-green-400">+{pointsEarned} Reward Points Earned!</p>
                <p className="text-sm text-green-300">Thank you for contributing to the community</p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Link href="/patient/dashboard">
                <Button className="w-full glass-button border-0">Back to Dashboard</Button>
              </Link>
              <Link href="/patient/rewards">
                <Button className="w-full glass-button border-0">View My Rewards</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
