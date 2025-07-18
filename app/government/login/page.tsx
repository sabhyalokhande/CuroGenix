"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function GovernmentLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      router.push("/government/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen liquid-glass-bg text-white flex items-center justify-center p-4 relative">
      {/* SVG Filter for Liquid Distortion */}
      <svg style={{ display: "none" }}>
        <filter id="liquidGlass">
          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="turb" />
          <feDisplacementMap in2="turb" in="SourceGraphic" scale="15" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2 animate-liquid-flow">
            <Shield className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold gradient-text">CuroGenix</span>
          </Link>
        </div>

        <Card className="glass-card border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Government Portal</CardTitle>
            <CardDescription className="text-gray-300">
              Monitor regional health trends and detect anomalies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Official Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="official@health.gov"
                  required
                  className="glass-input border-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="glass-input border-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-white">
                  OTP (Optional)
                </Label>
                <Input id="otp" placeholder="Enter OTP for extra security" className="glass-input border-0" />
              </div>
              <Button type="submit" className="w-full glass-button border-0" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Secure Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-300 hover:text-white glass-button px-4 py-2 rounded-lg border-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
