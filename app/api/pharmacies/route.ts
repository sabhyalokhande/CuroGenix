import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User, UserRole } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Fetch all users with pharmacy role
    const pharmacies = await User.find({ 
      role: UserRole.PHARMACY 
    }).select('name pharmacyInfo');
    
    // Transform the data to match the expected format
    const transformedPharmacies = pharmacies.map(pharmacy => ({
      _id: pharmacy._id,
      name: pharmacy.pharmacyInfo?.name || pharmacy.name,
      address: pharmacy.pharmacyInfo?.address || 'Address not available',
      contact: pharmacy.pharmacyInfo?.contact || 'Contact not available',
      licenseNumber: pharmacy.pharmacyInfo?.licenseNumber || 'License not available',
      // Add some mock data for demonstration
      rating: Math.floor(Math.random() * 5) + 1,
      distance: (Math.random() * 5 + 0.5).toFixed(1),
      isOpen: Math.random() > 0.3, // 70% chance of being open
    }));

    return NextResponse.json(transformedPharmacies);
  } catch (error) {
    console.error('Error fetching pharmacies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pharmacies' },
      { status: 500 }
    );
  }
} 