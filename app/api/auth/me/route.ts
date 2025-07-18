import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import { User } from '../../../../lib/models';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const token = auth.split(' ')[1];
  let decoded: JwtPayload | null = null;
  try {
    decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
    return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
  }
  await dbConnect();
  const user = await User.findById(decoded.userId).select('-passwordHash');
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(user);
} 