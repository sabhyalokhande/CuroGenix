"use client"
import React, { useState, useEffect } from "react"
import { ShieldAlert, CheckCircle, Send, Ban } from "lucide-react"

export default function AlertsSection() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout
    async function fetchAlerts() {
      try {
        const res = await fetch("/api/fraud-detection")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setAlerts(
          data.map((item: any) => ({
            id: item._id,
            medicine: item.medicineName,
            batch: item.batchNumber,
            foundAt: item.reportedLocation,
            expectedAt: item.allocatedLocation,
            status: "critical",
            reliability: 0.3,
            pharmacy: item.reportedPharmacy,
            lastAction: item.status === "pending" ? "" : item.status,
            date: item.timestamp ? new Date(item.timestamp).toISOString().slice(0, 16).replace("T", " ") : "",
          }))
        )
      } catch {
        setAlerts([])
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()
    interval = setInterval(fetchAlerts, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-40 text-gray-400 text-lg">Loading alerts...</div>
  }

  const handleAction = (id: string, action: "warn" | "cancel") => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              lastAction: action === "warn" ? "Warning Sent" : "License Cancelled",
              reliability: action === "cancel" ? 0 : alert.reliability - 0.1,
            }
          : alert
      )
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 py-12 px-2 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2 leading-tight drop-shadow-lg">Alerts & Critical Issues</h2>
            <p className="text-gray-200 text-lg font-medium">Take action on critical issues.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-2xl border-2 group transition-all duration-200 hover:scale-[1.025] hover:shadow-2xl ${getCardStyle(alert.status)} p-6 shadow-lg bg-gradient-to-br from-[#23263a]/90 to-[#18192b]/90`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {alert.status === "critical" ? (
                    <ShieldAlert className="w-6 h-6 text-[#a78bfa]" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-[#0369a1]" />
                  )}
                  <span className={`status-chip font-bold text-sm tracking-wide shadow border ${getStatusChip(alert.status)} px-2 py-0.5 rounded`}>{alert.status === "critical" ? "Critical" : "Normal"}</span>
                </div>
                <span className="text-xs text-gray-400 font-mono tracking-tight">{alert.date}</span>
              </div>
              <div className="mb-2">
                <div className="text-xl font-extrabold text-white mb-1 leading-tight drop-shadow-sm">
                  {alert.medicine} <span className="text-xs font-normal text-gray-400">({alert.batch})</span>
                </div>
                <div className="text-base text-gray-100 font-medium">
                  Found at <span className="font-semibold text-blue-400 underline underline-offset-2">{alert.foundAt}</span>
                  {alert.foundAt !== alert.expectedAt && (
                    <>
                      , expected at <span className="font-semibold text-purple-300 underline underline-offset-2">{alert.expectedAt}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`status-chip border font-semibold text-xs ${getReliabilityColor(alert.reliability)} px-2 py-0.5 rounded`}>Reliability: {(alert.reliability * 100).toFixed(0)}%</span>
                {alert.reliability < 0.4 && (
                  <span className="status-chip bg-[#ede9fe] text-[#a78bfa] border-[#c4b5fd] font-semibold text-xs px-2 py-0.5 rounded">License at Risk</span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-100 font-medium">Pharmacy: <span className="font-semibold text-blue-300 underline">{alert.pharmacy}</span></span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-gray-100 font-medium">Last Action: <span className="font-semibold text-white">{alert.lastAction || 'None'}</span></span>
              </div>
              <div className="flex gap-3">
                {alert.status === 'critical' && alert.lastAction !== 'License Cancelled' && (
                  <>
                    <button
                      className="btn-primary flex items-center gap-2 text-sm font-semibold shadow hover:scale-105 active:scale-95 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={() => handleAction(alert.id, 'warn')}
                      disabled={alert.lastAction === 'Warning Sent'}
                    >
                      <Send className="w-4 h-4" />
                      {alert.lastAction === 'Warning Sent' ? 'Warning Sent' : 'Send Warning'}
                    </button>
                    <button
                      className={`btn-secondary flex items-center gap-2 text-sm font-semibold shadow hover:scale-105 active:scale-95 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded transition-all disabled:opacity-60 disabled:cursor-not-allowed ${alert.reliability >= 0.4 ? 'opacity-60 cursor-not-allowed' : ''}`}
                      onClick={() => handleAction(alert.id, 'cancel')}
                      disabled={alert.reliability >= 0.4}
                    >
                      <Ban className="w-4 h-4" />
                      Cancel License
                    </button>
                  </>
                )}
                {alert.status !== 'critical' && <span className="status-chip bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd] font-semibold text-xs px-2 py-0.5 rounded">No Action Needed</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getReliabilityColor(score: number) {
  if (score < 0.4) return 'bg-[#ede9fe] text-[#7c3aed] border-[#c4b5fd]'
  if (score < 0.7) return 'bg-[#fef9c3] text-[#b45309] border-[#fde68a]'
  return 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]'
}

function getCardStyle(status: string) {
  if (status === 'critical') return 'border-[#a78bfa]'
  if (status === 'normal') return 'border-[#60a5fa]'
  return 'border-[#e5e7eb]'
}

function getStatusChip(status: string) {
  if (status === 'critical') return 'bg-[#ede9fe] text-[#7c3aed] border-[#c4b5fd]'
  if (status === 'normal') return 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]'
  return 'bg-[#e5e7eb] text-gray-600 border-[#e5e7eb]'
} 