import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import { Medicine } from '../../../../lib/models';
import { parse } from 'csv-parse/sync';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // Get pharmacy ID from auth token
    const auth = request.headers.get('authorization');
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = auth.split(' ')[1];
    let decoded: any = null;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    const pharmacyId = decoded.userId;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'Only CSV files are allowed' }, { status: 400 });
    }

    // Read file content
    const fileBuffer = await file.arrayBuffer();
    const fileContent = new TextDecoder().decode(fileBuffer);

    try {
      // Parse CSV
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      let processedCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      // Process each record
      for (const record of records as any[]) {
        try {
          // Validate required fields
          if (!record.name || !record.stock || !record.price) {
            throw new Error(`Missing required fields for record: ${JSON.stringify(record)}`);
          }

          // Convert string values to numbers
          const stock = parseInt(record.stock);
          const price = parseFloat(record.price);

          if (isNaN(stock) || isNaN(price)) {
            throw new Error(`Invalid numeric values for record: ${record.name}`);
          }

          // Calculate minimumStock automatically based on medicine name and category
          let minimumStock = 10; // default
          
          if (record.name.toLowerCase().includes('paracetamol') || record.name.toLowerCase().includes('acetaminophen')) {
            minimumStock = 50;
          } else if (record.name.toLowerCase().includes('insulin')) {
            minimumStock = 10;
          } else if (record.name.toLowerCase().includes('amoxicillin') || record.name.toLowerCase().includes('antibiotic')) {
            minimumStock = 30;
          } else if (record.name.toLowerCase().includes('aspirin')) {
            minimumStock = 40;
          } else if (record.name.toLowerCase().includes('omeprazole')) {
            minimumStock = 20;
          } else if (record.name.toLowerCase().includes('metformin')) {
            minimumStock = 30;
          } else if (record.name.toLowerCase().includes('cetirizine') || record.name.toLowerCase().includes('antihistamine')) {
            minimumStock = 25;
          } else if (record.name.toLowerCase().includes('ibuprofen')) {
            minimumStock = 40;
          } else if (record.name.toLowerCase().includes('atorvastatin') || record.name.toLowerCase().includes('statin')) {
            minimumStock = 15;
          } else if (record.name.toLowerCase().includes('losartan') || record.name.toLowerCase().includes('blood pressure')) {
            minimumStock = 20;
          } else if (record.category && record.category.toLowerCase().includes('injection')) {
            minimumStock = 5;
          } else if (record.category && record.category.toLowerCase().includes('tablet')) {
            minimumStock = 25;
          } else if (record.category && record.category.toLowerCase().includes('syrup')) {
            minimumStock = 15;
          }

          // Check if medicine already exists
          const existingMedicine = await Medicine.findOne({
            pharmacyId,
            name: record.name
          });

          if (existingMedicine) {
            // Update existing medicine
            existingMedicine.stock = stock;
            existingMedicine.minimumStock = minimumStock;
            existingMedicine.price = price;
            existingMedicine.manufacturer = record.manufacturer || existingMedicine.manufacturer;
            existingMedicine.category = record.category || existingMedicine.category;
            existingMedicine.batchNumber = record.batchNumber || existingMedicine.batchNumber;
            existingMedicine.location = record.location || existingMedicine.location;
            existingMedicine.lastUpdated = new Date();
            await existingMedicine.save();
          } else {
            // Create new medicine
            const newMedicine = new Medicine({
              pharmacyId,
              name: record.name,
              description: record.description || '',
              stock,
              minimumStock,
              price,
              manufacturer: record.manufacturer || '',
              category: record.category || '',
              batchNumber: record.batchNumber || '',
              location: record.location || '',
              lastUpdated: new Date()
            });
            await newMedicine.save();
          }

          processedCount++;
        } catch (error) {
          failedCount++;
          errors.push(`Row ${processedCount + failedCount}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Successfully processed ${processedCount} records${failedCount > 0 ? `, ${failedCount} failed` : ''}`,
        processed: processedCount,
        failed: failedCount,
        errors: errors.length > 0 ? errors : undefined
      });

    } catch (parseError) {
      return NextResponse.json({
        error: 'Failed to parse CSV file',
        details: parseError instanceof Error ? parseError.message : 'Unknown error'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 