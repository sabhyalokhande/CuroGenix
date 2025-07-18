"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, Camera, ChevronDown, MapPin, Sparkles, Zap, CheckCircle } from "lucide-react"
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

export function EnhancedPrescriptionModal({ isOpen, onClose }: PrescriptionUploadModalProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [detectedMedicines, setDetectedMedicines] = useState<Medicine[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
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
    setProcessingProgress(0)

    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setDetectedMedicines(mockMedicines)
          setIsProcessing(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
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
    if (ratio >= 0.75) return "from-green-500 to-emerald-600"
    if (ratio >= 0.5) return "from-yellow-500 to-orange-500"
    return "from-red-500 to-pink-600"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50/50">
        <DialogHeader className="border-b border-gray-100 pb-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center space-x-2">
            <Zap className="w-6 h-6 text-blue-600" />
            <span>AI Prescription Scanner</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 p-2">
          {!uploadedImage ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
              <div className="border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="absolute top-4 right-4 w-8 h-8 border-2 border-blue-400 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="absolute bottom-4 left-4 w-6 h-6 border-2 border-purple-400 rounded-full"
                  />
                </div>

                <div className="space-y-6 relative z-10">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl"
                  >
                    <Upload className="w-12 h-12 text-white" />
                  </motion.div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload Your Prescription</h3>
                    <p className="text-gray-600 mb-6">
                      Our AI will automatically detect medicines and find the best prices for you
                    </p>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <label className="cursor-pointer group">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      </motion.div>
                    </label>

                    <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        className="border-2 border-blue-300 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 bg-transparent"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Take Photo
                      </Button>
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Sparkles className="w-4 h-4" />
                    <span>Supports JPG, PNG, PDF formats</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Image Preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded prescription"
                    className="w-full max-h-80 object-contain bg-white"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                    onClick={() => {
                      setUploadedImage(null)
                      setDetectedMedicines([])
                      setProcessingProgress(0)
                    }}
                  >
                    Change Image
                  </Button>
                </div>
              </motion.div>

              {/* Processing State */}
              {isProcessing && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                  <div className="max-w-md mx-auto space-y-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-xl"
                    >
                      <Zap className="w-8 h-8 text-white" />
                    </motion.div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Processing Your Prescription</h3>
                      <p className="text-gray-600 mb-4">Detecting medicines and analyzing content...</p>

                      <div className="space-y-2">
                        <Progress value={processingProgress} className="h-2" />
                        <p className="text-sm text-gray-500">{processingProgress}% Complete</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Results */}
              {detectedMedicines.length > 0 && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <h3 className="text-xl font-bold text-gray-800">Detected Medicines</h3>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {detectedMedicines.length} found
                      </Badge>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    {detectedMedicines.map((medicine, index) => (
                      <motion.div
                        key={medicine.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="card-hover"
                      >
                        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
                          <Collapsible>
                            <CollapsibleTrigger className="w-full" onClick={() => toggleCardExpansion(medicine.id)}>
                              <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div
                                      className={`w-12 h-12 bg-gradient-to-r ${getAvailabilityColor(medicine.availability, medicine.maxAvailability)} rounded-xl flex items-center justify-center shadow-lg`}
                                    >
                                      <span className="text-white font-bold text-sm">
                                        {medicine.availability}/{medicine.maxAvailability}
                                      </span>
                                    </div>
                                    <div className="text-left">
                                      <CardTitle className="text-lg">{medicine.name}</CardTitle>
                                      <p className="text-sm text-gray-600">
                                        {medicine.dosage} • Qty: {medicine.quantity}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                      <p className="text-2xl font-bold text-gray-900">₹{medicine.estimatedPrice}</p>
                                      <p className="text-sm text-gray-500">Est. price</p>
                                    </div>
                                    <motion.div
                                      animate={{ rotate: expandedCards.has(medicine.id) ? 180 : 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </motion.div>
                                  </div>
                                </div>
                              </CardHeader>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <CardContent className="pt-0 pb-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                                    <p className="text-sm text-gray-600 mb-1">Price Range</p>
                                    <p className="font-semibold text-blue-600">
                                      ₹{medicine.estimatedPrice - 10} - ₹{medicine.estimatedPrice + 15}
                                    </p>
                                  </div>
                                  <div className="text-center p-4 bg-green-50 rounded-xl">
                                    <p className="text-sm text-gray-600 mb-1">Availability</p>
                                    <p className="font-semibold text-green-600">{medicine.availability} pharmacies</p>
                                  </div>
                                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                                    <p className="text-sm text-gray-600 mb-1">Stock Status</p>
                                    <p className="font-semibold text-purple-600">In Stock</p>
                                  </div>
                                </div>
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  Find Nearby Pharmacies
                                </Button>
                              </CardContent>
                            </CollapsibleContent>
                          </Collapsible>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300">
                      Find All Medicines
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-2 border-blue-300 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 bg-transparent"
                    >
                      Save Prescription
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
