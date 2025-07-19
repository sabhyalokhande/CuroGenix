"use server"

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const connection = await dbConnect()
    const db = connection.connection.db
    
    // Get all fraud reports from fraud_location collection
    const fraudReports = await db.collection('fraud_location')
      .find({})
      .sort({ timestamp: -1 }) // Most recent first
      .toArray()

    return NextResponse.json({
      success: true,
      data: fraudReports
    })

  } catch (error: any) {
    console.error("Get fraud reports error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch fraud reports" },
      { status: 500 }
    )
  }
}

// Update fraud report status
export async function PUT(req: NextRequest) {
  try {
    const { reportId, status } = await req.json()
    
    if (!reportId || !status) {
      return NextResponse.json({ 
        success: false, 
        error: "Report ID and status are required" 
      }, { status: 400 })
    }

    const connection = await dbConnect()
    const db = connection.connection.db
    
    // Update the fraud report status
    const result = await db.collection('fraud_location').updateOne(
      { _id: reportId },
      { $set: { status } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: "Fraud report not found"
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Fraud report status updated successfully"
    })

  } catch (error: any) {
    console.error("Update fraud report error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update fraud report" },
      { status: 500 }
    )
  }
} 