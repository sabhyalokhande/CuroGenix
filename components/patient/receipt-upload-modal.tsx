"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, TrendingUp, TrendingDown, Award } from "lucide-react"

interface ReceiptItem {
  id: string
  name: string
  paidPrice: number
  marketPrice: number
  savings: number
}

interface ReceiptUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReceiptUploadModal({ isOpen, onClose }: ReceiptUploadModalProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)

  const mockReceiptItems: ReceiptItem[] = [
    {
      id: "1",
      name: "Paracetamol 500mg",
      paidPrice: 45.5,
      marketPrice: 52.0,
      savings: 6.5,
    },
    {
      id: "2",
      name: "Amoxicillin 250mg",
      paidPrice: 135.75,
      marketPrice: 120.75,
      savings: -15.0,
    },
    {
      id: "3",
      name: "Ibuprofen 400mg",
      paidPrice: 65.25,
      marketPrice: 68.5,
      savings: 3.25,
    },
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        simulateProcessing()
      }
      reader.readAsDataURL(file)
    }
  }

  const simulateProcessing = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setReceiptItems(mockReceiptItems)
      setEarnedPoints(25)
      setIsProcessing(false)
    }, 2000)
  }

  const totalSavings = receiptItems.reduce((sum, item) => sum + item.savings, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Receipt</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {earnedPoints > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-lg text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="flex items-center justify-center space-x-2"
              >
                <Award className="w-6 h-6" />
                <span className="text-xl font-bold">+{earnedPoints} Points Earned!</span>
              </motion.div>
            </motion.div>
          )}

          {!uploadedImage ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                      <Upload className="w-4 h-4" />
                      <span>Upload Receipt</span>
                    </Button>
                  </label>
                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                    <Camera className="w-4 h-4" />
                    <span>Take Photo</span>
                  </Button>
                </div>
                <p className="text-gray-500">Upload your medicine receipt to compare prices and earn points</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded receipt"
                  className="w-full max-h-64 object-contain rounded-lg border"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-transparent"
                  onClick={() => {
                    setUploadedImage(null)
                    setReceiptItems([])
                    setEarnedPoints(0)
                  }}
                >
                  Change Image
                </Button>
              </div>

              {isProcessing ? (
                <div className="text-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="text-gray-600">Analyzing receipt...</p>
                </div>
              ) : receiptItems.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Price Comparison</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Total Savings:</span>
                      <Badge variant={totalSavings >= 0 ? "default" : "destructive"}>
                        {totalSavings >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        ₹{Math.abs(totalSavings).toFixed(2)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {receiptItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{item.name}</h4>
                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                  <span>Paid: ₹{item.paidPrice}</span>
                                  <span>Market: ₹{item.marketPrice}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant={item.savings >= 0 ? "default" : "destructive"}>
                                  {item.savings >= 0 ? (
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                  ) : (
                                    <TrendingDown className="w-3 h-3 mr-1" />
                                  )}
                                  {item.savings >= 0 ? "+" : ""}₹{item.savings.toFixed(2)}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <Button className="flex-1">Save Analysis</Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Share Report
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
