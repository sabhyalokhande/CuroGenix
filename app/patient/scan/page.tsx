"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Upload, ArrowLeft, Check, X, Edit, Award, FileText, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function MobileScan() {
  const [scanStep, setScanStep] = useState("capture") // capture, review, processing, results, success
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [scanResults, setScanResults] = useState<any>(null)
  const [fraudResults, setFraudResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userLocation, setUserLocation] = useState("")
  const [reportedPharmacy, setReportedPharmacy] = useState("")
  const [showPharmacyInput, setShowPharmacyInput] = useState(false)
  const [nearbyPharmacies, setNearbyPharmacies] = useState<any[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Start camera when component mounts
  useEffect(() => {
    startCamera()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Debug logging for medicine information
  useEffect(() => {
    if (scanResults && fraudResults) {
      console.log('Displaying medicine info:', { 
        scanResults, 
        fraudResults, 
        isNotFound: fraudResults.allocatedLocation === 'Not found in database',
        genericName: fraudResults.allocatedLocation === 'Not found in database' ? scanResults.medicineName : fraudResults.medicineDetails?.genericName,
        manufacturer: fraudResults.allocatedLocation === 'Not found in database' ? scanResults.manufacturer : fraudResults.medicineDetails?.manufacturer,
        batchNumber: scanResults.batchNumber
      })
    }
  }, [scanResults, fraudResults])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Unable to access camera. Please check permissions.")
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)
        
        const imageDataUrl = canvas.toDataURL('image/jpeg')
        setCapturedImage(imageDataUrl)
        setScanStep("review")
      }
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    setScanResults(null)
    setError("")
    setScanStep("capture")
  }

  const processImage = async () => {
    if (!capturedImage) return
    
    setLoading(true)
    setError("")
    setScanStep("processing")
    
    try {
      const response = await fetch('/api/medicine-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageDataUrl: capturedImage }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setScanResults(result.data)
        
        // If batch number is found, proceed to fraud detection
        if (result.data.batchNumber) {
          setScanStep("location-input")
        } else {
          setScanStep("results")
        }
      } else {
        setError(result.error || "Failed to process image")
        setScanStep("review")
      }
    } catch (err) {
      setError("Network error. Please try again.")
      setScanStep("review")
    } finally {
      setLoading(false)
    }
  }

  const checkFraud = async () => {
    if (!userLocation || !scanResults?.batchNumber) return
    
    setLoading(true)
    setError("")
    
    const requestData = {
      batchNumber: scanResults.batchNumber,
      medicineName: scanResults.medicineName,
      manufacturer: scanResults.manufacturer,
      userLocation,
      imageData: capturedImage,
      reportedPharmacy
    }
    
    console.log('Sending to fraud detection API:', requestData)
    
    try {
      const response = await fetch('/api/fraud-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
      
      const result = await response.json()
      
      console.log('Fraud detection API response:', result)
      
      if (result.success) {
        setFraudResults(result.data)
        setScanStep("fraud-results")
      } else {
        setError(result.error || "Failed to check fraud")
        setScanStep("results")
      }
    } catch (err) {
      setError("Network error. Please try again.")
      setScanStep("results")
    } finally {
      setLoading(false)
    }
  }

  const fetchNearbyPharmacies = async (location: string) => {
    try {
      const response = await fetch(`/api/fraud-detection?location=${encodeURIComponent(location)}`)
      const result = await response.json()
      
      if (result.success) {
        setNearbyPharmacies(result.data)
      }
    } catch (err) {
      console.error("Failed to fetch pharmacies:", err)
    }
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
                  {error ? (
                    <div className="text-white text-center p-4">
                      <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-400" />
                      <p className="text-sm opacity-75">{error}</p>
                      <Button onClick={startCamera} className="mt-4" variant="outline">
                        Retry Camera
                      </Button>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Scan Frame */}
                      <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg"></div>

                      {/* Corner guides */}
                      <div className="absolute top-6 left-6 w-6 h-6 border-l-4 border-t-4 border-green-400"></div>
                      <div className="absolute top-6 right-6 w-6 h-6 border-r-4 border-t-4 border-green-400"></div>
                      <div className="absolute bottom-6 left-6 w-6 h-6 border-l-4 border-b-4 border-green-400"></div>
                      <div className="absolute bottom-6 right-6 w-6 h-6 border-r-4 border-b-4 border-green-400"></div>
                    </>
                  )}
                </div>
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={captureImage} 
                disabled={!!error}
                className="w-full bg-green-600 hover:bg-green-700 h-12"
              >
                <Camera className="mr-2 h-5 w-5" />
                Capture Medicine Photo
              </Button>

              <Button variant="outline" className="w-full h-12 bg-transparent">
                <Upload className="mr-2 h-5 w-5" />
                Upload from Gallery
              </Button>
            </div>

            {/* Tips */}
            <Card className="border-0 shadow-sm bg-blue-50">
              <CardContent className="p-4">
                <h3 className="font-medium text-blue-900 mb-2">Tips for better medicine scanning:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Focus on the medicine packaging</li>
                  <li>• Ensure batch number is clearly visible</li>
                  <li>• Good lighting helps with text recognition</li>
                  <li>• Keep the camera steady</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {scanStep === "review" && (
          <div className="space-y-6">
            {/* Captured Image Preview */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                {capturedImage && (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                    <img 
                      src={capturedImage} 
                      alt="Captured medicine" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center justify-center space-x-4">
                  <Button variant="outline" size="sm" className="bg-transparent" onClick={retakePhoto}>
                    <X className="h-4 w-4 mr-1" />
                    Retake
                  </Button>
                  <Button size="sm" onClick={processImage}>
                    <Check className="h-4 w-4 mr-1" />
                    Process Image
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="border-0 shadow-sm bg-blue-50">
              <CardContent className="p-4">
                <h3 className="font-medium text-blue-900 mb-2">Processing Medicine Image</h3>
                <p className="text-sm text-blue-800">
                  We'll extract the batch number and other details from your medicine image using AI.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {scanStep === "processing" && (
          <div className="space-y-6">
            <div className="text-center space-y-4 py-8">
              <Loader2 className="h-16 w-16 mx-auto animate-spin text-green-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Medicine Image</h2>
                <p className="text-gray-600">Extracting batch number and medicine details...</p>
              </div>
            </div>
          </div>
        )}

        {scanStep === "location-input" && scanResults && (
          <div className="space-y-6">
            {/* Location Input */}
            <Card className="border-0 shadow-sm bg-blue-50">
              <CardContent className="p-4">
                <h3 className="font-medium text-blue-900 mb-2">Location Verification</h3>
                <p className="text-sm text-blue-800 mb-4">
                  Batch number found: <strong>{scanResults.batchNumber}</strong>
                </p>
                <p className="text-sm text-blue-800">
                  Please provide your location to check if this medicine is being sold in the correct area.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Where are you located?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="location">Your Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Mumbai, Maharashtra"
                    value={userLocation}
                    onChange={(e) => {
                      setUserLocation(e.target.value)
                      if (e.target.value.length > 3) {
                        fetchNearbyPharmacies(e.target.value)
                      }
                    }}
                  />
                </div>

                {nearbyPharmacies.length > 0 && (
                  <div>
                    <Label htmlFor="pharmacy">Where did you buy this medicine?</Label>
                    <Select onValueChange={(value: string) => {
                      if (value === "custom") {
                        setShowPharmacyInput(true)
                        setReportedPharmacy("")
                      } else {
                        setReportedPharmacy(value)
                        setShowPharmacyInput(false)
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pharmacy from list" />
                      </SelectTrigger>
                      <SelectContent>
                        {nearbyPharmacies.map((pharmacy, index) => (
                          <SelectItem key={index} value={pharmacy.name}>
                            {pharmacy.name} - {pharmacy.address}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">Other (Type manually)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {showPharmacyInput && (
                  <div>
                    <Label htmlFor="customPharmacy">Pharmacy Name</Label>
                    <Input
                      id="customPharmacy"
                      placeholder="Enter pharmacy name and address"
                      value={reportedPharmacy}
                      onChange={(e) => setReportedPharmacy(e.target.value)}
                    />
                  </div>
                )}

                {!nearbyPharmacies.length && userLocation && (
                  <div>
                    <Label htmlFor="pharmacy">Where did you buy this medicine?</Label>
                    <Input
                      id="pharmacy"
                      placeholder="Enter pharmacy name and address"
                      value={reportedPharmacy}
                      onChange={(e) => setReportedPharmacy(e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button 
                onClick={checkFraud}
                disabled={!userLocation || !reportedPharmacy}
                className="w-full bg-green-600 hover:bg-green-700 h-12"
              >
                Check for Anomalies
              </Button>
              <Button 
                variant="outline" 
                className="w-full bg-transparent" 
                onClick={() => setScanStep("results")}
              >
                Skip Fraud Check
              </Button>
            </div>
          </div>
        )}

        {scanStep === "fraud-results" && fraudResults && (
          <div className="space-y-6">
            {/* Fraud Results Header */}
            <Card className={`border-0 shadow-sm ${fraudResults.isFraud ? 'bg-red-50' : fraudResults.allocatedLocation === 'Not found in database' ? 'bg-yellow-50' : 'bg-green-50'}`}>
              <CardContent className="p-4 text-center">
                {fraudResults.isFraud ? (
                  <>
                    <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <h2 className="text-lg font-bold text-red-900">⚠️ ANOMALY DETECTED!</h2>
                    <p className="text-sm text-red-700">{fraudResults.message}</p>
                    <div className="mt-3 p-3 bg-red-100 rounded-lg">
                      <p className="text-sm text-red-800 font-medium">This medicine was allocated to:</p>
                      <p className="text-sm text-red-800">{fraudResults.allocatedLocation}</p>
                      <p className="text-sm text-red-800 font-medium mt-2">But found in:</p>
                      <p className="text-sm text-red-800">{userLocation}</p>
                    </div>
                  </>
                ) : fraudResults.allocatedLocation === 'Not found in database' ? (
                  <>
                    <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <h2 className="text-lg font-bold text-yellow-900">⚠️ BATCH NUMBER NOT FOUND</h2>
                    <p className="text-sm text-yellow-700">{fraudResults.message}</p>
                    <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
                      <p className="text-sm text-yellow-800 font-medium">Batch Number: {scanResults.batchNumber}</p>
                      <p className="text-sm text-yellow-800">This batch number is not registered in our official database.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h2 className="text-lg font-bold text-green-900">✅ Location Verified</h2>
                    <p className="text-sm text-green-700">{fraudResults.message}</p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Medicine Details */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Medicine Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Batch Number (BNO)</Label>
                  <Input value={scanResults.batchNumber || "Not found"} readOnly className="font-mono" />
                </div>
                <div>
                  <Label>Generic Name</Label>
                  <Input value={fraudResults.allocatedLocation === 'Not found in database' ? scanResults.medicineName : fraudResults.medicineDetails?.genericName || "Not found"} readOnly />
                </div>
                <div>
                  <Label>Brand Name</Label>
                  <Input value={fraudResults.medicineDetails?.brandName || "Not found"} readOnly />
                </div>
                <div>
                  <Label>Manufacturer</Label>
                  <Input value={fraudResults.allocatedLocation === 'Not found in database' ? scanResults.manufacturer : fraudResults.medicineDetails?.manufacturer || "Not found"} readOnly />
                </div>
                <div>
                  <Label>Allocated Location</Label>
                  <Input value={fraudResults.allocatedLocation || "Not found"} readOnly />
                </div>
                <div>
                  <Label>Manufacturing Date</Label>
                  <Input value={fraudResults.medicineDetails?.manufacturingDate || "Not found"} readOnly />
                </div>
                <div>
                  <Label>Expiry Date</Label>
                  <Input value={fraudResults.allocatedLocation === 'Not found in database' ? scanResults.expiryDate : fraudResults.medicineDetails?.expiryDate || "Not found"} readOnly />
                </div>
              </CardContent>
            </Card>

            {fraudResults.isFraud && (
              <Card className="border-0 shadow-sm bg-orange-50">
                <CardContent className="p-4">
                  <h3 className="font-medium text-orange-900 mb-2">🚨 FRAUD REPORT SUBMITTED</h3>
                  <p className="text-sm text-orange-800 mb-3">
                    This location anomaly has been automatically reported to the authorities. 
                    Thank you for helping maintain medicine supply chain integrity.
                  </p>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <p className="text-sm text-orange-900 font-medium">Report Details:</p>
                    <p className="text-sm text-orange-900">• Batch Number: {fraudResults.batchNumber}</p>
                    <p className="text-sm text-orange-900">• Medicine: {fraudResults.medicineName}</p>
                    <p className="text-sm text-orange-900">• Reported Pharmacy: {reportedPharmacy}</p>
                    <p className="text-sm text-orange-900">• Timestamp: {new Date().toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              <Button 
                onClick={() => setScanStep("success")} 
                className="w-full bg-green-600 hover:bg-green-700 h-12"
              >
                Complete
              </Button>
              <Button 
                variant="outline" 
                className="w-full bg-transparent" 
                onClick={retakePhoto}
              >
                Scan Another Medicine
              </Button>
            </div>
          </div>
        )}

        {scanStep === "results" && scanResults && (
          <div className="space-y-6">
            {/* Results Header */}
            <Card className="border-0 shadow-sm bg-green-50">
              <CardContent className="p-4 text-center">
                <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h2 className="text-lg font-bold text-green-900">Medicine Analysis Complete</h2>
                <p className="text-sm text-green-700">Here's what we found in your medicine image</p>
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
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Confidence Level:</span>
                  <Badge 
                    variant={scanResults.confidence === "high" ? "default" : scanResults.confidence === "medium" ? "secondary" : "destructive"}
                  >
                    {scanResults.confidence}
                  </Badge>
                </div>
                
                <div>
                  <Label htmlFor="batchNumber">Batch Number (BNO)</Label>
                  <Input
                    id="batchNumber"
                    value={scanResults.batchNumber || "Not found"}
                    readOnly
                    className={!scanResults.batchNumber ? "text-gray-500" : ""}
                  />
                </div>
                
                <div>
                  <Label htmlFor="medicineName">Medicine Name</Label>
                  <Input
                    id="medicineName"
                    value={scanResults.medicineName || "Not found"}
                    readOnly
                    className={!scanResults.medicineName ? "text-gray-500" : ""}
                  />
                </div>
                
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={scanResults.manufacturer || "Not found"}
                    readOnly
                    className={!scanResults.manufacturer ? "text-gray-500" : ""}
                  />
                </div>
                
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    value={scanResults.expiryDate || "Not found"}
                    readOnly
                    className={!scanResults.expiryDate ? "text-gray-500" : ""}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button 
                onClick={() => setScanStep("success")} 
                className="w-full bg-green-600 hover:bg-green-700 h-12"
              >
                Save Results
              </Button>
              <Button 
                variant="outline" 
                className="w-full bg-transparent" 
                onClick={retakePhoto}
              >
                Scan Another Medicine
              </Button>
            </div>
          </div>
        )}

        {scanStep === "success" && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-600" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Medicine Scan Complete!</h2>
              <p className="text-gray-600">Your medicine information has been successfully extracted and saved.</p>
            </div>

            <Card className="border-0 shadow-sm bg-green-50">
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-900">+25 Reward Points Earned!</p>
                <p className="text-sm text-green-700">Thank you for contributing to medicine verification</p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Link href="/patient/dashboard">
                <Button className="w-full bg-green-600 hover:bg-green-700">Back to Dashboard</Button>
              </Link>
              <Button variant="outline" className="w-full bg-transparent" onClick={retakePhoto}>
                Scan Another Medicine
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
