import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import { User, UserRole } from '../../../../lib/models';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { name, email, password, role, profile, pharmacyInfo, governmentInfo } = await req.json();
  if (!Object.values(UserRole).includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
    profile,
    pharmacyInfo,
    governmentInfo,
  });
  return NextResponse.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
} 