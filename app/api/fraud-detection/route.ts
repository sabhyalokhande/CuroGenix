import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import mongoose from 'mongoose'

export async function GET() {
  try {
    await dbConnect()
    const db = mongoose.connection.db
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }
    const fraudAlerts = await db
      .collection('fraud_location')
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray()
    return NextResponse.json(fraudAlerts)
  } catch (error) {
    console.error('Error fetching fraud alerts:', error)
    return NextResponse.json({ error: 'Failed to fetch fraud alerts' }, { status: 500 })
  }
} 