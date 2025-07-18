"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, ChevronDown, ChevronUp, MapPin } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface Medicine {
  id: string
  name: string
  dosage: string
  quantity: number
  estimatedPrice: number
  availability: number
  maxAvailability: number
}

interface PrescriptionUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrescriptionUploadModal({ isOpen, onClose }: PrescriptionUploadModalProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [detectedMedicines, setDetectedMedicines] = useState<Medicine[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const mockMedicines: Medicine[] = [
    {
      id: "1",
      name: "Paracetamol",
      dosage: "500mg",
      quantity: 30,
      estimatedPrice: 45.5,
      availability: 4,
      maxAvailability: 4,
    },
    {
      id: "2",
      name: "Amoxicillin",
      dosage: "250mg",
      quantity: 21,
      estimatedPrice: 120.75,
      availability: 2,
      maxAvailability: 4,
    },
    {
      id: "3",
      name: "Ibuprofen",
      dosage: "400mg",
      quantity: 20,
      estimatedPrice: 65.25,
      availability: 3,
      maxAvailability: 4,
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
      setDetectedMedicines(mockMedicines)
      setIsProcessing(false)
    }, 2000)
  }

  const toggleCardExpansion = (medicineId: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(medicineId)) {
      newExpanded.delete(medicineId)
    } else {
      newExpanded.add(medicineId)
    }
    setExpandedCards(newExpanded)
  }

  const getAvailabilityColor = (availability: number, max: number) => {
    const ratio = availability / max
    if (ratio >= 0.75) return "bg-green-500"
    if (ratio >= 0.5) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Prescription</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!uploadedImage ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                      <Upload className="w-4 h-4" />
                      <span>Upload Image</span>
                    </Button>
                  </label>
                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                    <Camera className="w-4 h-4" />
                    <span>Take Photo</span>
                  </Button>
                </div>
                <p className="text-gray-500">
                  Upload a clear image of your prescription for automatic medicine detection
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded prescription"
                  className="w-full max-h-64 object-contain rounded-lg border"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-transparent"
                  onClick={() => {
                    setUploadedImage(null)
                    setDetectedMedicines([])
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
                  <p className="text-gray-600">Processing prescription...</p>
                </div>
              ) : detectedMedicines.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Detected Medicines</h3>
                  <div className="grid gap-4">
                    {detectedMedicines.map((medicine) => (
                      <motion.div
                        key={medicine.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card>
                          <Collapsible>
                            <CollapsibleTrigger className="w-full" onClick={() => toggleCardExpansion(medicine.id)}>
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div>
                                      <CardTitle className="text-left">{medicine.name}</CardTitle>
                                      <p className="text-sm text-gray-600 text-left">
                                        {medicine.dosage} • Qty: {medicine.quantity}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <Badge variant="outline" className="flex items-center space-x-1">
                                      <div
                                        className={`w-2 h-2 rounded-full ${getAvailabilityColor(
                                          medicine.availability,
                                          medicine.maxAvailability,
                                        )}`}
                                      />
                                      <span>
                                        {medicine.availability}/{medicine.maxAvailability}
                                      </span>
                                    </Badge>
                                    <span className="font-semibold">₹{medicine.estimatedPrice}</span>
                                    {expandedCards.has(medicine.id) ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )}
                                  </div>
                                </div>
                              </CardHeader>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <CardContent className="pt-0">
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Estimated Price Range:</span>
                                    <span className="font-medium">
                                      ₹{medicine.estimatedPrice - 10} - ₹{medicine.estimatedPrice + 15}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Availability:</span>
                                    <span className="font-medium">{medicine.availability} nearby pharmacies</span>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full flex items-center space-x-2 bg-transparent"
                                  >
                                    <MapPin className="w-4 h-4" />
                                    <span>Find Nearby Pharmacies</span>
                                  </Button>
                                </div>
                              </CardContent>
                            </CollapsibleContent>
                          </Collapsible>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex space-x-3">
                    <Button className="flex-1">Find All Medicines</Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Save Prescription
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
