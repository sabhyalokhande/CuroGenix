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
  if (id) {
    const med = await Medicine.findById(id);
    if (!med) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(med);
  }
  const meds = await Medicine.find();
  return NextResponse.json(meds);
}

export async function POST(req: NextRequest) {
  const user = verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const data = await req.json();
  const med = await Medicine.create(data);
  return NextResponse.json(med);
}

export async function PUT(req: NextRequest) {
  const user = verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const { id, ...update } = await req.json();
  const med = await Medicine.findByIdAndUpdate(id, update, { new: true });
  if (!med) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(med);
}

export async function DELETE(req: NextRequest) {
  const user = verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const { id } = await req.json();
  const med = await Medicine.findByIdAndDelete(id);
  if (!med) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
} 