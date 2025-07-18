"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Award, Gift, Star, Trophy, Zap, ShoppingBag, Coffee, Gamepad2 } from "lucide-react"
import Link from "next/link"

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const userPoints = 1247
  const nextTierPoints = 2000
  const progressPercentage = (userPoints / nextTierPoints) * 100

  const rewardTiers = [
    { name: "Bronze", min: 0, max: 500, color: "text-orange-600", bgColor: "bg-orange-100" },
    { name: "Silver", min: 501, max: 1500, color: "text-gray-600", bgColor: "bg-gray-100" },
    { name: "Gold", min: 1501, max: 3000, color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { name: "Platinum", min: 3001, max: 999999, color: "text-purple-600", bgColor: "bg-purple-100" },
  ]

  const currentTier = rewardTiers.find((tier) => userPoints >= tier.min && userPoints <= tier.max)
  const nextTier = rewardTiers.find((tier) => tier.min > userPoints)

  const recentActivities = [
    { action: "Receipt Upload", points: "+25", date: "Today", icon: Award },
    { action: "Medicine Purchase", points: "+15", date: "Yesterday", icon: ShoppingBag },
    { action: "Price Alert Report", points: "+20", date: "2 days ago", icon: Star },
    { action: "App Review", points: "+50", date: "1 week ago", icon: Trophy },
  ]

  const availableRewards = [
    { name: "₹50 Medicine Voucher", cost: 500, category: "Healthcare", icon: Award },
    { name: "Free Coffee", cost: 200, category: "Food & Drink", icon: Coffee },
    { name: "₹100 Pharmacy Credit", cost: 1000, category: "Healthcare", icon: Gift },
    { name: "Gaming Voucher", cost: 800, category: "Entertainment", icon: Gamepad2 },
  ]

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
            <h1 className="font-semibold text-white">My Rewards</h1>
            <p className="text-sm text-gray-400">Earn points and redeem rewards</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Points Overview */}
        <Card className="glass-card border-0">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <Award className="h-12 w-12 text-green-400 mx-auto mb-2" />
              <h2 className="text-3xl font-bold text-white">{userPoints.toLocaleString()}</h2>
              <p className="text-gray-400">Total Points</p>
            </div>

            {currentTier && (
              <div className="mb-4">
                <Badge className={`${currentTier.color} glass-button border-0 mb-2`}>{currentTier.name} Member</Badge>
                {nextTier && (
                  <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Progress to {nextTier.name}</span>
                      <span>{nextTier.min - userPoints} points to go</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2 bg-white/10" />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex glass-card rounded-lg p-1">
          {[
            { id: "overview", label: "Overview" },
            { id: "redeem", label: "Redeem" },
            { id: "history", label: "History" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`flex-1 ${activeTab === tab.id ? "glass-button border-0" : "text-gray-400 hover:text-white"}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-yellow-400" />
                  Ways to Earn Points
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Upload Receipt</span>
                  <Badge className="glass-button border-0 text-green-400">+25 pts</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Report Price Issue</span>
                  <Badge className="glass-button border-0 text-green-400">+20 pts</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Medicine Purchase</span>
                  <Badge className="glass-button border-0 text-green-400">+15 pts</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Daily Check-in</span>
                  <Badge className="glass-button border-0 text-green-400">+5 pts</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <activity.icon className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-white text-sm">{activity.action}</p>
                        <p className="text-gray-400 text-xs">{activity.date}</p>
                      </div>
                    </div>
                    <Badge className="glass-button border-0 text-green-400">{activity.points}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "redeem" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {availableRewards.map((reward, index) => (
                <Card key={index} className="glass-card border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <reward.icon className="h-8 w-8 text-blue-400" />
                        <div>
                          <h3 className="font-medium text-white">{reward.name}</h3>
                          <p className="text-sm text-gray-400">{reward.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-orange-400">{reward.cost} pts</p>
                      </div>
                    </div>
                    <Button
                      className={`w-full ${
                        userPoints >= reward.cost
                          ? "glass-button border-0"
                          : "glass-button border-0 opacity-50 cursor-not-allowed"
                      }`}
                      disabled={userPoints < reward.cost}
                    >
                      {userPoints >= reward.cost ? "Redeem Now" : "Not Enough Points"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-white">Points History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <activity.icon className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-white text-sm">{activity.action}</p>
                        <p className="text-gray-400 text-xs">{activity.date}</p>
                      </div>
                    </div>
                    <Badge className="glass-button border-0 text-green-400">{activity.points}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20"></div>
    </div>
  )
}
