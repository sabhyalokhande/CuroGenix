"use server"

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import mongoose from 'mongoose'

interface FraudReport {
  batchNumber: string
  medicineName: string
  manufacturer: string
  allocatedLocation: string
  reportedLocation: string
  reportedPharmacy: string
  userLocation: string
  imageData: string
  timestamp: Date
  status: 'pending' | 'investigating' | 'resolved'
}

export async function POST(req: NextRequest) {
  try {
    const { batchNumber, medicineName, manufacturer, userLocation, imageData, reportedPharmacy } = await req.json()
    
    console.log('Fraud detection API received:', { batchNumber, medicineName, manufacturer, userLocation, reportedPharmacy })
    
    if (!batchNumber) {
      return NextResponse.json({ 
        success: false, 
        error: "Batch number is required" 
      }, { status: 400 })
    }

    const connection = await dbConnect()
    const db = connection.connection.db
    
    // Search for the medicine in Medicine_PHO_Tracker collection
    console.log('Searching for batch number:', batchNumber)
    
    // First, let's see what collections exist and what's in the Medicine_PHO_Tracker collection
    const collections = await db.listCollections().toArray()
    console.log('Available collections:', collections.map((c: any) => c.name))
    
    // Check if the collection exists and has data
    const collectionCount = await db.collection('Medicine_PHO_Tracker').countDocuments()
    console.log('Medicine_PHO_Tracker collection count:', collectionCount)
    
    // Let's see a few sample records to understand the data structure
    const sampleRecords = await db.collection('Medicine_PHO_Tracker').find({}).limit(3).toArray()
    console.log('Sample records:', sampleRecords.map((r: any) => ({ 
      batchNo: r['Batch No.'], 
      genericName: r['Generic Name'],
      hasBatchNo: !!r['Batch No.']
    })))
    
    // Try exact match first
    let medicineRecord = await db.collection('Medicine_PHO_Tracker').findOne({
      'Batch No.': batchNumber
    })
    
    console.log('Exact match result:', medicineRecord ? 'FOUND' : 'NOT FOUND')
    console.log('Exact match query:', { 'Batch No.': batchNumber })
    
    // Let's also try to find the record manually to see what's happening
    const allRecords = await db.collection('Medicine_PHO_Tracker').find({}).toArray()
    const exactMatchRecord = allRecords.find((r: any) => r['Batch No.'] === batchNumber)
    console.log('Manual exact match:', exactMatchRecord ? 'FOUND' : 'NOT FOUND')
    if (exactMatchRecord) {
      console.log('Manual match details:', {
        batchNo: exactMatchRecord['Batch No.'],
        batchNoType: typeof exactMatchRecord['Batch No.'],
        searchBatchType: typeof batchNumber,
        genericName: exactMatchRecord['Generic Name']
      })
    }
    
    // Try using the manual match if MongoDB query failed
    if (!medicineRecord && exactMatchRecord) {
      console.log('Using manual match instead of MongoDB query')
      medicineRecord = exactMatchRecord
    }
    
    // If not found, let's search for any record containing this batch number
    if (!medicineRecord) {
      console.log('Exact match failed, searching for any record containing the batch number...')
      const allRecords = await db.collection('Medicine_PHO_Tracker').find({}).toArray()
      const matchingRecords = allRecords.filter((r: any) => 
        r['Batch No.'] && r['Batch No.'].toString().includes(batchNumber)
      )
      console.log('Records containing batch number:', matchingRecords.map((r: any) => r['Batch No.']))
      
      // Try case-insensitive search
      medicineRecord = await db.collection('Medicine_PHO_Tracker').findOne({
        'Batch No.': { $regex: new RegExp(batchNumber, 'i') }
      })
      
      console.log('Case-insensitive search result:', medicineRecord ? 'FOUND' : 'NOT FOUND')
      
      // If still not found, try partial match
      if (!medicineRecord) {
        medicineRecord = await db.collection('Medicine_PHO_Tracker').findOne({
          'Batch No.': { $regex: batchNumber }
        })
        console.log('Partial match result:', medicineRecord ? 'FOUND' : 'NOT FOUND')
      }
    }
    
    console.log('Found medicine record:', medicineRecord ? 'YES' : 'NO')
    if (medicineRecord) {
      console.log('Record details:', {
        batchNo: medicineRecord['Batch No.'],
        genericName: medicineRecord['Generic Name'],
        allocatedLocation: medicineRecord['Allocated Public Health Organization']
      })
    }

    if (!medicineRecord) {
      console.log('Medicine not found in database, returning not found response')
      console.log('Using extracted data:', { medicineName, manufacturer })
      return NextResponse.json({
        success: true,
        data: {
          isFraud: false,
          message: "This batch number is not registered in our system",
          allocatedLocation: "Not found in database",
          medicineDetails: {
            genericName: medicineName || "Not found",
            brandName: "Not found", 
            manufacturer: manufacturer || "Not found",
            manufacturingDate: "Not found",
            expiryDate: "Not found",
            licenseNumber: "Not found"
          }
        }
      })
    }

    // Check if there's a location mismatch
    const allocatedLocation = medicineRecord['Allocated Public Health Organization'] || 'Unknown'
    const phoAddress = medicineRecord['PHO Address'] || ''
    
    // More robust location comparison
    const isLocationMismatch = !allocatedLocation.toLowerCase().includes(userLocation.toLowerCase()) &&
                               !userLocation.toLowerCase().includes(allocatedLocation.toLowerCase()) &&
                               !phoAddress.toLowerCase().includes(userLocation.toLowerCase()) &&
                               !userLocation.toLowerCase().includes(phoAddress.toLowerCase())

    console.log('Fraud Detection:', {
      batchNumber,
      allocatedLocation,
      phoAddress,
      userLocation,
      isLocationMismatch
    })

    if (isLocationMismatch) {
      // Create fraud report
      const fraudReport: FraudReport = {
        batchNumber,
        medicineName: medicineRecord['Generic Name'] || medicineName,
        manufacturer: medicineRecord['Manufacturer Name and Address'] || manufacturer,
        allocatedLocation,
        reportedLocation: userLocation,
        reportedPharmacy,
        userLocation,
        imageData,
        timestamp: new Date(),
        status: 'pending'
      }

      // Store in fraud_location collection
      await db.collection('fraud_location').insertOne(fraudReport)

      return NextResponse.json({
        success: true,
        data: {
          isFraud: true,
          allocatedLocation,
          medicineDetails: {
            genericName: medicineRecord['Generic Name'],
            brandName: medicineRecord['Brand Name'],
            manufacturer: medicineRecord['Manufacturer Name and Address'],
            manufacturingDate: medicineRecord['Date of Manufacturing'],
            expiryDate: medicineRecord['Date of Expiry'],
            licenseNumber: medicineRecord['Manufacturing Licence No.']
          },
          message: `⚠️ ANOMALY DETECTED! This medicine was allocated to: ${allocatedLocation}`
        }
      })
    }

    // No fraud detected
    return NextResponse.json({
      success: true,
      data: {
        isFraud: false,
        allocatedLocation,
        medicineDetails: {
          genericName: medicineRecord['Generic Name'],
          brandName: medicineRecord['Brand Name'],
          manufacturer: medicineRecord['Manufacturer Name and Address'],
          manufacturingDate: medicineRecord['Date of Manufacturing'],
          expiryDate: medicineRecord['Date of Expiry'],
          licenseNumber: medicineRecord['Manufacturing Licence No.']
        },
        message: "✅ Medicine location verified. No anomalies detected."
      }
    })

  } catch (error: any) {
    console.error("Fraud detection error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process fraud detection" },
      { status: 500 }
    )
  }
}

// Get nearby pharmacies for reporting
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const location = searchParams.get('location')
    
    if (!location) {
      return NextResponse.json({ 
        success: false, 
        error: "Location parameter is required" 
      }, { status: 400 })
    }

    const connection = await dbConnect()
    const db = connection.connection.db
    
    // Get pharmacies from the pharmacies collection (you can modify this based on your pharmacy data structure)
    const pharmacies = await db.collection('pharmacies')
      .find({
        $or: [
          { address: { $regex: location, $options: 'i' } },
          { name: { $regex: location, $options: 'i' } }
        ]
      })
      .limit(10)
      .toArray()

    return NextResponse.json({
      success: true,
      data: pharmacies
    })

  } catch (error: any) {
    console.error("Get pharmacies error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch pharmacies" },
      { status: 500 }
    )
  }
} 