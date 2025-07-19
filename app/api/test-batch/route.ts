"use server"

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const connection = await dbConnect()
    const db = connection.connection.db
    
    // Get all batch numbers from the Medicine_PHO_Tracker collection
    const allRecords = await db.collection('Medicine_PHO_Tracker').find({}).toArray()
    
    // Extract batch numbers and some basic info
    const batchNumbers = allRecords.map((record: any) => ({
      batchNo: record['Batch No.'],
      genericName: record['Generic Name'],
      brandName: record['Brand Name'],
      manufacturer: record['Manufacturer Name and Address'],
      allocatedLocation: record['Allocated Public Health Organization']
    }))
    
    console.log('All batch numbers in database:', batchNumbers.map((b: any) => b.batchNo))
    
    // Test specific batch numbers mentioned by user
    const testBatchNumbers = ['D150H181', 'DOBS3984', 'DOBS3921']
    console.log('Testing specific batch numbers:')
    
    for (const testBatch of testBatchNumbers) {
      const found = await db.collection('Medicine_PHO_Tracker').findOne({
        'Batch No.': testBatch
      })
      console.log(`Batch ${testBatch}: ${found ? 'FOUND' : 'NOT FOUND'}`)
      if (found) {
        console.log(`  - Generic Name: ${found['Generic Name']}`)
        console.log(`  - Brand Name: ${found['Brand Name']}`)
        console.log(`  - Allocated Location: ${found['Allocated Public Health Organization']}`)
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        totalRecords: allRecords.length,
        batchNumbers: batchNumbers
      }
    })
    
  } catch (error: any) {
    console.error("Test batch API error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch batch numbers" },
      { status: 500 }
    )
  }
} 