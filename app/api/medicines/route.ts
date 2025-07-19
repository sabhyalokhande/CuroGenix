import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Medicine } from '@/lib/models';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

function verifyAuth(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  const token = auth.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const pharmacyId = searchParams.get('pharmacyId');
  const search = searchParams.get('search');
  const category = searchParams.get('category');
  const lowStock = searchParams.get('lowStock');

  if (id) {
    const med = await Medicine.findById(id);
    if (!med) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    // If pharmacyId is provided, verify the medicine belongs to that pharmacy
    if (pharmacyId && med.pharmacyId.toString() !== pharmacyId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json(med);
  }

  // Build query
  let query: any = {};
  
  if (pharmacyId) {
    query.pharmacyId = pharmacyId;
  }
  
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  
  if (category) {
    query.category = category;
  }
  
  if (lowStock === 'true') {
    query.$expr = { $lte: ['$stock', '$minimumStock'] };
  }

  const meds = await Medicine.find(query).sort({ lastUpdated: -1 });
  return NextResponse.json(meds);
}

export async function POST(req: NextRequest) {
  const user = verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const data = await req.json();
  
  // Set pharmacyId from authenticated user
  if (typeof user === 'object' && user.userId) {
    data.pharmacyId = user.userId;
  }
  
  // Calculate minimumStock automatically if not provided
  if (!data.minimumStock) {
    data.minimumStock = calculateMinimumStock(data.name, data.category);
  }
  
  const med = await Medicine.create(data);
  return NextResponse.json(med);
}

// Helper function to calculate minimumStock based on medicine name and category
function calculateMinimumStock(name: string, category?: string): number {
  const medicineName = name.toLowerCase();
  
  if (medicineName.includes('paracetamol') || medicineName.includes('acetaminophen')) {
    return 50;
  } else if (medicineName.includes('insulin')) {
    return 10;
  } else if (medicineName.includes('amoxicillin') || medicineName.includes('antibiotic')) {
    return 30;
  } else if (medicineName.includes('aspirin')) {
    return 40;
  } else if (medicineName.includes('omeprazole')) {
    return 20;
  } else if (medicineName.includes('metformin')) {
    return 30;
  } else if (medicineName.includes('cetirizine') || medicineName.includes('antihistamine')) {
    return 25;
  } else if (medicineName.includes('ibuprofen')) {
    return 40;
  } else if (medicineName.includes('atorvastatin') || medicineName.includes('statin')) {
    return 15;
  } else if (medicineName.includes('losartan') || medicineName.includes('blood pressure')) {
    return 20;
  } else if (category && category.toLowerCase().includes('injection')) {
    return 5;
  } else if (category && category.toLowerCase().includes('tablet')) {
    return 25;
  } else if (category && category.toLowerCase().includes('syrup')) {
    return 15;
  }
  
  return 10; // default
}

export async function PUT(req: NextRequest) {
  const user = verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const { id, ...update } = await req.json();
  
  // Get the medicine and verify it belongs to the user
  const med = await Medicine.findById(id);
  if (!med) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  // Check if the medicine belongs to the authenticated user
  if (typeof user === 'object' && user.userId && med.pharmacyId.toString() !== user.userId) {
    return NextResponse.json({ error: 'Unauthorized - You can only edit your own medicines' }, { status: 403 });
  }
  
  // Update the medicine
  const updatedMed = await Medicine.findByIdAndUpdate(id, update, { new: true });
  return NextResponse.json(updatedMed);
}

export async function DELETE(req: NextRequest) {
  const user = verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const { id } = await req.json();
  
  // Get the medicine and verify it belongs to the user
  const med = await Medicine.findById(id);
  if (!med) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  // Check if the medicine belongs to the authenticated user
  if (typeof user === 'object' && user.userId && med.pharmacyId.toString() !== user.userId) {
    return NextResponse.json({ error: 'Unauthorized - You can only delete your own medicines' }, { status: 403 });
  }
  
  // Delete the medicine
  await Medicine.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
} 