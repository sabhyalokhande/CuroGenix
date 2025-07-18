import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Receipt } from '@/lib/models';
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
    const doc = await Receipt.findById(id);
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(doc);
  }
  const docs = await Receipt.find();
  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  const user = verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const data = await req.json();
  const doc = await Receipt.create(data);
  return NextResponse.json(doc);
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