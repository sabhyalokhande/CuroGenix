"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CuroGenixLogo } from "@/components/ui/curogenix-logo"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PharmacyLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    const form = e.target as HTMLFormElement
    const email = (form.email as HTMLInputElement).value
    const password = (form.password as HTMLInputElement).value
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")
      localStorage.setItem("token", data.token)
      router.push("/pharmacy/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRegistering(true)
    setError("")
    const form = e.target as HTMLFormElement
    const name = (form.pharmacyName as HTMLInputElement).value
    const licenseNumber = (form.license as HTMLInputElement).value
    const email = (form.email as HTMLInputElement).value
    const phone = (form.phone as HTMLInputElement).value
    const address = (form.address as HTMLInputElement).value
    const password = (form.password as HTMLInputElement).value
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "pharmacy",
          pharmacyInfo: { name, licenseNumber, address, contact: phone }
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Registration failed")
      router.push("/pharmacy/login")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsRegistering(false)
    }
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
          <Link href="/" className="flex items-center animate-liquid-flow">
            <CuroGenixLogo size="lg" />
          </Link>
        </div>

        <Card className="glass-card border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Pharmacy Portal</CardTitle>
            <CardDescription className="text-gray-300">Manage your inventory and track demand patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass-card bg-transparent border-0">
                <TabsTrigger value="login" className="glass-button border-0 data-[state=active]:bg-white/20">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="glass-button border-0 data-[state=active]:bg-white/20">
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="pharmacy@example.com"
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
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                      className="glass-input border-0"
                    />
                  </div>
                  {error && <div className="text-red-400 text-sm">{error}</div>}
                  <Button type="submit" className="w-full glass-button border-0" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pharmacyName" className="text-white">
                      Pharmacy Name
                    </Label>
                    <Input
                      id="pharmacyName"
                      name="pharmacyName"
                      placeholder="Enter pharmacy name"
                      required
                      className="glass-input border-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license" className="text-white">
                      License Number
                    </Label>
                    <Input id="license" name="license" placeholder="Enter license number" required className="glass-input border-0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="pharmacy@example.com"
                      required
                      className="glass-input border-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      required
                      className="glass-input border-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-white">
                      Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Enter pharmacy address"
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
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      required
                      className="glass-input border-0"
                    />
                  </div>
                  {error && <div className="text-red-400 text-sm">{error}</div>}
                  <Button type="submit" className="w-full glass-button border-0" disabled={isRegistering}>
                    {isRegistering ? "Creating account..." : "Register Pharmacy"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
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
