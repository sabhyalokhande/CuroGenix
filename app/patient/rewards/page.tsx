"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Award, History, Gift, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function PatientRewards() {
  const [totalPoints] = useState(1247)
  const [contributionsThisMonth] = useState(23)

  const rewardTiers = [
    { name: "Bronze Tier", points: 500, benefit: "5% discount on first purchase", achieved: true },
    { name: "Silver Tier", points: 1500, benefit: "10% discount on all purchases", achieved: false },
    { name: "Gold Tier", points: 3000, benefit: "15% discount + priority support", achieved: false },
  ]

  const recentActivities = [
    { type: "Receipt Upload", points: 50, date: "2024-07-15" },
    { type: "Prescription Scan", points: 30, date: "2024-07-12" },
    { type: "Anomaly Report", points: 100, date: "2024-07-10" },
    { type: "Receipt Upload", points: 45, date: "2024-07-08" },
  ]

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
            <h1 className="font-semibold text-gray-900">My Rewards</h1>
            <p className="text-sm text-gray-600">Track your points and benefits</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Total Points Summary */}
        <Card className="border-0 shadow-sm bg-green-100 text-center">
          <CardContent className="p-6">
            <Award className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <p className="text-sm text-green-800">Total Reward Points</p>
            <h2 className="text-4xl font-bold text-green-900">{totalPoints}</h2>
            <p className="text-sm text-green-700 mt-2">+{contributionsThisMonth} points this month</p>
            <Button className="mt-4 w-full bg-green-600 hover:bg-green-700" disabled>
              Redeem Points (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        {/* Reward Tiers */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Gift className="mr-2 h-5 w-5" />
              Reward Tiers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rewardTiers.map((tier, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                <div>
                  <h3 className="font-medium text-gray-900">{tier.name}</h3>
                  <p className="text-sm text-gray-600">{tier.benefit}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-green-600">{tier.points} pts</span>
                  {tier.achieved ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <span className="text-xs text-gray-500">
                      {tier.points - totalPoints > 0 ? `${tier.points - totalPoints} to go` : "Achieved"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <History className="mr-2 h-5 w-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                <div>
                  <p className="font-medium text-gray-900">{activity.type}</p>
                  <p className="text-sm text-gray-600">{activity.date}</p>
                </div>
                <span className="font-semibold text-green-600">+{activity.points} pts</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20"></div>
    </div>
  )
}
