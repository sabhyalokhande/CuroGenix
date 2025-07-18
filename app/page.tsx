"use client"

import { useState } from "react"
import { EnhancedRoleSelector } from "@/components/enhanced-role-selector"
import { PatientDashboard } from "@/components/patient/patient-dashboard"
import { PharmacyDashboard } from "@/components/pharmacy/pharmacy-dashboard"
import { GovernmentDashboard } from "@/components/government/government-dashboard"
import { EnhancedAIAssistant } from "@/components/enhanced-ai-assistant"

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<"patient" | "pharmacy" | "government" | null>(null)

  const renderDashboard = () => {
    switch (selectedRole) {
      case "patient":
        return <PatientDashboard />
      case "pharmacy":
        return <PharmacyDashboard />
      case "government":
        return <GovernmentDashboard />
      default:
        return <EnhancedRoleSelector onRoleSelect={setSelectedRole} />
    }
  }

  return (
    <main>
      {renderDashboard()}
      {selectedRole && <EnhancedAIAssistant />}
    </main>
  )
}
