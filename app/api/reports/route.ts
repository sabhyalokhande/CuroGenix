import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { Report } from '@/lib/models'
import jwt, { JwtPayload } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const token = auth.split(' ')[1]
    let decoded: JwtPayload | null = null
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 })
    }

    const { medicineName, receiptPrice, expectedPrice, pharmacyId, pharmacyName, receiptId } = await req.json()
    
    if (!medicineName || !receiptPrice || !expectedPrice || !pharmacyId || !pharmacyName || !receiptId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const priceDifference = receiptPrice - expectedPrice
    
    const report = new Report({
      userId: decoded.userId,
      medicineName,
      receiptPrice,
      expectedPrice,
      priceDifference,
      pharmacyId,
      pharmacyName,
      receiptId
    })

    await report.save()

    return NextResponse.json({ 
      success: true, 
      message: 'Report submitted successfully',
      reportId: report._id 
    })

  } catch (error: any) {
    console.error('Report submission error:', error)
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const token = auth.split(' ')[1]
    let decoded: JwtPayload | null = null
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 })
    }

    const reports = await Report.find({ userId: decoded.userId }).sort({ reportedAt: -1 })
    
    return NextResponse.json({ success: true, reports })

  } catch (error: any) {
    console.error('Fetch reports error:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
} 