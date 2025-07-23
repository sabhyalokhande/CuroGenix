"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Upload, ArrowLeft, X, Edit, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface MedicineDetail {
  name: string
  uses: string[]
  estPrice: string
}

// Add useHasMounted hook
function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

export default function PrescriptionUploadFlow() {
  const hasMounted = useHasMounted();
  const [step, setStep] = useState("capture") // capture, processing, review
  const [detectedMedicines, setDetectedMedicines] = useState<MedicineDetail[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const router = useRouter()

  const startCamera = useCallback(async () => {
    setCameraReady(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.onloadedmetadata = null;
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
          setCameraReady(true);
        };
      }
      streamRef.current = stream;
    } catch (err) {
      // Only alert on client
      alert("Could not access camera. Please ensure permissions are granted.");
      setCameraReady(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.onloadedmetadata = null;
    }
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    if (step === "capture") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [step, startCamera, stopCamera, hasMounted]);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) {
      alert("Camera not ready. Please wait a moment and try again.");
      return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (context && video.videoWidth > 0 && video.videoHeight > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
      stopCamera();
      setImageDataUrl(imageDataUrl)
      setStep("processing");
      try {
        const response = await fetch("/api/gemini-ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageDataUrl }),
        });
        const result = await response.json();
        if (result.success && result.data) {
          setDetectedMedicines(result.data);
          setStep("review");
        } else {
          alert(result.error || "Failed to process prescription.");
          setStep("capture");
        }
      } catch (error) {
        alert("An error occurred during processing. Please try again.");
        setStep("capture");
      }
    } else {
      alert("Unable to capture image. Please ensure camera is working properly.");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUrl = e.target?.result as string;
        setStep("processing");
        try {
          const response = await fetch("/api/gemini-ocr", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageDataUrl }),
          });
          const result = await response.json();
          if (result.success && result.data) {
            setDetectedMedicines(result.data);
            setStep("review");
          } else {
            alert(result.error || "Failed to process prescription.");
            setStep("capture");
          }
        } catch (error) {
          alert("An error occurred during processing. Please try again.");
          setStep("capture");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAndViewOnMap = async () => {
    const token = localStorage.getItem("token")
    if (!patientId) {
      alert("User not logged in or user ID missing.")
      return
    }
    // Compose ocrText from detectedMedicines
    const ocrText = detectedMedicines.map(med => med.name).join(", ")
    const payload = {
      patientId,
      imageUrl: imageDataUrl,
      ocrText,
      uploadedAt: new Date().toISOString()
    }
    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        // After saving, go to map
        const medicineNames = detectedMedicines.map((med) => med.name).join(",")
        router.push(`/patient/search-mobile?medicines=${encodeURIComponent(medicineNames)}`)
      } else {
        alert("Failed to save prescription.")
      }
    } catch {
      alert("Failed to save prescription.")
    }
  }

  const handleViewOnMap = () => {
    const medicineNames = detectedMedicines.map((med) => med.name).join(",");
    router.push(`/patient/search-mobile?medicines=${encodeURIComponent(medicineNames)}`);
  };

  if (!hasMounted) return null;

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
      <div className="glass-nav border-b border-white/10 sticky top-0 z-20">
        <div className="flex items-center p-4">
          <Link href="/patient/dashboard">
            <Button variant="ghost" size="sm" className="mr-2 p-2 glass-button border-0 cursor-pointer" style={{ touchAction: "manipulation" }}>
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
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  {/* Camera overlays, z-10, but buttons are z-20 */}
                  {!cameraReady && (
                    <div className="text-white text-center relative z-10 pointer-events-none">
                      <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-sm opacity-75">Starting camera...</p>
                    </div>
                  )}
                  {cameraReady && (
                    <>
                      <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg z-10 pointer-events-none"></div>
                      <div className="absolute top-6 left-6 w-6 h-6 border-l-4 border-t-4 border-green-400 z-10 pointer-events-none"></div>
                      <div className="absolute top-6 right-6 w-6 h-6 border-r-4 border-t-4 border-green-400 z-10 pointer-events-none"></div>
                      <div className="absolute bottom-6 left-6 w-6 h-6 border-l-4 border-b-4 border-green-400 z-10 pointer-events-none"></div>
                      <div className="absolute bottom-6 right-6 w-6 h-6 border-r-4 border-b-4 border-green-400 z-10 pointer-events-none"></div>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm z-10 pointer-events-none">
                        Position prescription clearly
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            <div className="space-y-3 z-20 relative">
              <Button
                onClick={handleCapture}
                disabled={!cameraReady}
                className="w-full h-12 glass-button border-0 cursor-pointer"
                style={{ touchAction: "manipulation" }}
              >
                <Camera className="mr-2 h-5 w-5" />
                {cameraReady ? "Capture Photo" : "Starting Camera..."}
              </Button>
              <label className="w-full">
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <Button className="w-full h-12 glass-button border-0 cursor-pointer" asChild style={{ touchAction: "manipulation" }}>
                  <span>
                    <Upload className="mr-2 h-5 w-5" />
                    Upload from Gallery
                  </span>
                </Button>
              </label>
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
            <Button onClick={handleSaveAndViewOnMap} className="w-full h-12 glass-button border-0 cursor-pointer" style={{ touchAction: "manipulation" }}>
              <MapPin className="mr-2 h-5 w-5" />
              View on Map
            </Button>
            <Button className="w-full h-12 glass-button border-0 cursor-pointer" style={{ touchAction: "manipulation" }} onClick={() => setStep("capture")}>
              <X className="mr-2 h-5 w-5" />
              Retake Photo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
