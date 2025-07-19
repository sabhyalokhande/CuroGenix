import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Receipt } from '@/lib/models';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

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
  if (id) {
    const doc = await Receipt.findById(id);
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(doc);
  }
  const docs = await Receipt.find();
  return NextResponse.json(docs);
}

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

    const { imageUrl, pharmacyName, totalAmount, items } = await req.json()
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    const receipt = new Receipt({
      patientId: decoded.userId,
      imageUrl,
      pharmacyName: pharmacyName || "Unknown Pharmacy",
      totalAmount: totalAmount || 0,
      items: items || [],
      uploadedAt: new Date()
    })

    await receipt.save()

    return NextResponse.json({ 
      success: true, 
      message: 'Receipt uploaded successfully',
      receiptId: receipt._id 
    })

  } catch (error: any) {
    console.error('Receipt upload error:', error)
    return NextResponse.json({ error: 'Failed to upload receipt' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const user = verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const { id, ...update } = await req.json();
  const doc = await Receipt.findByIdAndUpdate(id, update, { new: true });
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(doc);
}

export async function DELETE(req: NextRequest) {
  const user = verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const { id } = await req.json();
  const doc = await Receipt.findByIdAndDelete(id);
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
} 