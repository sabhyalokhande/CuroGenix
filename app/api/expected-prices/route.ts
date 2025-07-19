import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

// Define the ExpectedPrice schema
const ExpectedPriceSchema = new mongoose.Schema({
  medicine_name: { type: String, required: true },
  expected_price: { type: Number, required: true }
});

const ExpectedPrice = mongoose.models.ExpectedPrice || mongoose.model('ExpectedPrice', ExpectedPriceSchema);

function preprocessMedicineName(name: string): string {
  // Common OCR error mappings
  const ocrMappings: { [key: string]: string } = {
    'methablue': 'methredin',
    'furidiar': 'fulodin',
    'ciproxin': 'ciproflox',
    'neosabin': 'neosporin',
    'evion w': 'evion',
    'evion 400': 'evion'
  };
  
  let processed = name
    .toLowerCase()
    .replace(/\s+/g, ' ') // Normalize spaces
    .replace(/\s+\d+$/, '') // Remove trailing numbers with spaces (like "400" from "Evion 400")
    .replace(/\d+$/, '') // Remove trailing numbers
    .replace(/\s+w$/, '') // Remove trailing "w" (like "Evion w")
    .replace(/\s+mg$/, '') // Remove trailing "mg"
    .replace(/\s+tablet$/, '') // Remove trailing "tablet"
    .trim();
  
  // Apply OCR mappings
  if (ocrMappings[processed]) {
    console.log(`🔄 OCR mapping: "${name}" → "${ocrMappings[processed]}"`);
    processed = ocrMappings[processed];
  }
  
  return processed;
}

function findBestMatch(searchName: string, medicineNames: string[]): { name: string; similarity: number } | null {
  if (medicineNames.length === 0) return null;
  
  const stringSimilarity = require('string-similarity');
  
  // Preprocess the search name
  const processedSearchName = preprocessMedicineName(searchName);
  
  // Preprocess all medicine names for comparison
  const processedMedicineNames = medicineNames.map(name => preprocessMedicineName(name));
  
  console.log(`Searching for: "${searchName}" (processed: "${processedSearchName}")`);
  console.log(`Available medicines:`, processedMedicineNames);
  
  const { bestMatch } = stringSimilarity.findBestMatch(processedSearchName, processedMedicineNames);
  
  console.log(`Best match: "${bestMatch.target}" with similarity: ${(bestMatch.rating * 100).toFixed(1)}%`);
  
  // Lower threshold to 0.3 (30% match) to catch more OCR variations
  if (bestMatch.rating > 0.3) {
    // Find the original medicine name (not preprocessed)
    const originalName = medicineNames[processedMedicineNames.indexOf(bestMatch.target)];
    console.log(`✅ Match found: "${searchName}" → "${originalName}" (${(bestMatch.rating * 100).toFixed(1)}%)`);
    return {
      name: originalName,
      similarity: bestMatch.rating
    };
  }
  
  console.log(`❌ No good match found for "${searchName}" (best was "${bestMatch.target}" at ${(bestMatch.rating * 100).toFixed(1)}%)`);
  return null;
}

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const medicineName = searchParams.get('medicine_name');
  
  if (medicineName) {
    console.log(`\n🔍 Looking up medicine: "${medicineName}"`);
    
    // Get all medicine names from the database
    const allMedicines = await ExpectedPrice.find({}, 'medicine_name');
    const medicineNames = allMedicines.map(med => med.medicine_name);
    
    console.log(`📋 Database has ${medicineNames.length} medicines`);
    
    // Use fuzzy matching to find the best match
    const bestMatch = findBestMatch(medicineName, medicineNames);
    
    if (bestMatch) {
      // Get the full record for the best match
      const expectedPrice = await ExpectedPrice.findOne({
        medicine_name: bestMatch.name
      });
      
      if (expectedPrice) {
        console.log(`💰 Found expected price: ₹${expectedPrice.expected_price} for "${bestMatch.name}"`);
        return NextResponse.json({
          ...expectedPrice.toObject(),
          matched_name: bestMatch.name,
          similarity: bestMatch.similarity,
          original_search: medicineName
        });
      }
    }
    
    console.log(`❌ No match found for "${medicineName}"`);
    return NextResponse.json({ error: 'Medicine not found' }, { status: 404 });
  }
  
  // If no medicine_name provided, return all expected prices
  const expectedPrices = await ExpectedPrice.find();
  return NextResponse.json(expectedPrices);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const expectedPrice = await ExpectedPrice.create(data);
  return NextResponse.json(expectedPrice);
} 