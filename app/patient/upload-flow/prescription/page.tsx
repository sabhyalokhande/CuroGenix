"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Upload, ArrowLeft, X, Edit, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { generatePrescriptionData } from "@/app/api/gemini-ocr/route"

interface MedicineDetail {
  name: string
  uses: string[]
  estPrice: string
}

export default function PrescriptionUploadFlow() {
  const [step, setStep] = useState("capture") // capture, processing, review
  const [detectedMedicines, setDetectedMedicines] = useState<MedicineDetail[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const router = useRouter()

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      streamRef.current = stream
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("Could not access camera. Please ensure permissions are granted.")
      setStep("capture")
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  useEffect(() => {
    if (step === "capture") {
      startCamera()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [step, startCamera, stopCamera])

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (context) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageDataUrl = canvas.toDataURL("image/jpeg")
      setStep("processing")

      try {
        const response = await generatePrescriptionData(imageDataUrl)
        if (response.success && response.data) {
          setDetectedMedicines(response.data)
          setStep("review")
        } else {
          alert(response.error || "Failed to process prescription.")
          setStep("capture")
        }
      } catch (error) {
        console.error("Error calling Gemini API:", error)
        alert("An error occurred during processing. Please try again.")
        setStep("capture")
      }
    }
  }

  const handleViewOnMap = () => {
    const medicineNames = detectedMedicines.map((med) => med.name).join(",")
    router.push(`/patient/search-mobile?medicines=${encodeURIComponent(medicineNames)}`)
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
            <h1 className="font-semibold text-white">Upload Prescription</h1>
            <p className="text-sm text-gray-400">Scan or upload your prescription</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {step === "capture" && (
          <div className="space-y-6">
            <Card className="glass-card border-0">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay playsInline />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="text-white text-center relative z-10">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm opacity-75">Position your prescription clearly</p>
                  </div>
                  <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg z-10"></div>
                  <div className="absolute top-6 left-6 w-6 h-6 border-l-4 border-t-4 border-green-400 z-10"></div>
                  <div className="absolute top-6 right-6 w-6 h-6 border-r-4 border-t-4 border-green-400 z-10"></div>
                  <div className="absolute bottom-6 left-6 w-6 h-6 border-l-4 border-b-4 border-green-400 z-10"></div>
                  <div className="absolute bottom-6 right-6 w-6 h-6 border-r-4 border-b-4 border-green-400 z-10"></div>
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
            <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto animate-spin">
              <Loader2 className="h-10 w-10 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Processing Prescription...</h2>
            <p className="text-gray-400">Our AI is reading your document. This may take a moment.</p>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-white">
                  <Edit className="mr-2 h-5 w-5 text-blue-400" />
                  Detected Medicines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="glass-card rounded-lg p-3 space-y-4">
                  {detectedMedicines.map((med, index) => (
                    <div key={index} className="pb-4 border-b border-white/10 last:border-b-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-lg text-orange-400">{med.name}</h3>
                        <span className="font-semibold text-orange-400">{med.estPrice}</span>
                      </div>
                      <div className="text-sm text-gray-300 pl-2">
                        {med.uses.map((use, useIndex) => (
                          <p key={useIndex}>• {use}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleViewOnMap} className="w-full h-12 glass-button border-0">
              <MapPin className="mr-2 h-5 w-5" />
              View on Map
            </Button>
            <Button className="w-full h-12 glass-button border-0" onClick={() => setStep("capture")}>
              <X className="mr-2 h-5 w-5" />
              Retake Photo
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
