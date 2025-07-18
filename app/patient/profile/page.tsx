"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, User, Edit, Bell, Shield, HelpCircle, LogOut, Camera, Award, MapPin } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    stockUpdates: true,
    promotions: false,
    reminders: true,
  })

  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    address: "123 Main Street, Downtown, City - 400001",
  })

  const handleSave = () => {
    setIsEditing(false)
    // Save user info logic here
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
            <h1 className="font-semibold text-white">Profile</h1>
            <p className="text-sm text-gray-400">Manage your account settings</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 glass-button border-0"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card className="glass-card border-0">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto">
                <User className="h-10 w-10 text-green-400" />
              </div>
              <Button size="sm" className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full glass-button border-0 p-0">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-bold text-white">{userInfo.name}</h2>
            <p className="text-gray-400">{userInfo.email}</p>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-green-400">1,247</p>
                <p className="text-xs text-gray-400">Points</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-blue-400">Gold</p>
                <p className="text-xs text-gray-400">Tier</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-purple-400">23</p>
                <p className="text-xs text-gray-400">Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-400" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white">
                Full Name
              </Label>
              <Input
                id="name"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                disabled={!isEditing}
                className="glass-input border-0"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                disabled={!isEditing}
                className="glass-input border-0"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-white">
                Phone Number
              </Label>
              <Input
                id="phone"
                value={userInfo.phone}
                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                disabled={!isEditing}
                className="glass-input border-0"
              />
            </div>
            <div>
              <Label htmlFor="address" className="text-white">
                Address
              </Label>
              <Input
                id="address"
                value={userInfo.address}
                onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                disabled={!isEditing}
                className="glass-input border-0"
              />
            </div>
            {isEditing && (
              <div className="flex space-x-2">
                <Button onClick={handleSave} className="flex-1 glass-button border-0">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 glass-button border-0">
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Bell className="mr-2 h-5 w-5 text-yellow-400" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Price Alerts</p>
                <p className="text-sm text-gray-400">Get notified about price changes</p>
              </div>
              <Switch
                checked={notifications.priceAlerts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, priceAlerts: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Stock Updates</p>
                <p className="text-sm text-gray-400">Medicine availability notifications</p>
              </div>
              <Switch
                checked={notifications.stockUpdates}
                onCheckedChange={(checked) => setNotifications({ ...notifications, stockUpdates: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Promotions</p>
                <p className="text-sm text-gray-400">Special offers and discounts</p>
              </div>
              <Switch
                checked={notifications.promotions}
                onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Reminders</p>
                <p className="text-sm text-gray-400">Medicine refill reminders</p>
              </div>
              <Switch
                checked={notifications.reminders}
                onCheckedChange={(checked) => setNotifications({ ...notifications, reminders: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Link href="/patient/rewards">
            <Button className="w-full justify-start glass-button border-0">
              <Award className="mr-3 h-5 w-5 text-green-400" />
              My Rewards & Points
            </Button>
          </Link>
          <Link href="/patient/saved">
            <Button className="w-full justify-start glass-button border-0">
              <MapPin className="mr-3 h-5 w-5 text-blue-400" />
              Saved Items
            </Button>
          </Link>
          <Link href="/patient/help">
            <Button className="w-full justify-start glass-button border-0">
              <HelpCircle className="mr-3 h-5 w-5 text-purple-400" />
              Help & Support
            </Button>
          </Link>
          <Button className="w-full justify-start glass-button border-0">
            <Shield className="mr-3 h-5 w-5 text-orange-400" />
            Privacy & Security
          </Button>
          <Button className="w-full justify-start glass-button border-0 text-red-400">
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20"></div>
    </div>
  )
}
