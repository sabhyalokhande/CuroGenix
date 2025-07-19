"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Upload, ArrowLeft, Check, X, Edit, ReceiptText, Award, AlertTriangle, Flag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ReceiptUploadFlow() {
  const [step, setStep] = useState("capture") // capture, processing, review, success
  const [receiptData, setReceiptData] = useState<any>(null)
  const [pointsEarned, setPointsEarned] = useState(0)
  const [showAlert, setShowAlert] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const router = useRouter()
  const [patientId, setPatientId] = useState<string>("")
  const [cameraAvailable, setCameraAvailable] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pharmacyLocation, setPharmacyLocation] = useState<string>("")
  const [locationRequired, setLocationRequired] = useState(false)

  // Fetch patientId from backend using JWT
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token")
      if (!token) return
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const user = await res.json()
          setPatientId(user._id)
        }
      } catch {}
    }
    fetchUser()
  }, [])

  // Camera logic
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play().catch(() => {})
      }
      streamRef.current = stream
      setCameraAvailable(true)
    } catch (err) {
      setCameraAvailable(false)
      setError("Could not access camera. You can upload a photo instead.")
      stopCamera()
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  useEffect(() => {
    if (step === "capture") {
      startCamera()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [step])

  // Fallback: handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const imageDataUrl = ev.target?.result as string
      setImagePreview(imageDataUrl)
      setStep("processing")
      // Call Gemini OCR API
      try {
        const res = await fetch("/api/gemini-ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageDataUrl })
        })
        if (!res.ok) throw new Error("Gemini API failed: " + res.status)
        const text = await res.text()
        let data
        try { data = JSON.parse(text) } catch { throw new Error("Invalid JSON from Gemini API") }
        if (!data.success) throw new Error(data.error || "Gemini OCR failed")
        let alert = false
        let points = 0
        Array.isArray(data.data) && data.data.forEach((item: any) => {
          const price = parseFloat((item.price || item.estPrice || "0").replace(/[^\d.]/g, ""))
          const estPrice = parseFloat((item.estPrice || item.price || "0").replace(/[^\d.]/g, ""))
          if (price > estPrice) {
            alert = true
            points += 20
          } else {
            points += 5
          }
        })
        setShowAlert(alert)
        setPointsEarned(points)
        // Use extracted pharmacyName and location if present
        const extractedPharmacyName = data.pharmacyName || ""
        const extractedLocation = data.location || ""
        setPharmacyLocation(extractedLocation)
        setLocationRequired(!extractedLocation)
        setReceiptData({
          pharmacyName: extractedPharmacyName,
          totalAmount: "",
          items: data.data || []
        })
      setStep("review")
      } catch (err: any) {
        setError(err.message || "Failed to analyze receipt")
        setStep("capture")
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle capture from video
  const handleCapture = async () => {
    console.log("Capture clicked", videoRef.current, canvasRef.current);
    if (!videoRef.current || !canvasRef.current) {
      setError("Camera not ready. Please wait a moment and try again.");
      return;
    }
    // Check if video is ready
    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      setError("Camera is still loading. Please wait a moment and try again.");
      return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/jpeg");
      setImagePreview(imageDataUrl);
      setStep("processing");
      // Call Gemini OCR API
      try {
        const res = await fetch("/api/gemini-ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageDataUrl })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Gemini OCR failed");
        let alert = false;
        let points = 0;
        Array.isArray(data.data) && data.data.forEach((item: any) => {
          const price = parseFloat((item.price || item.estPrice || "0").replace(/[^\d.]/g, ""));
          const estPrice = parseFloat((item.estPrice || item.price || "0").replace(/[^\d.]/g, ""));
          if (price > estPrice) {
            alert = true;
            points += 20;
          } else {
            points += 5;
          }
        });
        setShowAlert(alert);
        setPointsEarned(points);
        // Use extracted pharmacyName and location if present
        const extractedPharmacyName = data.pharmacyName || "";
        const extractedLocation = data.location || "";
        setPharmacyLocation(extractedLocation);
        setLocationRequired(!extractedLocation);
        setReceiptData({
          pharmacyName: extractedPharmacyName,
          totalAmount: "",
          items: data.data || []
        });
        setStep("review");
      } catch (err: any) {
        setError(err.message || "Failed to analyze receipt");
        setStep("capture");
      }
    } else {
      setError("Could not access camera context. Try refreshing the page.");
    }
  }

  // Add this function to handle reward posting
  const postReward = async (points: number, patientId: string) => {
    if (!patientId || !points) return;
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/rewards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId,
          points,
          description: "Receipt upload reward"
        })
      });
    } catch (err) {
      // Optionally handle error
    }
  };

  // Update handleConfirm to store receipt and post reward
  const handleConfirm = async () => {
    if (!pharmacyLocation || pharmacyLocation.trim() === "") {
      setLocationRequired(true)
      setError("Pharmacy location is required.")
      return
    }
    setStep("success")
    try {
      const res = await fetch("/api/receipts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          patientId,
          imageUrl: imagePreview,
          pharmacyName: receiptData.pharmacyName,
          totalAmount: receiptData.totalAmount,
          items: receiptData.items,
          pharmacyLocation: pharmacyLocation,
          uploadedAt: new Date().toISOString()
        })
      })

      if (!res.ok) throw new Error("Failed to save receipt")
      const data = await res.json()
      
      // Store receipt ID for reports
      setReceiptData((prev: any) => ({ ...prev, _id: data.receiptId }))

      // Post reward
      await postReward(pointsEarned, patientId)

    } catch (error) {
      console.error("Save error:", error)
      setError("Failed to save receipt")
    }
  }

  const handleReport = async (item: any, index: number) => {
    try {
      const receiptPrice = parseFloat((item.price || "0").replace(/[^\d.]/g, ""))
      const expectedPrice = parseFloat((item.estPrice || "0").replace(/[^\d.]/g, ""))
      
      // If receipt hasn't been saved yet, save it first
      let receiptId = receiptData._id
      if (!receiptId) {
        const receiptRes = await fetch("/api/receipts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            patientId,
            imageUrl: imagePreview,
            pharmacyName: receiptData.pharmacyName,
            totalAmount: receiptData.totalAmount,
            items: receiptData.items,
            uploadedAt: new Date().toISOString()
          })
        })

        if (!receiptRes.ok) throw new Error("Failed to save receipt")
        const savedReceipt = await receiptRes.json()
        receiptId = savedReceipt.receiptId
        
        // Update local receipt data with the new ID
        setReceiptData((prev: any) => ({ ...prev, _id: receiptId }))
      }
      
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          medicineName: item.name,
          receiptPrice,
          expectedPrice,
          pharmacyId: "507f1f77bcf86cd799439011", // Default pharmacy ID as requested
          pharmacyName: receiptData.pharmacyName || "Unknown Pharmacy",
          receiptId: receiptId,
          pharmacyLocation: pharmacyLocation
        })
      })

      if (!res.ok) throw new Error("Failed to submit report")
      
      // Add points for reporting
      const pointsRes = await fetch("/api/rewards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          type: "report",
          points: 50,
          description: `Reported overpriced medicine: ${item.name}`
        })
      })

      if (pointsRes.ok) {
        // Update local points
        setPointsEarned(prev => prev + 50)
      }

      // Update the item to show it's been reported
      const newItems = [...receiptData.items]
      newItems[index] = { ...newItems[index], reported: true }
      setReceiptData({ ...receiptData, items: newItems })

    } catch (error) {
      console.error("Report error:", error)
      setError("Failed to submit report")
    }
  }

  return (
    <div className="min-h-screen liquid-glass-bg text-white max-w-sm mx-auto">
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
                  {cameraAvailable ? (
                    <>
                      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay playsInline />
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="text-white text-center relative z-10">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm opacity-75">Position your receipt clearly</p>
                      </div>
                      <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg z-10"></div>
                      <div className="absolute top-6 left-6 w-6 h-6 border-l-4 border-t-4 border-purple-400 z-10"></div>
                      <div className="absolute top-6 right-6 w-6 h-6 border-r-4 border-t-4 border-purple-400 z-10"></div>
                      <div className="absolute bottom-6 left-6 w-6 h-6 border-l-4 border-b-4 border-purple-400 z-10"></div>
                      <div className="absolute bottom-6 right-6 w-6 h-6 border-r-4 border-b-4 border-purple-400 z-10"></div>
                    </>
                  ) : null}
                  {/* Always show file input for upload (mobile/desktop) */}
                  <div className="flex flex-col items-center justify-center w-full h-full absolute z-20 top-0 left-0">
                    <Upload className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-sm opacity-75 mb-2">Upload a photo from camera or gallery</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-gray-400"
                      onChange={handleFileChange}
                      capture="environment"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-3">
              {cameraAvailable ? (
              <Button onClick={handleCapture} className="w-full h-12 glass-button border-0">
                <Camera className="mr-2 h-5 w-5" />
                Capture Photo
              </Button>
              ) : null}
            </div>
            {error && <div className="text-red-400 text-center">{error}</div>}
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

        {step === "review" && receiptData && (
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
                  <Label htmlFor="pharmacyLocation" className="text-white">
                    Pharmacy Location <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="pharmacyLocation"
                    value={pharmacyLocation}
                    onChange={(e) => {
                      setPharmacyLocation(e.target.value)
                      setLocationRequired(!e.target.value)
                      setError("")
                    }}
                    className={`glass-input border-0 ${locationRequired ? 'border-red-400' : ''}`}
                    placeholder="Enter pharmacy address/location"
                  />
                  {locationRequired && (
                    <div className="text-red-400 text-xs mt-1">Pharmacy location is required.</div>
                  )}
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
                {receiptData.items.map((item: any, index: number) => {
                   const receiptPrice = parseFloat((item.price || "0").replace(/[^\d.]/g, ""))
                   const expectedPrice = parseFloat((item.estPrice || "0").replace(/[^\d.]/g, ""))
                   const isOverpriced = expectedPrice < receiptPrice && expectedPrice > 0
                   const isCorrectPrice = expectedPrice === receiptPrice
                   
                   return (
                     <div key={index} className={`glass-card rounded-lg p-3 ${isOverpriced ? 'bg-red-500/10 border border-red-500/20' : isCorrectPrice ? 'bg-green-500/10 border border-green-500/20' : ''}`}>
                       <Label htmlFor={`item-name-${index}`} className="text-white">
                         Item Name
                       </Label>
                       <Input
                         id={`item-name-${index}`}
                         value={item.name || ""}
                         onChange={(e) => {
                           const newItems = [...receiptData.items]
                           newItems[index] = { ...newItems[index], name: e.target.value }
                           setReceiptData({ ...receiptData, items: newItems })
                         }}
                         className="glass-input border-0"
                       />
                       <div className="grid grid-cols-2 gap-3 mt-3">
                         <div>
                           <Label htmlFor={`item-price-${index}`} className="text-white">
                             Your Price
                           </Label>
                           <Input
                             id={`item-price-${index}`}
                             value={item.price || ""}
                             onChange={(e) => {
                               const newItems = [...receiptData.items]
                               newItems[index] = { ...newItems[index], price: e.target.value }
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
                             value={item.estPrice || ""}
                             onChange={() => {}}
                             disabled
                             className={`glass-input border-0 ${isOverpriced ? 'text-red-400' : isCorrectPrice ? 'text-green-400' : 'opacity-60'}`}
                           />
                         </div>
                       </div>
                       {isOverpriced && (
                         <div className="flex items-center justify-between mt-2">
                           <div className="flex items-center text-red-400">
                             <AlertTriangle className="h-4 w-4 mr-1" />
                             <p className="text-sm">
                               Overpriced by ₹{(receiptPrice - expectedPrice).toFixed(2)}
                             </p>
                           </div>
                           {!item.reported && (
                             <Button
                               onClick={() => handleReport(item, index)}
                               size="sm"
                               className="bg-red-500 hover:bg-red-600 text-white"
                             >
                               <Flag className="h-3 w-3 mr-1" />
                               Report
                             </Button>
                           )}
                           {item.reported && (
                             <div className="flex items-center text-green-400">
                               <Check className="h-4 w-4 mr-1" />
                               <p className="text-sm">Reported</p>
                             </div>
                           )}
                         </div>
                       )}
                       {isCorrectPrice && (
                         <div className="flex items-center mt-2 text-green-400">
                           <Check className="h-4 w-4 mr-1" />
                           <p className="text-sm">
                             Correct price
                           </p>
                         </div>
                       )}
                     </div>
                   )
                 })}
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
